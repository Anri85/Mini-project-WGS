// fungsi yang mengelola request pada backend (attendance)
import { createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from ".";

export const getAttendance = createAsyncThunk("attendance/getAttendance", async () => {
    const response = await authAxios.get("/attendance/list/");
    return response?.data?.data;
});

export const getUserAttendance = createAsyncThunk("attendance/getUserAttendance", async (userId) => {
    const response = await authAxios.get(`/attendance/list/my/${userId}`);
    return response?.data?.data;
});

export const addAttendance = createAsyncThunk("attendance/createAttendance", async (attendanceId) => {
    const response = await authAxios.post(`/attendance/create/${attendanceId}`);
    return response?.data?.data;
});
