import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, TextField, Button, Box} from "@mui/material";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import InputGeneral from "../Components/InputGeneral";
import {
  ColumnaCenter,
  Columna,
  Formulario,
  MensajeExito,
  MensajeError,
} from "../Components/Formularios";
import "../Styles/Cliente.modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "Codigo", field: "idUsuario" },
  { title: "Nombre", field: "nombre" },
  { title: "Nombre De Usuario", field: "nombreUsuario" },
  { title: "Rol", field: "rol", type: "numeric" },
  { title: "Correo", field: "correo" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Usuario/RecUsuario";
const baseUrlPost = "https://localhost:44366/Usuario/InsUsuario";
const baseUrlPut = "https://localhost:44366/Usuario/ModUsuario";
const baseUrlDel = "https://localhost:44366/Usuario/DelUsuario";
const endPointUsuarioXId = "https://localhost:44366/Usuario/RecUsuarioXId/" + IdUsuario.campo;
const endPointValidarClave = "https://localhost:44366/Usuario/ValidarUsuarioLogin";
const endPointCambioClave = "https://localhost:44366/Usuario/ModClaveUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Usuario = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [IdUsuario, cambiarIdUsuario] = useState({ campo: "", valido: null });
  const [Nombre, cambiarNombre] = useState({ campo: "", valido: null });
  const [NombreUsuario, cambiarNombreUsuario] = useState({
    campo: "",
    valido: null,
  });
  const [Rol, cambiarRol] = useState({ campo: 0, valido: null });
  const [Correo, cambiarCorreo] = useState({ campo: "", valido: null });
  const [Clave, cambiarClave] = useState({ campo: "", valido: null });

  const [NuevaClave, cambiarNuevaClave] = useState({ campo: "", valido: null });
  const [ConfirmarNuevaClave, cambiarConfirmarNuevaClave] = useState({
    campo: "",
    valido: null,
  });

  const [formularioValido, cambiarFormularioValido] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    IdUsuario: /^[0-9]*$/,
    Nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    NombreUsuario: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    Rol: /^[1-9]$/, // solo numero del 1-9
    Correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
    Clave: /^(?=(?:.*[A-Za-z]){4,})(?=.*[A-Z])(?=(?:.*\d){4,})[A-Za-z\d]{8,}$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
  };

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      IdUsuario.valido === "true" &&
      Nombre.valido === "true" &&
      NombreUsuario.valido === "true" &&
      Rol.valido === "true" &&
      Correo.valido === "true" &&
      Clave.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiarIdUsuario({ campo: "", valido: "" });
      cambiarNombre({ campo: "", valido: null });
      cambiarNombreUsuario({ campo: "", valido: null });
      cambiarRol({ campo: "", valido: null });
      cambiarCorreo({ campo: "", valido: null });
      cambiarClave({ campo: "", valido: null });
      showQuestionPost();
    } else {
      cambiarFormularioValido(false);
    }
  };

  const onsubmitput = (e) => {
    e.preventDefault();
    if (
      IdUsuario.valido === "true" &&
      Nombre.valido === "true" &&
      NombreUsuario.valido === "true" &&
      Rol.valido === "true" &&
      Correo.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiarIdUsuario({ campo: "", valido: "" });
      cambiarNombre({ campo: "", valido: null });
      cambiarNombreUsuario({ campo: "", valido: null });
      cambiarRol({ campo: "", valido: null });
      cambiarCorreo({ campo: "", valido: null });
      showQuestionPut();
    } else {
      cambiarFormularioValido(false);
    }
  };

  const onSubmitCambioClave = (e) => {
    console.log("entro al onsubmitcambioclave");
    console.log(Clave);
    console.log(NuevaClave);
    console.log(ConfirmarNuevaClave);
    e.preventDefault();
    if (
      Clave.valido === "true" &&
      NuevaClave.valido === "true" &&
      ConfirmarNuevaClave.valido === "true"
    ) {
      console.log("entro al if de validaado");
      showQuestionCambioClave();
      cambiarFormularioValido(true);
      cambiarClave({ campo: "", valido: null });
      cambiarNuevaClave({ campo: "", valido: null });
      cambiarConfirmarNuevaClave({ campo: "", valido: null });
    } else {
      console.log("Entro al else del onsubmit");
      cambiarFormularioValido(false);
    }
  };

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaUsuarioId() {
    function showError() {
      Swal.fire({
        icon: "error",
        title: "Cuidado",
        text: "Codigo Usuario Existente, Intente Nevamente",
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointUsuarioXId).then((response) => {
        const data = response.data;
        console.log(data)
        if (data === null) {
          cambiarIdUsuario({ campo: IdUsuario.campo, valido: "true" });
        } else {
          cambiarIdUsuario({ campo: "", valido: "false" });
          showError();
        }
      });
    };
    MetodoValidar();
  }

  function ValidarClave() {
    function showError() {
      Swal.fire({
        icon: "error",
        title: "Cuidado",
        text: "Contrasena incorrecta, Intente Nevamente",
      });
    }

    const options = {
      idUsuario: IdUsuario.campo,
      nombre: "",
      nombreUsuario: "",
      rol: 0,
      correo: "",
      clave: Clave.campo,
    };


    const MetodoValidar = async () => {
      await axios
      .post(
        endPointValidarClave,
        options
      )
      .then((response) => {
        const data = response.data;
        if (data === null) {
          cambiarClave({ campo: "", valido: "false" });
          showError();
        } else {
          cambiarClave({ campo: Clave.campo, valido: "true" });
        }
      });
    };
    MetodoValidar();
  }

  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  ////////////////////////////////CONSTANTES MODAL/////////////////////////////////

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalCambioClave, setModalCambioClave] = useState(false);

  //////////////////////////////// FINALIZA CONSTANTES MODAL/////////////////////////////////

  ////////////////////////////PETICION POST//////////////////////////////////////////////////

  function showQuestionPost() {
    Swal.fire({
      title: "Desea Guardar Los Cambios Efectuados?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
      }
    });
  }

  // const peticionPostKardex = async () => {
  //   const options = {
  //     Serie: Serie.campo,
  //     Numero: Numero.campo,
  //     Nombre: Nombre.campo,
  //     Monto: Monto.campo,
  //     IdUsuario: IdUsuario.campo,
  //   };

  //   await axios.post(baseUrlPostKardex, options).then((response) => {
  //     setData(data.concat(response.data));
  //     abrirCerrarModalInsertar();
  //   });
  // };

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      IdUsuario: IdUsuario.campo,
      Nombre: Nombre.campo,
      NombreUSuario: NombreUsuario.campo,
      Rol: Rol.campo,
      Correo: Correo.campo,
      Clave: Clave.campo,
    };

    await axios
      .post(baseUrlPost, options)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
        //peticionGet(); //REFRESCA EL GRID
      })
      .catch((error) => {
        console.error("Error en la petición POST:", error); // Log para ver detalles del error
      });
  };

  ////////////////////////////FINALIZA PETICION POST/////////////////////////////////////////

  ////////////////////////////PETICION PUT///////////////////////////////////////////////////

  function showQuestionPut() {
    Swal.fire({
      title: "Desea Guardar Los Cambios Efectuados?",
      showDenyButton: true,
      confirmButtonText: "Editar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPut();
        //peticionPutKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
      }
    });
  }

  const peticionPut = async () => {
    const options = {
      idUsuario: IdUsuario.campo,
      nombre: Nombre.campo,
      nombreUsuario: NombreUsuario.campo,
      rol: Rol.campo,
      correo: Correo.campo,
    };

    await axios
      .put(baseUrlPut, options)
      .then((response) => {
        // Crear una copia de los datos originales
        const dataNueva = [...data];
        // Mapear sobre la copia para modificar el usuario
        const updatedData = dataNueva.map((Usuario) => {
          if (Usuario.idUsuario === options.idUsuario) {
            return {
              ...Usuario,
              nombre: options.nombre,
              nombreUsuario: options.nombreUsuario,
              rol: options.rol,
              correo: options.correo,
            };
          }
          return Usuario;
        });

        // Actualizar el estado con el nuevo array actualizado
        setData(updatedData);

        // Cerrar el modal después de la actualización
        abrirCerrarModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////

  const peticionDelete = async () => {
    const idUsuario = IdUsuario.campo; // Asegúrate de que esto esté obteniendo el ID correcto

    const payload = {
      headers: {
        "Content-Type": "application/json", // Establecer tipo de contenido
        Authorization: "",
      },
      data: JSON.stringify(idUsuario), // Convertimos a JSON, Aquí pasas el ID del usuario en el cuerpo de la solicitud
    };
    await axios
      .delete(baseUrlDel, payload) // No pasas el ID en la URL
      .then((response) => {
        //Filtras los datos eliminando el usuario
        setData(data.filter((Usuario) => Usuario.IdUsuario !== idUsuario));
        peticionGet();
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log("Error al eliminar usuario:", error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarUsuario = async (usuario, caso) => {
    const XUsuario = Object.values(...usuario);

    cambiarIdUsuario({ campo: XUsuario[0], valido: "true" });
    cambiarNombre({ campo: XUsuario[1], valido: "true" });
    cambiarNombreUsuario({ campo: XUsuario[2], valido: "true" });
    cambiarRol({ campo: XUsuario[3], valido: "true" });
    cambiarCorreo({ campo: XUsuario[4], valido: "true" });
    caso === "Editar"
      ? abrirCerrarModalEditar()
      : caso === "Eliminar"
      ? abrirCerrarModalEliminar()
      : abrirCerrarModalCambioClave();
  };

  const peticionGet = async () => {
    await axios.get(baseUrl).then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    peticionGet();
  }, []);

  //////////////////////////FINALIZA PETICION SELECT////////////////////////

  ////////////////////////// PETICION CAMBIO CLAVE////////////////////////

  const peticionCambioClave = async () => {
    console.log("entro al peticioncambioclave");
    console.log(Clave);
    console.log(NuevaClave);
    console.log(ConfirmarNuevaClave);

    function showError() {
      Swal.fire({
        icon: "error",
        title: "Cuidado",
        text: "No fue posible actualizar la contrasena",
      });
    }
    function showExito() {
      Swal.fire({
        icon: "success",
        title: "Exitos",
        text: "Contrasena Actualizada Exitosamente",
      });
    }

    try {
      const options = {
        IdUsuario: IdUsuario.campo,
        Nombre: "",
        NombreUsuario: "",
        Rol: 0,
        Correo: "",
        Clave: ConfirmarNuevaClave.campo,
      };

      console.log(options);
      console.log("entramos en la peticon del cambio de clave ");

      await axios.put(endPointCambioClave, options).then((response) => {
        if (response.status === 200) {
          showExito();
        } else {
          showError();
        }
        abrirCerrarModalCambioClave();

      });

    } catch (error) {
      console.log(error);
      showError();
    }
  };

  //////////////////////////FINALIZA PETICION CAMBIO CLAVE////////////////////////

  //////////////////////////MODALES////////////////////////

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const abrirCerrarModalCambioClave = () => {
    setModalCambioClave(!modalCambioClave);
  };

  //////////////////////////MODALES////////////////////////

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    backgroundColor: "rgb(255, 255, 255)",
  };

  const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  const modalStylesDelete = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  const ListStyleButton = {
    margin: "20px 0px 0px 0px",
  };

  const StyleLabelAfterButton = {
    margin: "0px 0px 10px 0px",
  };

  const Text = {
    fontWeight: "bold",
  };

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  /////////////////////////INCLUIR ARTICULOS////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3>Incluir Usuario v2</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <InputGeneral
                estado={IdUsuario}
                cambiarEstado={cambiarIdUsuario}
                tipo="text"
                label="Id Usuario"
                placeholder="Introduzca Id Del Usuario"
                name="IdUsuario"
                leyendaError="El Id Del Usuario solo puede contener numeros."
                expresionRegular={expresionesRegulares.IdUsuario}
                onChange={ValidarExistenciaUsuarioId}
                onBlur={ValidarExistenciaUsuarioId}
                autofocus
              />
              <InputGeneral
                estado={Nombre}
                cambiarEstado={cambiarNombre}
                tipo="text"
                label="Nombre"
                placeholder="Introduzca El Nombre"
                name="Nombre"
                leyendaError="El Nombre solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.Nombre}
              />

              <InputGeneral
                estado={NombreUsuario}
                cambiarEstado={cambiarNombreUsuario}
                tipo="text"
                label="Nombre De Usuario"
                placeholder="Introduzca El Nombre De Usuario"
                name="NombreUsuario"
                leyendaError="El Nombre del Usuario solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.NombreUsuario}
              />

              <InputGeneral
                estado={Rol}
                cambiarEstado={cambiarRol}
                tipo="number"
                label="Rol"
                placeholder="Introduzca El Rol"
                name="Rol"
                leyendaError="El rol solo puede contener numeros"
                expresionRegular={expresionesRegulares.Rol}
              />

              <InputGeneral
                estado={Correo}
                cambiarEstado={cambiarCorreo}
                tipo="email"
                label="Correo"
                placeholder="Introduzca El Correo Electronico"
                name="Correo"
                leyendaError="El Formato Del Correo No Es Valido"
                expresionRegular={expresionesRegulares.Correo}
              />

              <InputGeneral
                estado={Clave}
                cambiarEstado={cambiarClave}
                tipo="password"
                label="Clave"
                placeholder="Introduzca La Contrasena"
                name="Clave"
                leyendaError="La contrasena debe contener minimo 8 caracteres"
                expresionRegular={expresionesRegulares.Clave}
              />
            </Columna>
          </Formulario>
        </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena el formulario correctamente.
          </p>
        </MensajeError>
      )}

      <div align="right">
        <Button color="success" onClick={() => abrirCerrarModalInsertar()}>
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="success" onClick={onsubmitpost} type="submit">
          {" "}
          Insertar
        </Button>
        {formularioValido === true && (
          <MensajeExito>Formulario enviado exitosamente!</MensajeExito>
        )}
      </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Usuario v2</h3>
      <div className="relleno-general">
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <InputGeneral
                estado={Nombre}
                cambiarEstado={cambiarNombre}
                tipo="text"
                label="Nombre"
                placeholder="Introduzca El Nombre"
                name="Nombre"
                leyendaError="El Nombre solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.Nombre}
                value={Nombre.campo}
              />

              <InputGeneral
                estado={NombreUsuario}
                cambiarEstado={cambiarNombreUsuario}
                tipo="text"
                label="Nombre De Usuario"
                placeholder="Introduzca El Nombre De Usuario"
                name="NombreUsuario"
                leyendaError="El Nombre del Usuario solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.NombreUsuario}
                value={NombreUsuario.campo}
              />

              <InputGeneral
                estado={Rol}
                cambiarEstado={cambiarRol}
                tipo="number"
                label="Rol"
                placeholder="Introduzca El Rol"
                name="Rol"
                leyendaError="El rol solo puede contener números"
                expresionRegular={expresionesRegulares.Rol}
                value={Rol.campo}
              />

              <InputGeneral
                estado={Correo}
                cambiarEstado={cambiarCorreo}
                tipo="email"
                label="Correo"
                placeholder="Introduzca El Correo Electrónico"
                name="Correo"
                leyendaError="El Formato Del Correo No Es Válido"
                expresionRegular={expresionesRegulares.Correo}
                value={Correo.campo}
              />
            </Columna>
          </Formulario>
        </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena el formulario correctamente.
          </p>
        </MensajeError>
      )}

      <div align="right">
        <Button onClick={() => abrirCerrarModalEditar()}> Cancelar </Button>
        <Button color="primary" onClick={onsubmitput}>
          Editar
        </Button>
      </div>
    </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "Seguro que desea Eliminar el Usuario?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Eliminado Correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios NO Guardados", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3>Eliminar Usuario</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <h4>Codigo: {IdUsuario.campo}</h4>
              <h4>Nombre: {Nombre.campo}</h4>
              <h4>Nombre De Usuario: {NombreUsuario.campo}</h4>
              <h4>Rol: {Rol.campo}</h4>
              <h4>Correo: {Correo.campo}</h4>
            </Columna>
          </Formulario>
        </div>
      </div>

      <div align="right">
        <Button onClick={() => abrirCerrarModalEliminar()} color="success">
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="success" onClick={() => showQuestionDel()}>
          Eliminar
        </Button>
      </div>
    </div>
  );

  function showQuestionCambioClave() {
    console.log("entro al showquestioncambioclave");
    console.log(Clave);
    console.log(NuevaClave);
    console.log(ConfirmarNuevaClave);
    Swal.fire({
      title: "Seguro que desea Cambiar la Clave?",
      showDenyButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Cambiada Correctamente!", "", "success");
        peticionCambioClave();
      } else if (result.isDenied) {
        Swal.fire("Cambios NO Guardados", "", "info");
      }
    });
  }

  const bodyCambioClave = (
    <div style={scrollVertical}>
      <div className="relleno-general">
        <div className="container-fluid">
          <Formulario>
            <ColumnaCenter>
              <InputGeneral
                estado={Clave}
                cambiarEstado={cambiarClave}
                tipo="password"
                label="Contraseña Actual"
                placeholder="Introduzca la contraseña actual"
                name="Clave"
                leyendaError="La contraseña actual es requerida"
                expresionRegular={expresionesRegulares.Clave}
                value={Clave.campo}
                onChange={ValidarClave}
                onBlur={ValidarClave}
              />

              <InputGeneral
                estado={NuevaClave}
                cambiarEstado={cambiarNuevaClave}
                tipo="password"
                label="Nueva Contraseña"
                placeholder="Introduzca la nueva contraseña"
                name="NuevaClave"
                leyendaError="La contraseña debe tener al menos 8 caracteres"
                expresionRegular={expresionesRegulares.Clave}
                value={NuevaClave.campo}
              />

              <InputGeneral
                estado={ConfirmarNuevaClave}
                cambiarEstado={cambiarConfirmarNuevaClave}
                tipo="password"
                label="Confirmar Nueva Contraseña"
                placeholder="Confirme la nueva contraseña"
                name="ConfirmarNuevaClave"
                leyendaError="Las contraseñas no coinciden"
                expresionRegular={expresionesRegulares.Clave}
                value={ConfirmarNuevaClave.campo}
              />
            </ColumnaCenter>
          </Formulario>
        </div>
      </div>
      <div align="right">
        <Button onClick={() => abrirCerrarModalCambioClave()} color="success">
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="primary" onClick={onSubmitCambioClave}>
          Cambiar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>200-Mantenimiento Usuarios</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Usuario
        </Button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Usuarios"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Modificar",
            onClick: (event, rowData) => seleccionarUsuario(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Usuario",
            onClick: (event, rowData) =>
              seleccionarUsuario(rowData, "Eliminar"),
          },
          {
            icon: Password,
            tooltip: "Cambiar Contrasena",
            onClick: (event, rowData) =>
              seleccionarUsuario(rowData, "CambioClave"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          columnsButton: true,
          headerStyle: { backgroundColor: "lightgrey" },
          selection: true,
          showTextRowSelected: false,
          showSelectedAllheckbox: false,
          searchFieldAligment: "left",
          showtitle: false,
        }}
        localization={{
          header: { actions: "Acciones" },
          toolbar: { searchPlaceholder: "Busqueda" },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
      <Modal open={modalCambioClave} onClose={abrirCerrarModalCambioClave}>
        {bodyCambioClave}
      </Modal>
    </div>
  );
};

export default Usuario;
