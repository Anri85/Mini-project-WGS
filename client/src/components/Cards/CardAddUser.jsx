import React, { useState } from "react";
import authAxios from "../../utility/authAxios";

const CardAddUser = () => {
    // buat state untuk mennyimpan data type input, data type select dan data type file
    const [newUserData, setNewUserData] = useState({
        fullname: "",
        username: "",
        password: "",
        role: "Employee",
        position: "Employee",
        division: "Marketing",
        gender: "Male",
        images: "",
    });

    const [response, setResponse] = useState();

    // fungsi untuk menangani perubahan dalam inputan
    const handleChange = (e) => {
        // jika input bertype file maka masukan kedalam state images
        if (e.target.type === "file") {
            setNewUserData({ ...newUserData, images: e.target.files[0] });
        } else {
            // jika inputan bukan bertype file maka simpan kedalam state dengan menyesuaikan pasangan name dan valuenya
            setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
        }
    };

    // fungsi untuk memanggil api dan mengirimkan data pada backend
    const handleClick = async (e) => {
        e.preventDefault();
        // karena pengiriman data berbarengan dengan mengirim file maka data harus dirubah menjadi format form data
        const formData = new FormData();
        // lakukan looping untuk append kedalam formdata berdasarkan key dan value dari state newUserData
        for (let key in newUserData) {
            formData.append(key.toString(), newUserData[key]);
        }
        try {
            const result = await authAxios.post("/users/create", formData);
            setResponse(result?.data);
        } catch (error) {
            setResponse(error?.response?.data);
        }
    };

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                    <div className="text-center flex justify-between">
                        <h6 className="text-blueGray-700 text-xl font-bold">Add new user</h6>
                        {response && (
                            <div
                                className={
                                    response?.status === true
                                        ? "flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
                                        : "flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3"
                                }
                                role="alert"
                            >
                                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                                </svg>
                                <p>{response?.message}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form>
                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Employee Identity</h6>
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Photo</label>
                                        <div className="mt-1 flex items-center">
                                            <input
                                                type="file"
                                                name="images"
                                                onChange={handleChange}
                                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                                        Fullname
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Insert fullname..."
                                        required={true}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Insert username..."
                                        required={true}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="Create password..."
                                        required={true}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="mt-6 border-b-1 border-blueGray-300" />

                        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Employee Status</h6>
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="role">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        name="role"
                                        onChange={handleChange}
                                        value={newUserData?.role}
                                    >
                                        <option defaultValue="Employee">Employee</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Super admin">Super admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="position">
                                        Position
                                    </label>
                                    <select
                                        id="position"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        name="position"
                                        onChange={handleChange}
                                        value={newUserData?.position}
                                    >
                                        <option defaultValue="Employee">Employee</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Chief">Chief</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="division">
                                        Division
                                    </label>
                                    <select
                                        id="division"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        name="division"
                                        onChange={handleChange}
                                        value={newUserData?.division}
                                    >
                                        <option defaultValue="Marketing">Marketing</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="gender">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        name="gender"
                                        onChange={handleChange}
                                        value={newUserData?.gender}
                                    >
                                        <option defaultValue="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative w-full mb-3">
                                    <div className="px-4 py-6 text-left sm:px-6">
                                        <button
                                            type="submit"
                                            onClick={handleClick}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-6 border-b-1 border-blueGray-300" />
                    </form>
                </div>
            </div>
        </>
    );
};

export default CardAddUser;
