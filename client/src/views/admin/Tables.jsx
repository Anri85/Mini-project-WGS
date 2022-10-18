import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

// components
import CardTableUsers from "../../components/Cards/CardTableUsers";
import Paginate from "../../components/Pagination/Paginate";

const Tables = () => {
    const [users, setUsers] = useState([]);
    const [response, setResponse] = useState({ message: "", status: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(5);

    const axiosPrivate = useAxiosPrivate();

    const getAllUsers = async () => {
        try {
            const result = await axiosPrivate.get("/users/list/");
            setUsers(result?.data?.data);
        } catch (error) {
            setResponse(error?.response?.data);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    // get current data
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = users.slice(indexOfFirstData, indexOfLastData);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardTableUsers color="dark" users={currentData} response={response} setResponse={setResponse} getAllUsers={getAllUsers} />
                    <Paginate dataPerPage={dataPerPage} totalData={users.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
        </>
    );
};

export default Tables;
