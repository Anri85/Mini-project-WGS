import React, { useState, useEffect } from "react";

import authAxios from "../../api";

// components
import CardSettings from "../../components/Cards/CardSettings";
import CardProfile from "../../components/Cards/CardProfile";

const Settings = () => {
    const [detailUser, setDetailUser] = useState();

    const getUserDetail = async () => {
        try {
            const result = await authAxios.get("/users/single/");
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
                    {detailUser && (
                        <CardSettings
                            fullname={detailUser?.fullname}
                            username={detailUser?.username}
                            position={detailUser?.position}
                            division={detailUser?.division}
                            role={detailUser?.role}
                            gender={detailUser?.gender}
                        />
                    )}
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    {detailUser && (
                        <CardProfile fullname={detailUser?.fullname} division={detailUser?.division} position={detailUser?.position} image_url={detailUser?.image_url} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Settings;
