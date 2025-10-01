from pymongo import MongoClient

MONGO_URI ="mongodb://localhost:27017"
DB_NAME="webmap"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
col = db["db_test"]
