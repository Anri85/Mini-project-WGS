import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

import CardAttendance from "../../components/Cards/CardAttendance";
import ReactPaginate from "react-paginate";

// components
const Dashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [query, setQuery] = useState("nothing");
    const [currentPage, setCurrentPage] = useState(0);

    const axiosPrivate = useAxiosPrivate();

    // fungsi mengambil attendance list (keseluruhan)
    const getAllAttendance = async () => {
        try {
            const result = await axiosPrivate.get(`/attendance/list/${query}`);
            setAttendance(result?.data?.data);
        } catch (error) {
            console.log(error?.response?.data);
        }
    };

    useEffect(() => {
        getAllAttendance();
    }, [query]);

    // pengaturan untuk menampilkan data perhalaman
    const PER_PAGE = 5;
    const offset = currentPage * PER_PAGE;
    const currentPageData = attendance.slice(offset, offset + PER_PAGE);
    const pageCount = Math.ceil(attendance.length / PER_PAGE);

    // fungsi untuk merubah halaman
    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardAttendance attendance={currentPageData} setQuery={setQuery} getAllAttendance={getAllAttendance} />
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

export default Dashboard;
