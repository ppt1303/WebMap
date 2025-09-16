import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMarker = createAsyncThunk("markers/fetch", async () => {
  const res = await fetch("http://localhost:5000/api/markers");
  return res.json();
});

export const themMarker = createAsyncThunk("markers/add", async (markerData) => {
  const res = await fetch("http://localhost:5000/api/markers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(markerData),
  });
  return res.json(); // trả về marker có id từ server
});

export const xoaMarker = createAsyncThunk("markers/delete", async (id) => {
  const res = await fetch(`http://localhost:5000/api/markers/${id.toString()}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Xóa thất bại");

  const data = await res.json();
  console.log("Server trả về khi xoá:", data);
  return id; // chỉ trả về id để reducer xử lý
});

const markersSlice = createSlice({
  name: "markers",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarker.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(themMarker.fulfilled, (state, action) => {
        state.list.push(action.payload); // push marker từ server (có id chuẩn)
      })
      .addCase(xoaMarker.fulfilled, (state, action) => {
          const deletedId = action.payload.toString();
          console.log("Reducer xoá marker id:", deletedId);

          state.list = state.list.filter((m) => m.id.toString() !== deletedId);
          });

  },
});

export default markersSlice.reducer;
