# backend/routes/progress.py
from fastapi import APIRouter, HTTPException, Request
from db.mongo import learning_progress_collection

router = APIRouter()

@router.get("/progress/{email}")
async def get_learning_progress(email: str):
    entries = list(learning_progress_collection.find({"email": email}))
    for e in entries:
        e["_id"] = str(e["_id"])  # Convert ObjectId to string for JSON
    return {"progress": entries}
