from fastapi import APIRouter, UploadFile, File, Request, HTTPException
import os
from bson import Binary
from db.mongo import users_collection
from services.pdf_loader import extract_text_from_pdf
from utils.chunker import chunk_text
from models.embedder import get_embeddings
from services.vector_store import init_collection, insert_embeddings

router = APIRouter()

@router.post("/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    print("🟡 Headers:", request.headers)
    print("🟡 File name:", file.filename if file else "❌ No file received")

    user_email = request.headers.get("email")
    if not user_email:
        raise HTTPException(status_code=400, detail="Missing email in headers")

    contents = await file.read()

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    text = extract_text_from_pdf(file_path)
    print("🔹 Extracted text length:", len(text))

    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks)
    print(f"🔹 Generated {len(embeddings)} embeddings")

    collection_name = "documents"
    init_collection(collection_name, dim=768)
    insert_embeddings(collection_name, embeddings, chunks)

    pdf_entry = {
        "filename": file.filename,
        "text": text,
        "pdf_data": Binary(contents)
    }

    result = users_collection.update_one(
        {"email": user_email},
        {"$push": {"pdfs": pdf_entry}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    os.remove(file_path)

    return {"message": "File processed, embedded, and stored in MongoDB"}
