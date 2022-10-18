import React, { useState, useEffect, useRef } from "react";

import useAxiosPrivate from "../../api/useAxiosPrivate";

const Modal = ({ setOpenModal }) => {
    let stream;
    let video;

    const axiosPrivate = useAxiosPrivate();

    const videoRef = useRef(null);
    const photoRef = useRef(null);

    const [hasPhoto, setHasPhoto] = useState(false);

    // fungsi yang digunakan untuk mengakese webcam menggunakan navigator.mediaDevices.getUserMedia
    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 640, height: 360 } })
            .then((data) => {
                // fungsi navigator akan menghasilkan data kemudian data tersebut dipasang pada tag video lewat videoRef
                stream = data;
                video = videoRef.current;
                video.srcObject = data;
                video.onloadedmetadata = () => {
                    video.play();
                };
            })
            // jika terjadi error
            .catch((error) => console.log(error));
    };

    // fungsi untuk melakukan close webcam
    const closeVideo = () => {
        // jika terdapat stream yang berasal dari fungsi getVideo
        if (stream) {
            // maka hapus stream tersebut
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            stream = undefined;
        }
        // kemudian tutup kembali modalnya
        setOpenModal(false);
    };

    // fungsi untuk melakukan pengambilan foto
    const takePhoto = () => {
        const width = 640;
        const height = 360;

        // ambil data videoRef dan photoRef
        let video = videoRef.current;
        let photo = photoRef.current;

        // atur ukuran foto
        photo.width = width;
        photo.height = height;

        // draw sebuah elemen canvas berdasarkan dari data videoRef
        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);
        // ubah state hasPhoto menjadi true
        setHasPhoto(true);
    };

    // fungsi untuk melakukan retake photo
    const clearPhoto = () => {
        // ambil elemen canvas yang berisi foto
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");

        // hapus photo dari elemen canvas tersevut
        ctx.clearRect(0, 0, photo.width, photo.height);
        // ubah state hasPhoto menjadi false
        setHasPhoto(false);
    };

    // fungsi untuk memproses foto menjadi base64 sebelum dikirimkan kepada backend
    const createBase64 = async () => {
        // cek apakah terdapat photo dalam elemen canvas
        if (hasPhoto) {
            if (window.confirm("This data is true?") === true) {
                // ambil elemen canvas yang berisi foto
                const element = document.getElementById("photo");
                // rubah foto tersebut menjadi base64
                const base64 = element.toDataURL("image/jpeg", 0.1);
                // kirimkan kepada backend
                await axiosPrivate.post(`/attendance/create/${""}`, { base64: base64 });
                window.location.reload();
            }
        } else {
            return false;
        }
    };

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-2 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-xl font-semibold">Please take your pic...</h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={closeVideo}
                            >
                                <i className="fa fa-window-close bg-dark" aria-hidden="true"></i>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-2 flex-auto">
                            <div className="camera">
                                <video id="video" ref={videoRef}></video>
                            </div>
                            <div className={"result " + (hasPhoto ? "hasPhoto" : "")}>
                                <canvas id="photo" className="ml-2 mt-2" ref={photoRef}></canvas>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                            {hasPhoto ? (
                                <>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={clearPhoto}
                                    >
                                        Retake Photo
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={createBase64}
                                    >
                                        Create Attendance
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={takePhoto}
                                >
                                    Take Photo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default Modal;
