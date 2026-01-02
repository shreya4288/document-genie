from fastapi import APIRouter, Request, HTTPException
from db.mongo import users_collection
from services.vector_store import delete_user_vectors

router = APIRouter()

@router.delete("/")
async def clear_user_pdfs(request: Request):
    delete_user_vectors()
    user_email = request.headers.get("email")
    if not user_email:
        raise HTTPException(status_code=400, detail="Email header missing")

    result = users_collection.update_one(
        {"email": user_email},
        {"$set": {"pdfs": []}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no PDFs to delete")

    return {"message": "PDFs cleared for user"}
