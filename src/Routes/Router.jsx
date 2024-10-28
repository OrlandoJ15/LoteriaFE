import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cliente from '../Pages/Cliente'
import Kardex from '../Pages/Kardex'
import Sorteo from '../Pages/Sorteo'
import TipoSorteo from '../Pages/TipoSorteo'
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
                <Route path="/TipoSorteo" exact element={<TipoSorteo/>} />
                <Route path="/Sorteo" exact element={<Sorteo/>} />
                <Route path="/Kardex" exact element={<Kardex/>} />
                <Route path="/Cliente" exact element={<Cliente/>} />
                <Route path="/Logout" exact element={<Logout/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;