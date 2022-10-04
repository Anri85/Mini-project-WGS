// fungsi yang mengelola request pada backend (authentication)
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const authenticateUser = createAsyncThunk("authenticate/user", async (formData) => {
    const response = await axios.post("http://localhost:5000/api/user/authentication", formData);
    return response?.data?.data;
});
