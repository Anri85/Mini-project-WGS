import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

// components
import CardEmployeeAttendance from "../../components/Cards/CardEmployeeAttendance";
import ReactPaginate from "react-paginate";

const userData = JSON.parse(localStorage.getItem("user"));

const Attendance = () => {
    const [myAttendance, setMyAttendance] = useState([]);
    const [isAttendToday, setIsAttendToday] = useState(false);
    const [response, setResponse] = useState({ message: "", status: "", statusCode: "" });
    const [currentPage, setCurrentPage] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    // fungsi mengambil attendance list (berdasarkan userId)
    const getMyAttendance = async (userId) => {
        try {
            const result = await axiosPrivate.get(`/attendance/list/my/${userId}`);
            // fungsi untuk mengecek apakah sudah tedapat attendance pada hari tersebut
            const isAttended = result?.data?.data.filter((a) => new Date(a.date).getDate() === new Date().getDate());
            // jika sudah tedapat attendance maka user tidak dapat membuat attendance
            isAttended.length > 0 ? setIsAttendToday(true) : setIsAttendToday(false);
            // set attendance list dalam state
            setMyAttendance(result?.data?.data);
        } catch (error) {
            setResponse({ ...response, message: error?.response?.data?.message, status: error?.response?.data?.status, statusCode: error?.response?.status });
        }
    };

    useEffect(() => {
        getMyAttendance(userData?.id);
    }, []);

    // pengaturan untuk menampilkan data perhalaman
    const PER_PAGE = 5;
    const offset = currentPage * PER_PAGE;
    const currentPageData = myAttendance.slice(offset, offset + PER_PAGE);
    const pageCount = Math.ceil(myAttendance.length / PER_PAGE);

    // fungsi untuk merubah halaman
    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardEmployeeAttendance
                        myAttendance={currentPageData}
                        isAttendToday={isAttendToday}
                        response={response}
                        setResponse={setResponse}
                        getMyAttendance={getMyAttendance}
                    />
                    <ReactPaginate
                        previousLabel={"← Back"}
                        nextLabel={"Next →"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"flex pl-0 rounded list-none flex-wrap"}
                        pageLinkClassName={"bg-white border-gray-300 text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"}
                        previousLinkClassName={"bg-white border-gray-300 text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"}
                        nextLinkClassName={"bg-white border-gray-300 text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"}
                        activeClassName={"bg-blue border-red-300 text-red-500 hover:bg-blue-200 items-center border text-sm font-medium"}
                    />
                </div>
            </div>
        </>
    );
};

export default Attendance;
