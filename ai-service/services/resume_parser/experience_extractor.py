# services/resume_parser/experience_extractor.py
import re

def extract_experience(text: str) -> int:
    match = re.search(r"(\d+)\+? years? experience", text, re.IGNORECASE)
    return int(match.group(1)) if match else 0