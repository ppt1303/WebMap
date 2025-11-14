from typing import List, Optional
from pydantic import BaseModel, Field

class MarkerBase(BaseModel):
    name: str
    geocode: List[float]
    amount: Optional[int]
    iconSrc: Optional[str] = "/img/marker-icon.png"
    desc: Optional[str] = None

class Marker(MarkerBase):
    id: int

class MarkerUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    amount: Optional[int] = None
    iconSrc: Optional[str] = None
    geocode: Optional[List[float]] = None

class UserLogin(BaseModel):
    username: str
    password: str