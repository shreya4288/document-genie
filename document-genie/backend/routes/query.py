from fastapi import APIRouter, Request
from pydantic import BaseModel
from models.embedder import get_embeddings
from services.vector_store import retrieve_top_k
from groq import Groq
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from db.mongo import users_collection
from services.generate_questions import generate_mcq_from_text
from services.generate_flashcards import generate_flashcards_from_text
from db.mongo import learning_progress_collection
from datetime import datetime


load_dotenv()

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

@router.post("/")
async def query_documents(data: QueryRequest):
    question = data.question
    top_k = data.top_k

    query_embedding = get_embeddings([question])[0]

    results = retrieve_top_k("documents", query_embedding, top_k)
    chunks = [r["text"] for r in results]

    context = "\n\n".join(chunks)
    prompt = f"""You are a helpful assistant that answers user queries based on the provided document context.

Context:
{context}

Question: {question}
Answer:"""
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="Groq API key not found in environment")

    
    client = Groq(api_key=groq_api_key)

    chat_completion = client.chat.completions.create(
        model="llama3-70b-8192",  
        messages=[
            {"role": "system", "content": "Answer questions using only the given context."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=512
    )

    answer = chat_completion.choices[0].message.content

    return {
        "query": question,
        "results": results,
        "answer": answer
    }



@router.post("/generate-quiz")
async def generate_quiz(email: str):
    user = users_collection.find_one({"email": email})
    if not user or "pdfs" not in user or len(user["pdfs"]) == 0:
        raise HTTPException(status_code=404, detail="No PDFs found for user")

    pdf_text = user["pdfs"][-1]["text"]
    response = generate_mcq_from_text(pdf_text)
    return JSONResponse(content={"response": response})


@router.post("/generate-flashcards")
async def generate_flashcards(email: str):
    user = users_collection.find_one({"email": email})
    if not user or "pdfs" not in user or len(user["pdfs"]) == 0:
        raise HTTPException(status_code=404, detail="No PDFs found for user")

    pdf_text = user["pdfs"][-1]["text"]
    response = generate_flashcards_from_text(pdf_text)

    return JSONResponse(content={"response": response})


@router.post("/save-quiz-progress")
async def save_quiz_progress(request: Request):
    body = await request.json()
    email = body["email"]
    score = body["score"]
    total = body["total_questions"]
    correct = body["correct_answers"]
    weak_topics = body.get("weak_topics", [])

    doc = {
        "email": email,
        "activity_type": "quiz",
        "score": score,
        "total_questions": total,
        "correct_answers": correct,
        "weak_topics": weak_topics,
        "timestamp": datetime.now()
    }

    learning_progress_collection.insert_one(doc)
    return {"status": "success"}

@router.get("/progress/{email}")
async def get_learning_progress(email: str):
    entries = list(learning_progress_collection.find({"email": email}))
    for e in entries:
        e["_id"] = str(e["_id"])  # Convert ObjectId to string for JSON
    return {"progress": entries}