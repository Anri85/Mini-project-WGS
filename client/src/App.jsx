import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// views
import Dashboard from "./views/admin/Dashboard";
import Settings from "./views/admin/Settings";
import Tables from "./views/admin/Tables";
import CreateUser from "./views/admin/CreateUser";

import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route element={<Admin />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/create" element={<CreateUser />} />
                        <Route path="/tables" element={<Tables />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
