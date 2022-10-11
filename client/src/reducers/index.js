import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";

export const reducers = configureStore({
    reducer: {
        user: userReducer,
    },
});
