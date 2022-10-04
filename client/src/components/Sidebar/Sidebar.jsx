/*eslint-disable*/
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import image from "../../assets/img/team-1-800x800.jpg";

const useAuth = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData === null ? false : userData;
};

const Sidebar = () => {
    const isAuth = useAuth();

    const navigate = useNavigate();

    const [collapseShow, setCollapseShow] = useState("hidden");

    // fungsi ketika user melakukan logout
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // ambil user data pada localstorage
            const userData = JSON.parse(localStorage.getItem("user"));
            // jika terdapat user data maka panggil api untuk melakukan logout
            if (userData) {
                await axios.delete(`http://localhost:5000/api/user/authentication/${userData?.refresh_token}`);
                localStorage.clear();
                navigate("/login");
            }
        } catch (error) {
            console.log(error?.response?.data);
        }
    };

    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
                    >
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </button>
                    {/* Brand */}
                    <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/">
                        Employee Attendance
                    </Link>
                    {/* User */}
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <div className="items-center flex">
                                <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                                    <img alt="..." className="w-full rounded-full align-middle border-none shadow-lg" src={image} />
                                </span>
                            </div>
                        </li>
                    </ul>
                    {/* Collapse */}
                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/">
                                        Employee Attendance
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() => setCollapseShow("hidden")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Form */}
                        <form className="mt-6 mb-4 md:hidden">
                            <div className="mb-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                                />
                            </div>
                        </form>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />
                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">Admin Pages</h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            {isAuth.role === "Super admin" || isAuth.role === "Admin" ? (
                                <>
                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/"
                                        >
                                            <i className={"fas fa-tv mr-2 text-sm " + (window.location.href.indexOf("/") !== -1 ? "opacity-75" : "text-blueGray-300")}></i>{" "}
                                            Dashboard
                                        </Link>
                                    </li>

                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/attendance") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/attendance"
                                        >
                                            <i
                                                className={
                                                    "fa fa-address-book mr-2 text-sm " + (window.location.href.indexOf("/attendance") !== -1 ? "opacity-75" : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Attendance List
                                        </Link>
                                    </li>

                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/settings") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/settings"
                                        >
                                            <i
                                                className={"fas fa-tools mr-2 text-sm " + (window.location.href.indexOf("/settings") !== -1 ? "opacity-75" : "text-blueGray-300")}
                                            ></i>{" "}
                                            Settings
                                        </Link>
                                    </li>

                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/create") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/create"
                                        >
                                            <i
                                                className={
                                                    "fa fa-plus-square mr-2 text-sm " + (window.location.href.indexOf("/create") !== -1 ? "opacity-75" : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Add new user
                                        </Link>
                                    </li>

                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/tables") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/tables"
                                        >
                                            <i className={"fas fa-table mr-2 text-sm " + (window.location.href.indexOf("/tables") !== -1 ? "opacity-75" : "text-blueGray-300")}></i>{" "}
                                            Users Table
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/"
                                        >
                                            <i className={"fas fa-tv mr-2 text-sm " + (window.location.href.indexOf("/") !== -1 ? "opacity-75" : "text-blueGray-300")}></i>{" "}
                                            Dashboard
                                        </Link>
                                    </li>

                                    <li className="items-center">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/settings") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            to="/settings"
                                        >
                                            <i
                                                className={"fas fa-tools mr-2 text-sm " + (window.location.href.indexOf("/settings") !== -1 ? "opacity-75" : "text-blueGray-300")}
                                            ></i>{" "}
                                            Settings
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />
                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">Users Pages</h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <button className="text-blueGray-700 text-xs uppercase py-3 font-bold block outline-none focus:outline-none" onClick={handleLogout}>
                                    <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
