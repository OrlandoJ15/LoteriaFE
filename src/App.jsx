import './App.css'
import React,{useState,useEffect, lazy, Suspense} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Cookies from 'universal-cookie';

const Principal =lazy(()=>import('./Pages/Principal'));
const Kardex =lazy(()=>import('./Pages/Kardex'));
const Sorteo =lazy(()=>import('./Pages/Sorteo'));
const TipoSorteo =lazy(()=>import('./Pages/TipoSorteo'));
const TipoSorteoGeneral =lazy(()=>import('./Pages/TipoSorteoGeneral'));
const TipoSorteoIntermedia = lazy(()=>import('./Pages/TipoSorteoIntermedia'));
const Usuario =lazy(()=>import('./Pages/Usuario'));
const Login =lazy(()=>import('./Pages/Login'));
const Logout =lazy(()=>import('./Pages/Logout'));

const cookies = new Cookies();

function App() {

  // Estado para manejar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar el estado de autenticación al cargar el componente
  // useEffect(() => {
  //   const token = cookies.get('Token'); // Cambié 'token' a 'Token' basado en tu Login.jsx
  //   setIsAuthenticated(!!token); // Actualiza isAuthenticated basado en si el token existe
  // }, []);


  return (
    <Suspense fallback={<p>Cargando</p>}>
      <BrowserRouter>
        {/* {isAuthenticated && <Navbar />}   */}
        <Navbar/>     
        <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/Principal' exact element={<Principal/>} />    
          <Route path='/Usuario' exact element={<Usuario/>} />
          <Route path='/TipoSorteo' exact element={<TipoSorteo/>} />
          <Route path='/TipoSorteoGeneral' exact element={<TipoSorteoGeneral/>} />
          <Route path='/TipoSorteoIntermedia' exact element={<TipoSorteoIntermedia/>} />
          <Route path='/Sorteo' exact element={<Sorteo/>} />
          <Route path='/Kardex' exact element={<Kardex/>} />
          <Route path='/Logout' exact element={<Logout/>} />

        </Routes>
      </BrowserRouter>
   </Suspense>
  )
}

export default App
