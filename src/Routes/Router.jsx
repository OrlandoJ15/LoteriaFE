import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "../Pages/Principal";
import Kardex from "../Pages/Kardex";
import Sorteo from "../Pages/Sorteo";
import TipoSorteo from "../Pages/TipoSorteo";
import TipoSorteoGeneral from "../Pages/TipoSorteoGeneral";
import TipoSorteoIntermedia from "../Pages/TipoSorteoIntermedia";

import Usuario from "../Pages/Usuario";
import Login from "../Pages/Login";
import Navbar from "../Components/Navbar";
import Logout from "../Pages/Logout";

function Router() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/Principal" exact element={<Principal />} />
        <Route path="/Usuario" exact element={<Usuario />} />
        <Route path="/TipoSorteo" exact element={<TipoSorteo />} />
        <Route path="/TipoSorteoGeneral" exact element={<TipoSorteoGeneral />} />
        <Route path="/TipoSorteoIntermedia" exact element={<TipoSorteoIntermedia />} />
        <Route path="/Sorteo" exact element={<Sorteo />} />
        <Route path="/Kardex" exact element={<Kardex />} />
        <Route path="/Logout" exact element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
