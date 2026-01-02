from groq import Groq
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY") 
if not groq_api_key:
    raise HTTPException(status_code=500, detail="Groq API key not found in environment")

client = Groq(api_key=groq_api_key)

def generate_mcq_from_text(pdf_text: str, num_questions: int = 10):
    prompt = f"""
You are an expert quiz generator. Based on the academic content provided, generate {num_questions} high-quality multiple choice questions (MCQs). 

Each MCQ must include:
- "question": The question text.
- "options": Exactly 4 answer choices.
- "answer": The correct option (must match exactly one of the options).
- "topic": A brief topic name related to the question (e.g., "OS", "DBMS", "CN").
- "explanation": A 1-2 sentence reason explaining why the answer is correct.

⚠️ Return only valid JSON in this format:
[
  {{
    "question": "What is the color of the sky?",
    "options": ["A. Blue ", "B. Green", "C. Red", "D. Yellow"],
    "answer": "A. Blue",
    "topic": "OS",
    "explanation": "Blue is correct because..."
  }},
  ...
] No markdown. Just valid JSON. No extra text

📄 Content to use:
\"\"\"
{pdf_text[:3500]}
\"\"\"
"""

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You generate high-quality MCQs based on educational text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        
        reply = response.choices[0].message.content.strip()
        print(reply)
        return reply
    except Exception as e:
        print("❌ Error generating MCQs:", e)
        return []
