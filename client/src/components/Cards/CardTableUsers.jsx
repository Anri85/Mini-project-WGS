import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import authAxios from "../../utility/authAxios";

const CardTableUsers = ({ color }) => {
    const [users, setUsers] = useState([]);
    const [response, setResponse] = useState();

    const token = JSON.parse(localStorage.getItem("user"));

    const getUsers = async () => {
        try {
            const result = await authAxios.get("/users/list");
            setUsers(result?.data?.data);
            setResponse({ ...response, message: result?.data?.message, status: result?.data?.status });
        } catch (error) {
            response(error?.response?.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm("Are you sure will delete this user?") === true) {
                const result = await authAxios.delete(`/users/delete/${id}`);
                setResponse({ ...response, message: result?.data?.message, status: result?.data?.status });
                window.location.reload();
            }
            return false;
        } catch (error) {
            response(error?.response?.data);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>Users Tables</h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Fullname
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Division
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Position
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Gender
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users ? (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="border-t-0 px-10 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                            <img src={`http://localhost:5000/images/${u.image_url}`} className="h-12 w-12 bg-white rounded-full border" alt="..."></img>{" "}
                                            <span className={"ml-3 font-bold " + +(color === "light" ? "text-blueGray-600" : "text-white")}>{u.fullname}</span>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{u.division}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{u.position}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">Male</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {/* <TableDropdown /> */}
                                            <Link to="/user/123">
                                                <i className="fa fa-info mr-2 bg-sky-400 text-white active:bg-sky-400 px-4 py-2 rounded outline-none"></i>
                                            </Link>
                                            <button
                                                className={
                                                    u.id === token.user_id
                                                        ? "border-none outline-none focus:outline-none cursor-not-allowed"
                                                        : "border-none outline-none focus:outline-none"
                                                }
                                                onClick={() => handleDelete(u.id)}
                                                disabled={u.id === token.user_id ? true : false}
                                            >
                                                <i className="fa fa-trash mr-2 bg-red-400 text-white active:bg-red-400 px-4 py-2 rounded outline-none"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

CardTableUsers.defaultProps = {
    color: "dark",
};

CardTableUsers.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};

export default CardTableUsers;
