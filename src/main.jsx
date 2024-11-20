import { StrictMode } from 'react'
import React from 'react';
import ReactDOM from 'react-dom';

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Rutas from './Routes/Router.jsx'
import Router from './Routes/Router.jsx';
import Login from './Pages/Login.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <App/>
  </React.StrictMode>,
)
