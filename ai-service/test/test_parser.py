# tests/test_parser.py
def test_skill_extraction():
    text = "Proficient in Python and AWS. 5+ years experience."
    skills = extract_skills(text)
    assert "Python" in skills
    assert "AWS" in skills