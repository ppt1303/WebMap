# route.py
from fastapi import APIRouter, HTTPException, Request, Depends
from todo.database import col1, col2
from todo.models import UserLogin, MarkerBase, MarkerUpdate
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

route = APIRouter()
col_items = col1.database["items"]


def get_current_user(request: Request):
    auth = request.headers.get("authorization")
    if not auth:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = auth.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = parts[1]
    user_doc = col2.find_one({"user": token})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid token/user not found")
    return {"username": user_doc.get("user"), "role": user_doc.get("auth", "user")}


def _normalize_items_field(doc: Dict[str, Any]) -> Dict[str, Any]:
    
    if doc is None:
        return doc

    items_raw = doc.get("items")
    normalized: List[Dict[str, Any]] = []

    if items_raw and isinstance(items_raw, list) and len(items_raw) > 0:
        for it in items_raw:
            if isinstance(it, str):
                normalized.append({"name": it, "qty": 1})
                continue

            if isinstance(it, dict):
                name = it.get("name") or it.get("item") or it.get("label") or it.get("itemName")
                qty = it.get("qty") if it.get("qty") is not None else it.get("quantity") or it.get("amount") or 1
            else:
                name = getattr(it, "name", None) or getattr(it, "item", None)
                qty = getattr(it, "qty", None) or getattr(it, "quantity", None) or getattr(it, "amount", None) or 1

            try:
                qty_int = int(qty or 0)
            except Exception:
                qty_int = 0

            if name:
                normalized.append({"name": name, "qty": qty_int})
    else:
        old_item = doc.get("item")
        old_amount = doc.get("amount", 0)
        if old_item:
            try:
                qty_int = int(old_amount or 0)
            except Exception:
                qty_int = 0
            normalized = [{"name": old_item, "qty": qty_int}]
        else:
            normalized = []

    doc["items"] = normalized
    if normalized:
        doc["item"] = normalized[0]["name"]
        doc["amount"] = sum(int(i.get("qty", 0)) for i in normalized)
    else:
        doc["item"] = None
        doc["amount"] = 0

    return doc


@route.post("/api/auth/login")
async def login(data: UserLogin):
    user = col2.find_one({"user": data.username})
    if not user or user.get("pass") != data.password:
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
    return {
        "access_token": data.username,
        "token_type": "bearer",
        "user": {"username": user["user"], "role": user.get("auth", "user")},
    }


@route.get("/api/markers")
async def get_markers(current_user: dict = Depends(get_current_user)):
    out = []
    for m in col1.find():
        m.pop("_id", None)
        if "geocode" not in m and "lat" in m and "lng" in m:
            m["geocode"] = [m["lat"], m["lng"]]
        m = _normalize_items_field(m)
        out.append(m)
    return out


