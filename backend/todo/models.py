# models.py
from typing import List, Optional
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str
    qty: int = Field(0, ge=0)

class MarkerBase(BaseModel):
    idUnit: str = Field(..., description="Mã đơn vị (chuỗi, unique)")
    name: str
    geocode: List[float]
    amount: Optional[int] = 0
    iconSrc: Optional[str] = "/img/marker-icon.png"
    desc: Optional[str] = None
    item: Optional[str] = None
    items: Optional[List[Item]] = None

class Marker(MarkerBase):
    pass

class MarkerUpdate(BaseModel):
    idUnit: Optional[str] = None
    name: Optional[str] = None
    desc: Optional[str] = None
    amount: Optional[int] = None
    iconSrc: Optional[str] = None
    geocode: Optional[List[float]] = None
    item: Optional[str] = None
    items: Optional[List[Item]] = None

class UserLogin(BaseModel):
    username: str
    password: str
