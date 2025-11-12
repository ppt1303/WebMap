// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import markersReducer from "./markerslice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    markers: markersReducer,
    auth: authReducer, 
  },
});

export default store;
