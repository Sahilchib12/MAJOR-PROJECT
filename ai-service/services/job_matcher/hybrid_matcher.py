from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def preprocess_text(skill_list):
    """Convert a list of skills to lowercase text for matching"""
    if isinstance(skill_list, list):
        return " ".join([str(skill) for skill in skill_list]).lower()
    elif isinstance(skill_list, str):
        return skill_list.lower()
    else:
        return ""

def compute_similarity(user_skills, user_experience, jobs):
    """
    Match user skills and experience with job requirements.
    :param user_skills: List of user skills
    :param user_experience: User's experience level (numeric)
    :param jobs: List of job objects with skills and experience fields
    :return: Sorted jobs with relevance scores
    """
    print(f"Computing similarity for user with experience: {user_experience}")
    
    # Handle empty data cases
    if not user_skills or not jobs:
        print("No skills or jobs provided")
        return jobs
    
    # Make sure user_experience is numeric
    try:
        user_exp_numeric = int(user_experience)
    except (ValueError, TypeError):
        user_exp_numeric = 0
        
    print(f"User experience value: {user_exp_numeric}")
    
    # Prepare job skill texts
    job_texts = []
    for job in jobs:
        job_skills = job.get('skills', [])
        # Ensure job_skills is a list of strings
        if isinstance(job_skills, list):
            job_texts.append(preprocess_text(job_skills))
        else:
            job_texts.append("")
    
    # Ensure user_skills is a list of strings
    if isinstance(user_skills, list):
        user_text = preprocess_text(user_skills)
    else:
        user_text = ""
    
    # Check if we have valid text to process
    if not user_text.strip():
        print("No valid user skills provided")
        return jobs
    
    try:
        # Compute TF-IDF vectors
        vectorizer = TfidfVectorizer(min_df=1, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([user_text] + job_texts)
        user_vector = tfidf_matrix[0]
        job_vectors = tfidf_matrix[1:]
        
        # Compute skill similarity
        skill_scores = cosine_similarity(user_vector, job_vectors).flatten()
        
        # Compute experience score (Inverse Difference, higher is better)
        experience_scores = []
        for job in jobs:
            # Ensure job experience is numeric
            try:
                job_exp = job.get('experienceNumeric', 0)
                if isinstance(job_exp, str):
                    job_exp = int(job_exp)
            except (ValueError, TypeError):
                job_exp = 0
                
            diff = abs(user_exp_numeric - job_exp)
            exp_score = 1 / (1 + diff)
            experience_scores.append(exp_score)
            
        # Final score (weighted combination of skills & experience)
        final_scores = [0.7 * skill + 0.3 * exp for skill, exp in zip(skill_scores, experience_scores)]
        
        # Add scores to job objects
        scored_jobs = []
        for job, score, skill_score, exp_score in zip(jobs, final_scores, skill_scores, experience_scores):
            job_copy = dict(job)
            job_copy['relevance_score'] = float(score)
            job_copy['skill_match'] = float(skill_score)
            job_copy['experience_match'] = float(exp_score)
            scored_jobs.append(job_copy)
        
        # Rank jobs based on score (descending)
        ranked_jobs = sorted(scored_jobs, key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        # Log some stats
        print(f"Successfully ranked {len(ranked_jobs)} jobs")
        if ranked_jobs:
            print(f"Top job score: {ranked_jobs[0].get('relevance_score', 0)}")
            
        return ranked_jobs
    except Exception as e:
        print(f"Error in job matching: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return original jobs if there's an error
        return jobs
