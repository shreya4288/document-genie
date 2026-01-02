# Smart Document Assistant

An intelligent assistant that transforms static PDFs into interactive learning experiences with real-time Q&A, quiz generation, and personalized learning analytics.

## 🔗 Demo

[Watch on YouTube](https://www.youtube.com/watch?v=Ixc3t8IubH8)

---

## ✨ Features

- 📄 Upload any **PDF document**
- 🤖 Ask **questions** based on the document using RAG (Retrieval-Augmented Generation)
- 🧠 Get a **quiz** generated from your document content
- 📈 View a **performance report** with weak area detection
- 📝 Download/Export your results
- 🌙 Dark mode support
- 🔐 User authentication (register/login)
- 📊 Visualize your learning with **charts**

---

## 💠 Tech Stack

### 🚀 Frontend

- React (Vite)
- TailwindCSS + Framer Motion
- Recharts for visualizations
- React Router for routing

### 🧠 Backend

- FastAPI
- MongoDB for structured data
- Qdrant for vector search
- SentenceTransformers for embedding
- Groq LLM for response generation
- JWT for authentication

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/bhavana1312/smart-doc-assistant.git
cd smart-doc-assistant
```
### 2️⃣ Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
📁 Create a .env in backend/ directory:

```bash
MONGO_URI=your_mongo_uri
GROQ_API_KEY=your_groq_key
```
### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```
📁 Create a .env in frontend/directory:

```bash
VITE_BACKEND_URL=http://localhost:8000
```

