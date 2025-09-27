import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MONGO_DB", "webmap")

# Kết nối MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
col = db["db_test"]

# Tạo ứng dụng FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------- MODELS -----------
class MarkerIn(BaseModel):
    geocode: List[float]         
    name: str
    desc: Optional[str] = None
    iconSrc: Optional[str] = None
    popup: Optional[str] = None

class MarkerOut(MarkerIn):
    id: str = Field(..., alias="_id")  # chuyển ObjectId -> str

def to_out(doc) -> MarkerOut:
    doc["_id"] = str(doc["_id"])
    return MarkerOut(**doc)

# ----------- ROUTES -----------

@app.get("/health")
def health():
    client.admin.command("ping")
    return {"status": "Mongo connected"}

@app.get("/api/markers", response_model=List[MarkerOut])
def list_markers():
    return [to_out(d) for d in col.find()]

@app.post("/api/markers", response_model=MarkerOut, status_code=201)
def create_marker(m: MarkerIn):
    doc = m.model_dump()
    ins = col.insert_one(doc)
    saved = col.find_one({"_id": ins.inserted_id})
    return to_out(saved)

@app.get("/api/markers/{id}", response_model=MarkerOut)
def get_marker(id: str):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid id")
    doc = col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, "Not found")
    return to_out(doc)

@app.delete("/api/markers/{id}", status_code=204)
def delete_marker(id: str):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid id")
    res = col.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return