@route.post("/api/markers", status_code=201)
async def create_marker(marker: MarkerBase, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin" and current_user.get("username") != getattr(marker, "idUnit", None):
        raise HTTPException(status_code=403, detail="Không có quyền tạo marker cho idUnit khác")

    if col1.find_one({"idUnit": marker.idUnit}):
        raise HTTPException(status_code=400, detail="idUnit đã tồn tại")

    if not marker.geocode or len(marker.geocode) != 2:
        raise HTTPException(status_code=400, detail="Thiếu hoặc sai geocode")

    items_list: List[Dict[str, Any]] = []
    if getattr(marker, "items", None):
        for it in marker.items:
            if isinstance(it, dict):
                name = it.get("name") or it.get("item")
                qty = int(it.get("qty", 0) or it.get("quantity", 0) or it.get("amount", 0) or 0)
            else:
                name = getattr(it, "name", None) or getattr(it, "item", None)
                qty = int(getattr(it, "qty", None) or getattr(it, "quantity", None) or getattr(it, "amount", None) or 0)
            if name:
                items_list.append({"name": name, "qty": qty})
    elif getattr(marker, "item", None):
        try:
            qty = int(marker.amount or 0)
        except Exception:
            qty = 0
        items_list = [{"name": marker.item, "qty": qty}]

    first_item = items_list[0]["name"] if items_list else None
    total_qty = sum(int(i["qty"]) for i in items_list) if items_list else 0

    doc = {
        "idUnit": marker.idUnit,
        "name": marker.name,
        "desc": marker.desc,
        "amount": total_qty,
        "geocode": marker.geocode,
        "iconSrc": marker.iconSrc or "/img/marker-icon.png",
        "items": items_list,
        "item": first_item,
    }
    col1.insert_one(doc)

    if not col2.find_one({"user": marker.idUnit}):
        col2.insert_one({"user": marker.idUnit, "pass": "123", "auth": "user"})

    doc.pop("_id", None)
    doc = _normalize_items_field(doc)
    return doc


@route.put("/api/markers/{id_unit}")
async def update_marker(id_unit: str, updated: MarkerUpdate, current_user: dict = Depends(get_current_user)):
    m = col1.find_one({"idUnit": id_unit})
    if not m:
        raise HTTPException(status_code=404, detail="Marker không tồn tại")

    if current_user.get("role") != "admin" and current_user.get("username") != id_unit:
        raise HTTPException(status_code=403, detail="Không có quyền cập nhật marker này")

    if getattr(updated, "idUnit", None) and updated.idUnit != id_unit:
        if col1.find_one({"idUnit": updated.idUnit}):
            raise HTTPException(status_code=400, detail="idUnit mới đã tồn tại")
        user_doc = col2.find_one({"user": id_unit})
        if user_doc:
            col2.update_one({"user": id_unit}, {"$set": {"user": updated.idUnit}})

    new_values: Dict[str, Any] = {}
    if updated.name is not None:
        new_values["name"] = updated.name
    if updated.desc is not None:
        new_values["desc"] = updated.desc
    if updated.iconSrc is not None:
        new_values["iconSrc"] = updated.iconSrc
    if updated.geocode is not None and len(updated.geocode) == 2:
        new_values["geocode"] = updated.geocode
    if getattr(updated, "idUnit", None) is not None:
        new_values["idUnit"] = updated.idUnit

    if getattr(updated, "items", None) is not None:
        items_list: List[Dict[str, Any]] = []
        for it in updated.items:
            if isinstance(it, dict):
                name = it.get("name") or it.get("item")
                qty = int(it.get("qty", 0) or it.get("quantity", 0) or it.get("amount", 0) or 0)
            else:
                name = getattr(it, "name", None) or getattr(it, "item", None)
                qty = int(getattr(it, "qty", None) or getattr(it, "quantity", None) or getattr(it, "amount", None) or 0)
            if name:
                items_list.append({"name": name, "qty": qty})
        new_values["items"] = items_list
        new_values["item"] = items_list[0]["name"] if items_list else None
        new_values["amount"] = sum(int(i["qty"]) for i in items_list) if items_list else 0
    elif getattr(updated, "item", None) is not None:
        try:
            qty_val = int(updated.amount or 0)
        except Exception:
            qty_val = 0
        new_values["items"] = [{"name": updated.item, "qty": qty_val}]
        new_values["item"] = updated.item
        new_values["amount"] = qty_val
    else:
        if updated.amount is not None:
            try:
                new_values["amount"] = int(updated.amount)
            except Exception:
                new_values["amount"] = updated.amount

    if new_values:
        col1.update_one({"idUnit": id_unit}, {"$set": new_values})

    updated_marker = col1.find_one({"idUnit": new_values.get("idUnit", id_unit)})
    if updated_marker:
        updated_marker.pop("_id", None)
        updated_marker = _normalize_items_field(updated_marker)
    return updated_marker


@route.delete("/api/markers/{id_unit}")
async def delete_marker(id_unit: str, current_user: dict = Depends(get_current_user)):
    m = col1.find_one({"idUnit": id_unit})
    if not m:
        raise HTTPException(status_code=404, detail="Marker không tồn tại")

    if current_user.get("role") != "admin" and current_user.get("username") != id_unit:
        raise HTTPException(status_code=403, detail="Không có quyền xóa marker này")

    col1.delete_one({"idUnit": id_unit})
    col2.delete_one({"user": id_unit})
    return {"message": "Đã xóa", "idUnit": id_unit}


@route.get("/api/items")
async def list_items(current_user: dict = Depends(get_current_user)):
    out: List[Dict[str, Any]] = []
    for it in col_items.find():
        it.pop("_id", None)
        out.append(it)
    return out


@route.post("/api/items", status_code=201)
async def create_item(item: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin được thêm vật phẩm")
    name = (item.get("name") or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Thiếu tên vật phẩm")
    if col_items.find_one({"name": name}):
        raise HTTPException(status_code=400, detail="Vật phẩm đã tồn tại")
    doc = {"name": name}
    col_items.insert_one(doc)
    doc.pop("_id", None)
    return doc


@route.delete("/api/items/{name}")
async def delete_item(name: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin được xóa vật phẩm")
    if not col_items.find_one({"name": name}):
        raise HTTPException(status_code=404, detail="Không tìm thấy vật phẩm")
    col_items.delete_one({"name": name})
    return {"message": "Đã xóa", "name": name}
