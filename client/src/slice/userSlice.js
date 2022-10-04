// fungsi untuk mengelola state user (response dari backend) yang dikombinasikan dengan file action pada folder api/user
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { getUsers } from "../api/user";

const userEntity = createEntityAdapter({
    selectId: (user) => user.id,
});

const userSlice = createSlice({
    name: "user",
    initialState: userEntity.getInitialState(),
    extraReducers: {
        [getUsers.fulfilled]: (state, action) => {
            userEntity.setAll(state, action.payload);
        },
    },
});

export const userSelectors = userEntity.getSelectors((state) => state.user);
export default userSlice.reducer;
