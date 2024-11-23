import React, { Component } from 'react';
import axios from 'axios';

//const UrlBase = "http://190.113.84.163:8000/Usuario/eliminaCookie";

//const UrlBase = "http://190.113.84.163:8000/Usuario/Logout";
//const baseUrl = "https://localhost:44366/Usuario/Logout";
const UrlBase = "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/Logout";
class Logout extends Component {


    
    cerrarSesion = async () => {
        
        try{
            const response = await axios.post(UrlBase, {}, {withCredentials: true})
            alert("Hasta Luego");
            console.log(response);
            //window.location.href = "/";
        } catch (error){
            alert("Eror al cerrar sesion, Error: ",error);
            //window.location.href = "/";
        }
        
        
    }

    render() {
        return (
            <div>
                <button color="primary" onClick={this.cerrarSesion}>Cerrar Sesión</button>
            </div>
        );
    }
}

export default Logout;