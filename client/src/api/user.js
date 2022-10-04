// fungsi yang mengelola request pada backend (users)
import { createAsyncThunk } from "@reduxjs/toolkit";
import authAxios from ".";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
    const response = await authAxios.get("/users/list/");
    return response?.data?.data;
});
