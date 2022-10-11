import React from "react";

// components
import CardEmployeeAttendance from "../../components/Cards/CardEmployeeAttendance";
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic";

const Attendance = () => {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full lg:w-8/12 px-4">
                    <CardEmployeeAttendance />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div>
            </div>
        </>
    );
};

export default Attendance;
