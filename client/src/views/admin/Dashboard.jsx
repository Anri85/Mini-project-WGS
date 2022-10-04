import React from "react";

import CardAttendance from "../../components/Cards/CardAttendance";

// components
const Dashboard = () => {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardAttendance />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
