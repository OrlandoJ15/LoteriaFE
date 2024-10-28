// import React from "react";
// import "../Styles/Login.css";
// import axios from "axios";
// import Cookies from "universal-cookie";

// const baseUrl = "https://localhost:44366/Usuario/ValidarUsuarioLogin";
// const cookies = new Cookies();

// class Login extends React.Component {
//   state = {
//     form: {
//       IdUsuario: "",
//       Clave: "",
//     },
//     error: false,
//     errorMsj: "",
//   };

//   manejadorSubmit = (e) => {
//     e.preventDefault();
//   };

//   handleChange = async (e) => {
//     e.persist();
//     await this.setState({
//       form: {
//         ...this.state.form,
//         [e.target.name]: e.target.value, 
//       },
//     });
//   };

//   iniciarSesion = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(baseUrl, {
//         params: {
//           IdUsuario: this.state.form.IdUsuario,
//           Clave: this.state.form.Clave,
//         },
//       });

//       const data = response.data;
//       if (data.length > 0) {
//         const respuesta = data[0];
//         cookies.set('IdUsuario', respuesta.IdUsuario, { path: "/" });
//         cookies.set('Clave', respuesta.Clave, { path: "/" });
//         alert('Bienvenido');
//         window.location.href = "./Home";
//       } else {
//         alert('El usuario o la contraseña no son correctos');
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert('Ocurrió un error durante el inicio de sesión.');
//     }
//   };

//   componentDidMount() {
//     if (cookies.get('IdUsuario')) {
//       window.location.href = "./Home";
//     }
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className="wrapper fadeInDown">
//           <div id="formContent">
//             <div className="fadeIn first">
//             </div>

//             <form onSubmit={this.manejadorSubmit}>
//               <input
//                 type="text"
//                 className="fadeIn second"
//                 name="IdUsuario"
//                 placeholder="Usuario"
//                 onChange={this.handleChange}
//               />
//               <input
//                 type="password"
//                 className="fadeIn third"
//                 name="Clave"
//                 placeholder="Password"
//                 onChange={this.handleChange}
//               />
//               <input
//                 type="submit"
//                 className="fadeIn fourth"
//                 value="Log In"
//                 onClick={this.iniciarSesion}
//               />
//             </form>
//           </div>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export default Login;







import React from "react";
import "../Styles/Login.css";
import axios from "axios";
import Cookies from "universal-cookie";

const baseUrl = "https://localhost:44366/Usuario/ValidarUsuarioLogin";
const cookies = new Cookies();

class Login extends React.Component {
  state = {
    form: {
      IdUsuario: "",
      Clave: "",
    },
    error: false,
    errorMsj: "",
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value, 
      },
    });
  };

  iniciarSesion = async (e) => {
    e.preventDefault();

    const options = {
      IdUsuario: this.state.form.IdUsuario,
      Clave: this.state.form.Clave,
      Rol: 0,
      Nombre: "",
      NombreUsuario: "",
      Correo: "",
    };

    try {
      const response = await axios.post(baseUrl, options);
      const data = response.data;
      if (data.length > 0) {
        const respuesta = data[0];
        cookies.set('IdUsuario', respuesta.IdUsuario, { path: "/" });
        cookies.set('Clave', respuesta.Clave, { path: "/" });
        alert('Bienvenido');
        window.location.href = "./Home";
      } else {
        alert('El usuario o la contraseña no son correctos');
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert('Ocurrió un error durante el inicio de sesión.');
    }
  };

  componentDidMount() {
    if (cookies.get('IdUsuario')) {
      window.location.href = "./Home";
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <div className="fadeIn first">
            </div>

            <form onSubmit={this.manejadorSubmit}>
              <input
                type="text"
                className="fadeIn second"
                name="IdUsuario"
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
                value="Log In"
                onClick={this.iniciarSesion}
              />
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;