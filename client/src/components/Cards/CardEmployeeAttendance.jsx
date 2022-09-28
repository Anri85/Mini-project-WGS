import React, { useEffect, useState } from "react";
import authAxios from "../../utility/authAxios";
import { Link } from "react-router-dom";

// components
import Modal from "../Modal/Modal";

const CardEmployeeAttendance = () => {
    const [openModal, setOpenModal] = useState(false);
    const [response, setResponse] = useState();
    const [attendance, setAttendance] = useState([]);
    const [isAttendToday, setIsAttendToday] = useState(false);

    const token = JSON.parse(localStorage.getItem("user"));

    const createAttendance = async (id) => {
        try {
            const result = await authAxios.post(`/attendance/create/${id}`);
            setResponse(result?.data);
            window.location.reload();
        } catch (error) {
            setResponse(error?.response?.data);
        }
    };

    const getAttendanceList = async () => {
        try {
            const result = await authAxios.get("/attendance/list");
            setAttendance(result?.data?.data);
        } catch (error) {
            setResponse(error?.response?.data);
        }
    };

    const checkIsAttend = () => {
        const myAttendance = attendance.filter((a) => a.user_id === token.user_id && a.date === new Date().toISOString().split("T")[0]);
        myAttendance.length > 0 ? setIsAttendToday(true) : setIsAttendToday(false);
    };

    useEffect(() => {
        getAttendanceList();
    }, []);

    useEffect(() => {
        checkIsAttend();
    }, [attendance]);

    return (
        <>
            <div className="relative flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">Employee Attendance</h3>
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
                    {/* Projects table */}
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
                            {attendance.length > 0 ? (
                                attendance.map((a) => (
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
                                                <Link to="/attendance/123">
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
