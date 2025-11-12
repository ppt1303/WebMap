from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserLogin(BaseModel):
    username: str
    password: str

fake_users_db = {
    "admin": {"username": "admin", "password": "123", "role": "admin"},
    "user": {"username": "user", "password": "123", "role": "user"},
}

@app.post("/api/auth/login")
async def login(data: UserLogin):
    user = fake_users_db.get(data.username)
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
    return {
        "access_token": data.username,
        "token_type": "bearer",
        "user": {"username": data.username, "role": user["role"]}
    }

class MarkerBase(BaseModel):
    name: str
    geocode: List[float]
    iconSrc: Optional[str] = "/img/marker-icon.png"
    desc: Optional[str] = None

class Marker(MarkerBase):
    id: int

class MarkerUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    amount: Optional[str] = None
    iconSrc: Optional[str] = None
    geocode: Optional[List[float]] = None

markers_db = []
next_id = 1

@app.get("/api/markers", response_model=List[Marker])
async def get_markers():
    return [{**m, "geocode": [m["lat"], m["lng"]]} for m in markers_db]

@app.post("/api/markers", response_model=Marker, status_code=201)
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
    markers_db.append(marker_dict)
    return marker_dict

@app.put("/api/markers/{marker_id}", response_model=Marker)
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

@app.delete("/api/markers/{marker_id}")
async def delete_marker(marker_id: int):
    global markers_db
    before = len(markers_db)
    markers_db = [m for m in markers_db if m["id"] != marker_id]
    if len(markers_db) == before:
        raise HTTPException(status_code=404, detail="Marker không tồn tại")
    return {"message": "Đã xóa", "id": marker_id}