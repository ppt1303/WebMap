from typing import List, Optional
from pydantic import BaseModel, Field

class MarkerIn(BaseModel):
    geocode: List[float]         
    name: str
    desc: Optional[str] = None
    iconSrc: Optional[str] = None
    popup: Optional[str] = None

class MarkerOut(MarkerIn):
    id: str = Field(..., alias="_id")

def to_out(doc) -> MarkerOut:
    doc["_id"] = str(doc["_id"])
    return MarkerOut(**doc)