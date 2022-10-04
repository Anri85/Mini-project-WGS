import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import FooterAdmin from "../components/Footers/FooterAdmin";

const useAuth = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData === null ? false : userData;
};

const Admin = () => {
    const isAuth = useAuth();

    return isAuth ? (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <AdminNavbar />
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <Outlet />
                    <FooterAdmin />
                </div>
            </div>
        </>
    ) : (
        <Navigate to="/login" />
    );

    // useEffect(() => {
    //     // cek jika localstorage tersedia maka artinya user telah login
    //     const isLogin = JSON.parse(localStorage.getItem("user"));
    //     // jika localstorage tidak tersedia maka kembalikan user pada halaman login
    //     if (!isLogin) return navigate("/login");
    // }, []);

    // return (
    //     <>
    //         <Sidebar />
    //         <div className="relative md:ml-64 bg-blueGray-100">
    //             <AdminNavbar />
    //             <HeaderStats />
    //             <div className="px-4 md:px-10 mx-auto w-full -m-24">
    //                 <Outlet />
    //                 <FooterAdmin />
    //             </div>
    //         </div>
    //     </>
    // );
};

export default Admin;
