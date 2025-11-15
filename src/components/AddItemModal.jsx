import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminItems() {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const headersWithAuth = () => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/items", {
          headers: headersWithAuth(),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Lỗi tải vật phẩm");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user]);

  const addItem = async () => {
    if (!name.trim()) return alert("Nhập tên vật phẩm");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/items", {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setItems((s) => [created, ...s]);
      setName("");
    } catch (err) {
      alert("Lỗi thêm vật phẩm: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (name) => {
    setToDelete(name); 
  };

  const doDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/items/${encodeURIComponent(toDelete)}`, {
        method: "DELETE",
        headers: headersWithAuth(),
      });
      if (!res.ok) throw new Error(await res.text());
      setItems((s) => s.filter((it) => it.name !== toDelete));
      setToDelete(null);
    } catch (err) {
      alert("Xóa thất bại: " + (err.message || err));
    } finally {
      setDeleting(false);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div style={{
    position: "fixed",    
    bottom: 15,              
    right: 380,             
    zIndex: 3000,
    width: 300, 
    background: "#fff",
    boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
    borderRadius: 8,
    padding: 10
  }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <b>Quản lý vật phẩm</b>
        <div style={{ fontSize: 12, color: "#666" }}>{user?.username || "admin"}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên vật phẩm mới"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button onClick={addItem} disabled={!token} style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
          Thêm
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div style={{ maxHeight: 240, overflow: "auto", borderTop: "1px solid #eee", paddingTop: 8 }}>
          {items.length === 0 ? (
            <div style={{ color: "#666" }}>Chưa có vật phẩm</div>
          ) : (
            items.map((it) => (
              <div key={it.name} style={{ padding: "6px 0", borderBottom: "1px solid #fafafa", display: "flex", justifyContent: "space-between" }}>
                <div>{it.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => confirmDelete(it.name)} style={{ fontSize: 12, cursor: "pointer" }}>
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm inline */}
      {toDelete && (
        <div style={{ marginTop: 10, padding: 8, background: "#fffbe6", borderRadius: 6 }}>
          <div>Bạn có chắc muốn xóa <b>{toDelete}</b>?</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => setToDelete(null)} style={{ padding: "6px 8px" }}>Hủy</button>
            <button onClick={doDelete} disabled={deleting} style={{ padding: "6px 8px", background: "#e74c3c", color: "#fff", border: "none" }}>
              {deleting ? "Đang xóa..." : "Xác nhận xóa"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
