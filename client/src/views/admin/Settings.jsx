import React, { useState, useEffect } from "react";

import authAxios from "../../utility/authAxios";

// components
import CardSettings from "../../components/Cards/CardSettings";
import CardProfile from "../../components/Cards/CardProfile";

const Settings = () => {
    const [detailUser, setDetailUser] = useState();

    const token = JSON.parse(localStorage.getItem("user"));

    const getUserDetail = async () => {
        try {
            const result = await authAxios.get(`/users/list/${token.user_id}`);
            setDetailUser(result?.data?.data);
        } catch (error) {
            console.log(error?.response?.message);
        }
    };

    useEffect(() => {
        getUserDetail();
    }, []);

    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12 px-4">
                    {detailUser ? (
                        // JIKA DETAIL USER TELAH TERLOAD MAKA LANGSUNG RENDER CARDSETTING DENGAN VALUENYA
                        <CardSettings
                            fullname={detailUser?.fullname}
                            username={detailUser?.username}
                            position={detailUser?.position}
                            division={detailUser?.division}
                            role={detailUser?.role}
                            gender={detailUser?.gender}
                        />
                    ) : (
                        // JIKA DETAI USER BELUM TERLOAD MAKA BERIKAN PESAN LOADING
                        <h1>Loading</h1>
                    )}
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    <CardProfile />
                </div>
            </div>
        </>
    );
};

export default Settings;
