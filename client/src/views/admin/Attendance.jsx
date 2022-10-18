import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

// components
import CardEmployeeAttendance from "../../components/Cards/CardEmployeeAttendance";
import Paginate from "../../components/Pagination/Paginate";

const userData = JSON.parse(localStorage.getItem("user"));

const Attendance = () => {
    const [myAttendance, setMyAttendance] = useState([]);
    const [isAttendToday, setIsAttendToday] = useState(false);
    const [response, setResponse] = useState({ message: "", status: "", statusCode: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(5);

    const axiosPrivate = useAxiosPrivate();

    // fungsi mengambil attendance list (berdasarkan userId)
    const getMyAttendance = async (userId) => {
        try {
            const result = await axiosPrivate.get(`/attendance/list/my/${userId}`);
            // fungsi untuk mengecek apakah sudah tedapat attendance pada hari tersebut
            const isAttended = result?.data?.data.filter((a) => a.user_id === userData.id && a.date === new Date().toISOString().split("T")[0]);
            // jika sudah tedapat attendance maka user tidak dapat membuat attendance
            isAttended.length > 0 ? setIsAttendToday(false) : setIsAttendToday(false);
            // set attendance list dalam state
            setMyAttendance(result?.data?.data);
        } catch (error) {
            setResponse({ ...response, message: error?.response?.data?.message, status: error?.response?.data?.status, statusCode: error?.response?.status });
        }
    };

    useEffect(() => {
        getMyAttendance(userData?.id);
    }, []);

    // get current data
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = myAttendance.slice(indexOfFirstData, indexOfLastData);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardEmployeeAttendance
                        myAttendance={currentData}
                        isAttendToday={isAttendToday}
                        response={response}
                        setResponse={setResponse}
                        getMyAttendance={getMyAttendance}
                    />
                    <Paginate dataPerPage={dataPerPage} totalData={myAttendance.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
        </>
    );
};

export default Attendance;
