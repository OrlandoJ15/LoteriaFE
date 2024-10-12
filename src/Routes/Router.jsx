import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Usuario from '../Pages/Usuario'
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Navbar from "../Components/Navbar";
import Logout from "../Pages/Logout";

function Router () {
    return (

        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" exact element={<Login/>} />
                <Route path="/Home" exact element={<Home/>} />
                <Route path="/Usuario" exact element={<Usuario/>} />
                <Route path="/Logout" exact element={<Logout/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;