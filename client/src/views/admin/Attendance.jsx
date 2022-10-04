import React from "react";

// components
// import CardLineChart from "../../components/Cards/CardLineChart";
// import CardBarChart from "../../components/Cards/CardBarChart";
import CardEmployeeAttendance from "../../components/Cards/CardEmployeeAttendance";
// import CardSocialTraffic from "../../components/Cards/CardSocialTraffic";

const Attendance = () => {
    return (
        <>
            {/* <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4"><CardLineChart /></div>
                <div className="w-full xl:w-4/12 px-4"><CardBarChart /></div>
            </div> */}
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardEmployeeAttendance />
                </div>
                {/* <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div> */}
            </div>
        </>
    );
};

export default Attendance;
