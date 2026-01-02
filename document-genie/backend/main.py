from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, query, auth, cleanup
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload")
app.include_router(query.router, prefix="/query")
app.include_router(auth.router, prefix="/auth")
app.include_router(cleanup.router, prefix="/clear_pdfs")

