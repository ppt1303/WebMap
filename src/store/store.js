import { configureStore } from "@reduxjs/toolkit";
import markerReducer from "./markerslice"


export const store = configureStore({
    reducer: {
        markers: markerReducer,
    },
});