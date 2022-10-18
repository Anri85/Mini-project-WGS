import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

import CardAttendance from "../../components/Cards/CardAttendance";
import Paginate from "../../components/Pagination/Paginate";

// components
const Dashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(5);

    const axiosPrivate = useAxiosPrivate();

    // fungsi mengambil attendance list (keseluruhan)
    const getAllAttendance = async () => {
        try {
            const result = await axiosPrivate.get("/attendance/list/");
            setAttendance(result?.data?.data);
        } catch (error) {
            console.log(error?.response?.data);
        }
    };

    useEffect(() => {
        getAllAttendance();
    }, []);

    // get current data
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = attendance.slice(indexOfFirstData, indexOfLastData);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardAttendance attendance={currentData} />
                    <Paginate dataPerPage={dataPerPage} totalData={attendance.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
