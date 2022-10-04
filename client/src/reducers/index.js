import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "../slice/attendanceSlice";
import userReducer from "../slice/userSlice";
import authenticationReducer from "../slice/authenticationSlice";

export const reducers = configureStore({
    reducer: {
        attendance: attendanceReducer,
        user: userReducer,
        authenticate: authenticationReducer,
    },
});
