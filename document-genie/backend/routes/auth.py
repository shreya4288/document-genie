from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.mongo import users_collection
from utils.auth import hash_password, verify_password

router = APIRouter()

class User(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register")
def register(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "hashed_password": hash_password(user.password),
        "pdfs": [] 
    })
    return {"message": "User registered successfully"}

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(user: LoginRequest):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "name": db_user["name"],"email": db_user["email"],}
