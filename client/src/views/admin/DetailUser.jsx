import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../api/useAxiosPrivate";

import CardDetailUser from "../../components/Cards/CardDetailUser";
import Paginate from "../../components/Pagination/Paginate";

const DetailUser = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();

    const [detailUser, setDetailUser] = useState();
    const [response, setResponse] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(5);

    const getUser = async (id) => {
        try {
            const response = await axiosPrivate.get(`/users/single/${id}`);
            setDetailUser(response?.data?.data);
        } catch (error) {
            setResponse(error?.response?.data);
        }
    };

    useEffect(() => {
        getUser(id);
    }, []);

    // get current data
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = detailUser?.attendance.slice(indexOfFirstData, indexOfLastData);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 xl:mb-0 px-4">
                <CardDetailUser detailUser={detailUser} response={response} setDetailUser={setDetailUser} setResponse={setResponse} id={id} attendance={currentData} />
                <Paginate dataPerPage={dataPerPage} totalData={detailUser?.attendance.length} paginate={paginate} currentPage={currentPage} />
            </div>
        </div>
    );
};

export default DetailUser;
