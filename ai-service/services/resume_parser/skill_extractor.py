# services/resume_parser/skill_extractor.py
import spacy
import re

nlp = None

def load_models():
    global nlp
    nlp = spacy.load("en_core_web_sm")

def extract_skills(text: str) -> list:
    # Rule 1: Explicit skill mentions
    skill_pattern = r"(?i)\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Go|Rust|Ruby|Swift|Kotlin|PHP|Perl|Scala|HTML|CSS|SASS|LESS|React|Angular|Vue|Node\.js|Express\.js|Django|Flask|Spring|ASP\.NET|FastAPI|TensorFlow|PyTorch|Keras|Scikit-learn|NLTK|OpenCV|SQL|MySQL|PostgreSQL|MongoDB|SQLite|Redis|GraphQL|Docker|Kubernetes|AWS|Azure|GCP|Git|Jenkins|CI/CD|Terraform|Ansible|Machine Learning|Deep Learning|AI|Data Science|Cybersecurity|Networking|Blockchain|DevOps)\b"
    
    skills = re.findall(skill_pattern, text)
    
    # Rule 2: SpaCy NER for implicit mentions
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "ORG" and ent.text.lower() in ["aws", "react"]:
            skills.append(ent.text)
    
    return list(set(skills))