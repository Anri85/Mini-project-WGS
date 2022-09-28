import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [auth, setAuth] = useState();
    const [exception, setException] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // cek jika user telah menginput username dan password
        if (auth) {
            try {
                // lakukan panggilan api pada backend dengan payload yang diinputkan sebelumnya
                const { data } = await axios.post("http://localhost:5000/api/user/authentication", { username: auth.username, password: auth.password });
                // jika tidak terjadi error simpan response dari backend kedalam localstorage
                localStorage.setItem("user", JSON.stringify({ access_token: data?.access_token, refresh_token: data?.refresh_token, role: data?.role, user_id: data?.id }));
                // redirect ke halaman admin
                navigate("/");
            } catch (error) {
                // jika terjadi error tangkap error message dan simpan dalam state
                setException(error?.response?.data);
            }
        } else {
            return false;
        }
    };

    // tampilkan error message dengan alert (rencananya)
    useEffect(() => {
        // cek jika user telah login
        const isLogin = JSON.parse(localStorage.getItem("user"));
        // jika telah login maka user tidak bisa mengakses halaman login sebelum melakukan logout
        if (isLogin) navigate("/");
        // tampilkan jika terjadi error
        console.log(exception);
    }, [exception]);

    return (
        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="rounded-t mb-0 px-6 py-6">
                                <div className="text-center mb-3">
                                    <h6 className="text-blueGray-500 text-sm font-bold">Sign in with credentials</h6>
                                </div>
                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                            </div>
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <form>
                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Username..."
                                            required={true}
                                            onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Password..."
                                            required={true}
                                            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                                        />
                                    </div>

                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-black-800 text-black active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 w-full"
                                            type="submit"
                                            onClick={handleSubmit}
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
