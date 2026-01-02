from groq import Groq
import os
from dotenv import load_dotenv
from fastapi import  HTTPException


load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY") 
if not groq_api_key:
    raise HTTPException(status_code=500, detail="Groq API key not found in environment")

    
client = Groq(api_key=groq_api_key)


def generate_flashcards_from_text(pdf_text: str, num_cards: int = 9):
    print("hello")
    prompt = f"""
You are a helpful study assistant. Generate {num_cards} flashcards from the academic content provided below.

Each flashcard should include:
- A clear and concise question
- A direct and informative answer

Return the flashcards as a JSON array, like this:
[
  {{
    "question": "What is ...?",
    "answer": "..."
  }},
  ...
]
No explanations. No markdown. Just valid JSON.

Content:
\"\"\"
{pdf_text[:3500]}
\"\"\"
"""

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You generate helpful and accurate flashcards from educational material."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1024,
        )
        reply = response.choices[0].message.content.strip()
        return reply
    except Exception as e:
        print("❌ Error generating flashcards:", e)
        return []
