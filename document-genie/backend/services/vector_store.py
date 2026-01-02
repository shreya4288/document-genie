import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

load_dotenv()

qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")

if not qdrant_url or not qdrant_api_key:
    raise ValueError("Qdrant URL or API key is missing from environment variables")

client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key,
)

print(client.get_collections())


def init_collection(collection:str,dim:int):
    if collection not in [c.name for c in client.get_collections().collections]:
        client.recreate_collection(
            collection_name=collection,
            vectors_config=VectorParams(size=dim,distance=Distance.COSINE)
        )

def insert_embeddings(collection:str, embeddings:list, chunks:list):
    assert len(embeddings) == len(chunks), "❌ Mismatch between embeddings and chunks!"
    points = [PointStruct(id=i, vector=embeddings[i], payload={"text": chunks[i]}) for i in range(len(chunks))]
    print(f"✅ Inserting {len(points)} points into '{collection}'")
    client.upsert(collection_name=collection, points=points)

def retrieve_top_k(collection:str,query_embedding:list,top_k:int):
    search_result = client.search(
        collection_name=collection,
        query_vector=query_embedding,
        limit=top_k
    )
    return [{"text":hit.payload["text"],"score":hit.score} for hit in search_result]

def delete_user_vectors():
    collection_name = "documents"
    try:
        client.delete_collection(collection_name)
        print(f"🗑️ Deleted collection: {collection_name}")
    except Exception as e:
        print(f"⚠️ Failed to delete collection: {e}")