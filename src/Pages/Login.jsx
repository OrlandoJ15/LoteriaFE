import React from "react";
import "../Styles/Login.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";



////////////url azure///
const baseUrl = "https://loteriabackapi.azurewebsites.net/api/Usuario/Login";
//const baseUrlOut = "https://loteriawebapimvp.azurewebsites.net/Usuario/Logout";


const cookies = new Cookies();

class Login extends React.Component {
  state = {
    form: {
      Id: "",
      Clave: "",
    },
    error: false,
    errorMsj: "",
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.form.Id && this.state.form.Clave) {
      this.iniciarSesion();
    } else {
      alert("Por favor, complete ambos campos.");
    }
  };

  iniciarSesion = async () => {
    const { Id, Clave } = this.state.form;

    const options = {
      Id: Id,
      nombre: "",
      nombreUsuario: "",
      rol: 0,
      correo: "",
      clave: Clave,
    };

    try {
      const response = await axios.post(baseUrl, options);
      const data = response.data;
      //if (data && data.token){ // && data.user) {
      if(response.status === 200){// && response.data.Message === "Inicio de sesión exitoso"){
        // Guardar el token y la información del usuario en cookies
        //console.log("entro al if ");

        cookies.set("Token", data.token, { 
          path: '/', 
          httpOnly: true, 
          secure: true, 
          sameSite: 'Strict', 
          expires: new Date(Date.now() + 3600000) // Expiración en 1 hora
        });
        cookies.set("Id", data.user.id);
        cookies.set("Nombre", data.user.nombre);
        cookies.set("NombreUsuario", data.user.nombreUsuario);
        cookies.set("Correo", data.user.correo);
        cookies.set("Rol", data.user.rol);
        // Llamar al prop para actualizar el estado de autenticación
        //this.props.setIsAuthenticated(true);
        
        alert("Bienvenido");
        //window.location.href = '/Principal';
        
      } else {
        alert("El usuario o la contraseña no son correctos.");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      alert("Ocurrió un error durante el inicio de sesión.");
    }
  };

  // componentDidMount() {
  //   // Verificar si ya hay una sesión activa y redirigir
  //   const token = cookies.get("Token");
  //   if (token) {
  //     this.props.setIsAuthenticated(true);
  //     window.location.href = "/Principal";
  //   }
  // }

  render() {
    return (
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              className="fadeIn second"
              name="Id"
              placeholder="Usuario"
              onChange={this.handleChange}
            />
            <input
              type="password"
              className="fadeIn third"
              name="Clave"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <input
              type="submit"
              className="fadeIn fourth"
              value="Log In Putoo"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
