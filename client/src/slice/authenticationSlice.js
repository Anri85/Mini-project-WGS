// fungsi untuk mengelola state user (response dari backend) yang dikombinasikan dengan file action pada folder api/attendance
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { authenticateUser } from "../api/authentication";

const authenticationEntity = createEntityAdapter({
    selectId: (authenticate) => authenticate.id,
});

const authenticationSlice = createSlice({
    name: "authentication",
    initialState: authenticationEntity.getInitialState(),
    extraReducers: {
        [authenticateUser.fulfilled]: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            authenticationEntity.setOne(state, action.payload);
        },
        [authenticateUser.rejected]: (state, action) => {
            authenticationEntity.setOne(state, action.payload);
        },
    },
});

export const authenticateSelector = authenticationEntity.getSelectors((state) => state.authenticate);
export default authenticationSlice.reducer;
