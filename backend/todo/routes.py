from fastapi import APIRouter
from todo.database import col
from todo.models import MarkerIn, MarkerOut, to_out

route=APIRouter()

@route.post("/api/markers", response_model=MarkerOut, status_code=201)
def create_marker(m: MarkerIn):
    doc = m.model_dump()
    ins = col.insert_one(doc)
    saved = col.find_one({"_id": ins.inserted_id})
    return to_out(saved)