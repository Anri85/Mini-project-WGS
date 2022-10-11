import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useAxiosPrivate from "../../api/useAxiosPrivate";

// components
// import Modal from "../Modal/Modal";

const userData = JSON.parse(localStorage.getItem("user"));

const CardEmployeeAttendance = () => {
    const [myAttendance, setMyAttendance] = useState([]);
    const [response, setResponse] = useState({ message: "", status: "", statusCode: "" });

    const axiosPrivate = useAxiosPrivate();

    // const [openModal, setOpenModal] = useState(false);
    const [isAttendToday, setIsAttendToday] = useState(false);

    // fungsi untuk membuat attendance
    const createAttendance = async (attendanceId) => {
        try {
            await axiosPrivate.post(`/attendance/create/${attendanceId}`);
            getMyAttendance(userData?.id);
        } catch (error) {
            setResponse({ ...response, message: error?.response?.data?.message, status: error?.response?.data?.status, statusCode: error?.response?.status });
        }
    };

    // fungsi mengambil attendance list (berdasarkan userId)
    const getMyAttendance = async (userId) => {
        try {
            const result = await axiosPrivate.get(`/attendance/list/my/${userId}`);
            // fungsi untuk mengecek apakah sudah tedapat attendance pada hari tersebut
            const isAttended = result?.data?.data.filter((a) => a.user_id === userData.id && a.date === new Date().toISOString().split("T")[0]);
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

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                {response?.statusCode === 404 && (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                                    <svg
                                        aria-hidden="true"
                                        className="flex-shrink-0 inline w-5 h-5 mr-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Info</span>
                                    <div>
                                        <span className="font-medium">Warning!</span> {response?.message}
                                    </div>
                                    <button
                                        className="ml-2"
                                        onClick={() => {
                                            setResponse({ ...response, message: "", status: "", statusCode: "" });
                                        }}
                                    >
                                        <i className="fa fa-window-close bg-dark text-xl" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                )}
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">Your Attendance List</h3>
                        </div>
                        <div className={isAttendToday ? "hidden" : "relative w-full px-4 max-w-full flex-grow flex-1 text-right"}>
                            <button
                                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => createAttendance("")}
                                disabled={isAttendToday}
                            >
                                Create Attendance
                            </button>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Attendance ID
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Employee name
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Date
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Status
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Time in
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Time out
                                </th>
                                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAttendance.length > 0 ? (
                                myAttendance.map((a) => (
                                    <tr key={a.id}>
                                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{a.id}</th>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{a.fullname}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{a.date}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                            <button
                                                className={
                                                    a.status === "Attended"
                                                        ? "bg-lime-300/100 px-3 py-1 rounded outline-none uppercase text-white cursor-not-allowed"
                                                        : "bg-sky-300/100 px-3 py-1 rounded outline-none uppercase text-white cursor-not-allowed"
                                                }
                                                disabled
                                            >
                                                {a.status}
                                            </button>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{a.time_in}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {a.time_out ? (
                                                a.time_out
                                            ) : (
                                                <button className="bg-red-500/100 px-3 py-1 rounded outline-none text-white uppercase" onClick={() => createAttendance(a.id)}>
                                                    <i className="fa fa-external-link"></i> Go Home
                                                </button>
                                            )}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <button
                                                className="bg-sky-500 text-white active:bg-sky-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                            >
                                                <Link to={`/attendance/${a.id}`}>
                                                    <i className="fa fa-info mr-2 text-sm"></i> Info
                                                </Link>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">No attendance available</th>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* {openModal && (
                <>
                    <Modal setOpenModal={setOpenModal} />
                </>
            )} */}
        </>
    );
};

export default CardEmployeeAttendance;
