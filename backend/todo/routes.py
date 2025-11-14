from fastapi import APIRouter, HTTPException
from todo.database import col1, col2
from todo.models import UserLogin, Marker, MarkerBase, MarkerUpdate
from typing import List

route=APIRouter()

@route.post("/api/auth/login")
async def login(data: UserLogin):
    user = col2.find_one({"user": data.username})
    if not user or user["pass"] != data.password:
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
    return {
        "access_token": data.username,
        "token_type": "bearer",
        "user": {
            "username": user["user"],
            "role": user["auth"]
        }
    }

next_id = 1

@route.get("/api/markers", response_model=List[Marker])
async def get_markers():
    return [{**m, "geocode": [m["lat"], m["lng"]]} for m in markers_db]

@route.post("/api/markers", response_model=Marker, status_code=201)
async def create_marker(marker: MarkerBase):
    global next_id
    if not marker.geocode or len(marker.geocode) != 2:
        raise HTTPException(status_code=400, detail="Thiếu hoặc sai geocode")
    marker_dict = {
        "id": next_id,
        "name": marker.name,
        "desc": marker.desc,
        "lat": marker.geocode[0],
        "lng": marker.geocode[1],
        "geocode": marker.geocode,
        "iconSrc": marker.iconSrc or "/img/marker-icon.png",
    }
    next_id += 1
    col1.insert_one(marker_dict)
    return marker_dict

@route.put("/api/markers/{marker_id}", response_model=Marker)
async def update_marker(marker_id: int, updated: MarkerUpdate):
    for m in markers_db:
        if m["id"] == marker_id:
            if updated.geocode and len(updated.geocode) == 2:
                m["lat"] = float(updated.geocode[0])
                m["lng"] = float(updated.geocode[1])
                m["geocode"] = updated.geocode
            if updated.name is not None: m["name"] = updated.name
            if updated.desc is not None: m["desc"] = updated.desc
            if updated.amount is not None: m["amount"] = updated.amount
            if updated.iconSrc is not None: m["iconSrc"] = updated.iconSrc
            return m
    raise HTTPException(status_code=404, detail="Marker không tồn tại")

@route.delete("/api/markers/{marker_id}")
async def delete_marker(marker_id: int):
    global markers_db
    before = len(markers_db)
    markers_db = [m for m in markers_db if m["id"] != marker_id]
    if len(markers_db) == before:
        raise HTTPException(status_code=404, detail="Marker không tồn tại")
    return {"message": "Đã xóa", "id": marker_id}