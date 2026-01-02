from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017") 
db = client["smart_assistant"]
users_collection = db["users"]
learning_progress_collection = db["learning_progress"]

