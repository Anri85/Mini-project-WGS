import React from "react";
import { Navigate, Route } from "react-router-dom";

const RouteGuard = ({ component: Component, ...rest }) => {
    const hasJwt = () => {
        let flag = false;
        localStorage.getItem("user") ? (flag = true) : (flag = false);
        return flag;
    };
    return <Route {...rest} element={(props) => (hasJwt() ? <Component {...props} /> : <Navigate to="/login" />)} />;
};

export default RouteGuard;
