import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function requireToken(getState) {
  const token = getState().auth?.token;
  if (!token) throw new Error("NoAuthToken");
  return token;
}
function normalizeMarker(m) {
  if (!m) return m;
  const out = { ...m };

  if (!out.geocode && out.lat != null && out.lng != null) {
    out.geocode = [Number(out.lat), Number(out.lng)];
  }

  // chuẩn hóa items thành [{name, qty}]
  let items = out.items;

  // nếu server trả item + amount (schema cũ)
  if (!items || items.length === 0) {
    if (out.item) {
      items = [{ name: out.item, qty: Number(out.amount || 1) }];
    } else {
      items = [];
    }
  }

  // convert mỗi item thành {name, qty}
  items = items.map((it) => {
    if (!it) return null;

    if (typeof it === "string")
      return { name: it, qty: 1 };

    const name =
      it.name ??
      it.item ??
      it.label ??
      it.itemName ??
      null;

    const qty =
      Number(it.qty ?? it.quantity ?? it.amount ?? 1) || 1;

    return name ? { name, qty } : null;
  }).filter(Boolean);

  out.items = items;
  out.amount = items.reduce((s, it) => s + it.qty, 0);

  return out;
}

export const fetchMarker = createAsyncThunk(
  "markers/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = requireToken(getState);
      const res = await fetch("http://localhost:8000/api/markers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        return rejectWithValue(txt || "Lấy dữ liệu thất bại");
      }
      return res.json();
    } catch (err) {
      if (err.message === "NoAuthToken") return rejectWithValue("Chưa đăng nhập");
      return rejectWithValue(err.message || "Lỗi mạng");
    }
  }
);

export const themMarker = createAsyncThunk(
  "markers/add",
  async (markerData, { getState, rejectWithValue }) => {
    try {
      const token = requireToken(getState);
      const res = await fetch("http://localhost:8000/api/markers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(markerData),
      });
      if (!res.ok) {
        const txt = await res.text();
        return rejectWithValue(txt || "Thêm thất bại");
      }
      return res.json();
    } catch (err) {
      if (err.message === "NoAuthToken") return rejectWithValue("Chưa đăng nhập");
      return rejectWithValue(err.message || "Lỗi mạng");
    }
  }
);

export const suaMarker = createAsyncThunk(
  "markers/update",
  async ({ idUnit, updates }, { getState, rejectWithValue }) => {
    try {
      const token = requireToken(getState);
      const res = await fetch(`http://localhost:8000/api/markers/${encodeURIComponent(idUnit)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const txt = await res.text();
        return rejectWithValue(txt || "Sửa thất bại");
      }
      return res.json();
    } catch (err) {
      if (err.message === "NoAuthToken") return rejectWithValue("Chưa đăng nhập");
      return rejectWithValue(err.message || "Lỗi mạng");
    }
  }
);

export const xoaMarker = createAsyncThunk(
  "markers/delete",
  async (idUnit, { getState, rejectWithValue }) => {
    try {
      const token = requireToken(getState);
      const res = await fetch(`http://localhost:8000/api/markers/${encodeURIComponent(idUnit)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        return rejectWithValue(txt || "Xóa thất bại");
      }
      return idUnit;
    } catch (err) {
      if (err.message === "NoAuthToken") return rejectWithValue("Chưa đăng nhập");
      return rejectWithValue(err.message || "Lỗi mạng");
    }
  }
);

const markersSlice = createSlice({
  name: "markers",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
  builder
    .addCase(fetchMarker.fulfilled, (state, action) => {
      state.list = (action.payload || []).map((m) => normalizeMarker(m));
      state.error = null;
    })
    .addCase(fetchMarker.rejected, (state, action) => {
      state.error = action.payload;
    })

    .addCase(themMarker.fulfilled, (state, action) => {
      state.list.push(normalizeMarker(action.payload));
      state.error = null;
    })
    .addCase(themMarker.rejected, (state, action) => {
      state.error = action.payload;
    })

    .addCase(suaMarker.fulfilled, (state, action) => {
      const updated = normalizeMarker(action.payload);
      const idx = state.list.findIndex((m) => m.idUnit === updated.idUnit);
      if (idx !== -1) state.list[idx] = updated;
      else state.list.push(updated);
      state.error = null;
    })

    .addCase(xoaMarker.fulfilled, (state, action) => {
      state.list = state.list.filter((m) => m.idUnit !== action.payload);
      state.error = null;
    })
    .addCase(xoaMarker.rejected, (state, action) => {
      state.error = action.payload;
    });
}

});

export default markersSlice.reducer;
