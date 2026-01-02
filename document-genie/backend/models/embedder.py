from sentence_transformers import SentenceTransformer

model=SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

def get_embeddings(texts:list[str]):
    return model.encode(texts).tolist()
