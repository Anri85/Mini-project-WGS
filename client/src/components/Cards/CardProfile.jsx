import React, { useState } from "react";
import useAxiosPrivate from "../../api/useAxiosPrivate";

const CardProfile = ({ fullname, division, position, image_url, setResponse }) => {
    const axiosPrivate = useAxiosPrivate();

    const [data, setData] = useState({ fullname: fullname, division: division, position: position, profile: image_url });
    const [preview, setPreview] = useState();

    // fungsi untuk menampung perubahan file pada form
    const handleChange = (e) => {
        setData({ ...data, images: e.target.files[0] });
        const imageURL = URL.createObjectURL(e.target.files[0]);
        setPreview(imageURL);
    };

    // fungsi untuk melakukan upload gambar berdasarkan userid yang sedang login
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("images", data?.images);
            const result = await axiosPrivate.post("/users/upload", formData);
            setResponse({ message: result?.data?.data, status: result?.data?.status, statusCode: result?.status });
        } catch (error) {
            setResponse({ message: error?.response?.data?.message, status: error?.response?.data?.status, statusCode: 400 });
        }
    };

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
                <div className="px-6">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full px-4 flex justify-center">
                            <div className="relative">
                                <img
                                    alt="profile"
                                    src={preview ? preview : `http://localhost:5000/images/${data?.profile}`}
                                    className="shadow-xl h-44 w-64 rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-20 mr-8 max-w-150-px"
                                />
                            </div>
                        </div>
                        <div className="w-full px-4 text-center mt-20">
                            <div className="flex justify-center py-4 lg:pt-4 pt-8">
                                <div className="mr-4 p-3 text-center mt-5">
                                    <label className="block mb-2 text-sm font-extrabold text-gray-300">Change Picture</label>
                                    <input
                                        className="border-0 mb-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        name="images"
                                        type="file"
                                        onChange={handleChange}
                                        required={true}
                                    ></input>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={handleUpload}
                                    >
                                        Upload
                                    </button>
                                    {/* <span className="text-sm text-blueGray-400">Friends</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-10">
                        <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">{data?.fullname}</h3>
                        {/* <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                            <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i> Los Angeles, California
                        </div> */}
                        <div className="mb-2 text-blueGray-600 mt-10">
                            <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                            {data?.position} - At Walden Global Services
                        </div>
                        <div className="mb-2 text-blueGray-600">
                            <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                            {data?.division} - At Walden Global Services
                        </div>
                    </div>
                    {/* <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full lg:w-9/12 px-4">
                                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                                    An artist of considerable range, Jenna the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and records all of his
                                    own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.
                                </p>
                                <a href="#pablo" className="font-normal text-lightBlue-500" onClick={(e) => e.preventDefault()}>
                                    Show more
                                </a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default CardProfile;
