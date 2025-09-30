from pydantic import BaseModel
from typing import List, Optional

class Marker(BaseModel):
    id: Optional[str] = None  # MongoDB _id -> string
    geocode: List[float]      # [lat, lng]
    popup: str
    iconSrc: str
    name: str
    desc: str