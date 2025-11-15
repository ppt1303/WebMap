// MarkerForm.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MarkerForm({
  newMarker,
  formData,
  setFormData,
  Xuly,
  onCancel,
  dbItems: dbItemsProp = [],
  localAddedItems: localAddedItemsProp = [],
  setLocalAddedItems,
  currentUser,
}) {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [dbItems, setDbItems] = useState([]);
  const [localAddedItems, setLocalAddedItemsState] = useState([]); 
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/items", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const data = await res.json();
        setDbItems(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const addItem = async () => {
    const name = newItemName.trim();
    if (!name) return;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const txt = await res.text();
      let data = null;
      try {
        data = JSON.parse(txt);
      } catch {}

      if (!res.ok) {
        alert("Lỗi thêm vật phẩm: " + (data?.detail || txt));
        return;
      }

      const created = data;
      setDbItems((s) => [...s, created]);
      setLocalAddedItemsState((s) => [...s, created]);
      setLocalAddedItems?.((s) => [...s, created]);
      setFormData({ ...formData, item: created.name });
      setNewItemName("");
    } catch (err) {
      console.error(err);
      alert("Lỗi thêm vật phẩm");
    }
  };

      const allItems = [...dbItems, ...localAddedItems, ...dbItemsProp, ...localAddedItemsProp].reduce(
    (acc, cur) => {
    const name = cur.name || cur.label || cur.itemName;
    if (!acc.find((i) => i.name === name)) acc.push({ ...cur, name });
    return acc;
    },
    []
    );
    const itemsList = Array.isArray(formData.items) ? formData.items : [];


const handleAddItemToList = () => {
const name = selectedItem?.trim();
const qty = Number(selectedQty) || 0;
if (!name) return alert("Chọn vật chất trước");
if (qty <= 0) return alert("Số lượng phải lớn hơn 0");


const already = itemsList.find((it) => it.name === name);
let newList;
if (already) {
newList = itemsList.map((it) => (it.name === name ? { ...it, qty: it.qty + qty } : it));
} else {
newList = [...itemsList, { name, qty }];
}


setFormData({ ...formData, items: newList });
setSelectedItem("");
setSelectedQty(1);
};




  if (!newMarker) return null;
    const handleRemoveItem = (name) => {
    const newList = itemsList.filter((it) => it.name !== name);
    setFormData({ ...formData, items: newList });
    };


if (!newMarker) return null;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        Xuly(e);
      }}
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        zIndex: 1000,
        transform: "translateX(-50%)",
        background: "white",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h4>Thêm marker mới</h4>

      <label>Mã đơn vị: </label>
      <input
        type="text"
        placeholder="Mã đơn vị"
        value={formData.idUnit || ""}
        onChange={(e) => setFormData({ ...formData, idUnit: e.target.value })}
        required
      />
      <br />

      <label>Tên: </label>
      <input
        type="text"
        placeholder="Tên"
        value={formData.name || ""}
        onChange={(a) => setFormData({ ...formData, name: a.target.value })}
        required
      />
      <br />

      <label>Mô tả: </label>
      <textarea
        placeholder="Mô tả"
        value={formData.desc || ""}
        onChange={(a) => setFormData({ ...formData, desc: a.target.value })}
      />
      {/* <br />

      <label>Số lượng: </label>
      <input
        type="number"
        placeholder="Số lượng"
        value={formData.amount ?? ""}
        onChange={(a) => setFormData({ ...formData, amount: Number(a.target.value) })}
      />
      <br /> */}
<br />
     <label>Vật chất: (chọn + số lượng, bấm 'Thêm' để lưu tạm vào danh sách)</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">-- Chọn vật chất --</option>
          {allItems.map((it) => (
          <option key={it.name} value={it.name}>
          {it.name}
          </option>
          ))}
          </select>
          <input
          type="number"
          min={1}
          style={{ width: 90 }}
          value={selectedQty}
          onChange={(e) => setSelectedQty(Number(e.target.value))}
          />
          <button type="button" onClick={handleAddItemToList}>
          Thêm
          </button>
          </div>


          <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 700 }}>Danh sách vật chất đã thêm</div>
          {itemsList.length === 0 ? (
          <div style={{ fontSize: 13, color: "#666" }}>Chưa có vật chất</div>
          ) : (
          <ul style={{ margin: 6 }}>
          {itemsList.map((it) => (
          <li key={it.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{it.name} — {it.qty}</span>
          <button type="button" onClick={() => handleRemoveItem(it.name)} style={{ marginLeft: 6 }}>Xóa</button>
          </li>
          ))}
          </ul>
          )}
       
     </div>
      {user?.role === "admin" && (
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="text"
            placeholder="Thêm vật phẩm mới"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button type="button" onClick={addItem}>
            Thêm
          </button>
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button type="submit">Lưu Marker</button>
        <button type="button" onClick={onCancel}>
          Huỷ
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: 5 }}>Lỗi: {error}</div>}
    </form>
  );
}
