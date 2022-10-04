// fungsi untuk mengelola state user (response dari backend) yang dikombinasikan dengan file action pada folder api/attendance
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { getAttendance, getUserAttendance, addAttendance } from "../api/attendance";

const attendanceEntity = createEntityAdapter({
    selectId: (attendance) => attendance.id,
});

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: attendanceEntity.getInitialState(),
    extraReducers: {
        [getAttendance.fulfilled]: (state, action) => {
            attendanceEntity.setAll(state, action.payload);
        },
        [getUserAttendance.fulfilled]: (state, action) => {
            attendanceEntity.setAll(state, action.payload);
        },
        [addAttendance.fulfilled]: (state, action) => {
            attendanceEntity.addOne(state, action.payload);
        },
    },
});

export const attendanceSelectors = attendanceEntity.getSelectors((state) => state.attendance);
export default attendanceSlice.reducer;
