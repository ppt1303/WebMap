from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from typing import List

from database import markers_collection
from models import Marker

app = FastAPI()

# Cho phép React call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev thì cho phép tất cả
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Convert ObjectId -> str
def marker_helper(marker) -> dict:
    return {
        "id": str(marker["_id"]),
        "geocode": marker["geocode"],
        "popup": marker["popup"],
        "iconSrc": marker["iconSrc"],
        "name": marker["name"],
        "desc": marker["desc"],
    }

# Lấy danh sách markers
@app.get("/api/markers", response_model=List[Marker])
async def get_markers():
    markers = []
    async for marker in markers_collection.find():
        markers.append(marker_helper(marker))
    return markers

# Thêm marker mới
@app.post("/api/markers", response_model=Marker)
async def add_marker(marker: Marker):
    new_marker = marker.dict(exclude_unset=True)
    result = await markers_collection.insert_one(new_marker)
    created = await markers_collection.find_one({"_id": result.inserted_id})
    return marker_helper(created)

# Xoá marker theo id
@app.delete("/api/markers/{marker_id}")
async def delete_marker(marker_id: str):
    result = await markers_collection.delete_one({"_id": ObjectId(marker_id)})
    if result.deleted_count == 1:
        return {"message": "Deleted", "id": marker_id}
    raise HTTPException(status_code=404, detail="Marker not found")