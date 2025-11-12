import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMarker = createAsyncThunk("markers/fetch", async (_, { getState }) => {
  const token = getState().auth.token;
  if (!token) throw new Error("Chưa đăng nhập");
  const res = await fetch("http://localhost:8000/api/markers", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
  return res.json();
});

export const themMarker = createAsyncThunk("markers/add", async (markerData, { getState }) => {
  const token = getState().auth.token;
  if (!token) throw new Error("Chưa đăng nhập");
  const res = await fetch("http://localhost:8000/api/markers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   
    },
    body: JSON.stringify(markerData),
  });
  if (!res.ok) throw new Error("Thêm thất bại");
  return res.json();
});

export const suaMarker = createAsyncThunk("markers/update", async (markerData, { getState }) => {
  const token = getState().auth.token;
  if (!token) throw new Error("Chưa đăng nhập");
  const { id, ...updates } = markerData;
  const res = await fetch(`http://localhost:8000/api/markers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Sửa thất bại");
  return res.json();
});

export const xoaMarker = createAsyncThunk("markers/delete", async (id, { getState }) => {
  const token = getState().auth.token;
  if (!token) throw new Error("Chưa đăng nhập");
  const res = await fetch(`http://localhost:8000/api/markers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },   
  });
  if (!res.ok) throw new Error("Xóa thất bại");
  return id;
});

const markersSlice = createSlice({
  name: "markers",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarker.fulfilled, (state, action) => {
        state.list = action.payload.map(m => ({
          ...m,
          geocode: m.geocode || [m.lat, m.lng],
        }));
      })
      .addCase(themMarker.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(suaMarker.fulfilled, (state, action) => {
        const idx = state.list.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(xoaMarker.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload);
      });
  },
});

export default markersSlice.reducer;