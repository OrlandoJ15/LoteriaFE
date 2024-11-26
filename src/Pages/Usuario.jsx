import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Button } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";
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
import verificarToken from "../Components/VerificaToken";
import "../Styles/variables.css";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "Codigo", field: "id" },
  { title: "Nombre", field: "nombre" },
  { title: "Nombre De Usuario", field: "nombreUsuario" },
  { title: "Rol", field: "rol", type: "numeric" },
  { title: "Correo", field: "correo" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////
// const UrlBase = "http://190.113.84.163:8000/Usuario/RecUsuario";
// const UrlPost = "http://190.113.84.163:8000/Usuario/InsUsuario";
// const UrlPut = "http://190.113.84.163:8000/Usuario/ModUsuario";
// const UrlDel = "http://190.113.84.163:8000/Usuario/DelUsuario";
// const EndPointUsuarioXId = "http://190.113.84.163:8000/Usuario/RecUsuarioXId";
// const EndPointValidarUsuarioLogin ="http://190.113.84.163:8000/Usuario/ValidarUsuarioLogin";
// const EndPointCambiarClave = "http://190.113.84.163:8000/Usuario/ModClaveUsuario";

///////////////////////////////////////////////////////////////////////

// const UrlBase = "https://localhost:44366/Usuario/RecUsuario";
// const UrlPost = "https://localhost:44366/Usuario/InsUsuario";
// const UrlPut = "https://localhost:44366/Usuario/ModUsuario";
// const UrlDel = "https://localhost:44366/Usuario/DelUsuario";
// const EndPointUsuarioXId = "https://localhost:44366/Usuario/RecUsuarioXId";
// const EndPointValidarUsuarioLogin ="https://localhost:44366/Usuario/ValidarUsuarioLogin";
// const EndPointCambiarClave = "https://localhost:44366/Usuario/ModClaveUsuario";

///////////////////////Usl Azure/////////////

const UrlBase =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/RecUsuario";
const UrlPost =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/InsUsuario";
const UrlPut =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/ModUsuario";
const UrlDel =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/DelUsuario";
const EndPointUsuarioXId =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/RecUsuarioXId";
const EndPointValidarUsuarioLogin =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/ValidarUsuarioLogin";
const EndPointCambiarClave =
  "https://multiplicados-fnf2edgqbuffbpgj.ukwest-01.azurewebsites.net/Usuario/ModClaveUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Usuario = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  const initialState = { campo: "", valido: null };

  const [Id, cambiarId] = useState(initialState);
  const [Nombre, cambiarNombre] = useState(initialState);
  const [NombreUsuario, cambiarNombreUsuario] = useState(initialState);
  const [Rol, cambiarRol] = useState({ campo: 0, valido: null });
  const [Correo, cambiarCorreo] = useState(initialState);
  const [Clave, cambiarClave] = useState(initialState);
  const [NuevaClave, cambiarNuevaClave] = useState(initialState);
  const [ConfirmarNuevaClave, cambiarConfirmarNuevaClave] =
    useState(initialState);
  const [formularioValido, cambiarFormularioValido] = useState(false);
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalCambioClave, setModalCambioClave] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  /////////////////////////////////////INICIA EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    Id: /^[0-9]*$/,
    Nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    NombreUsuario: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    Rol: /^[1-9]$/, // solo numero del 1-9
    Correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
    Clave: /^(?=(?:.*[A-Za-z]){4,})(?=.*[A-Z])(?=(?:.*\d){4,})[A-Za-z\d]{8,}$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
  };

  /////////////////////////////////////TERMINA EXPRESIONES//////////////////////////////////

  const resetForm = () => {
    cambiarId(initialState);
    cambiarNombre(initialState);
    cambiarNombreUsuario(initialState);
    cambiarRol({ campo: 0, valido: null });
    cambiarCorreo(initialState);
    cambiarClave(initialState);
  };

  const validarFormulario = (fields) => {
    return fields.every((field) => field.valido === "true");
  };

  const handleSubmit = (e, action, fields) => {
    e.preventDefault();
    if (validarFormulario(fields)) {
      cambiarFormularioValido(true);
      resetForm();
      action();
    } else {
      cambiarFormularioValido(false);
    }
  };

  const onSubmitPost = (e) =>
    handleSubmit(e, showQuestionPost, [
      Id,
      Nombre,
      NombreUsuario,
      Rol,
      Correo,
      Clave,
    ]);

  const onSubmitPut = (e) =>
    handleSubmit(e, showQuestionPut, [Id, Nombre, NombreUsuario, Rol, Correo]);

  const onSubmitCambioClave = (e) =>
    handleSubmit(e, showQuestionCambioClave, [
      Clave,
      NuevaClave,
      ConfirmarNuevaClave,
    ]);

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  const validarUsuario = async (
    url,
    options,
    fieldSetter,
    errorMessage,
    tipoValidacion
  ) => {
    try {
      const response = await axios.post(url, options);

      if (tipoValidacion === "id") {
        // Validación para existencia de usuario por ID
        if (response.data === null) {
          // Si el usuario no existe (es un nuevo ID), dejamos el campo como está.
          return;
        } else {
          // Si existe otro usuario con ese ID, seteamos el campo a vacío y no válido
          fieldSetter({ campo: "", valido: "false" });
          Swal.fire({ icon: "error", title: "Cuidado", text: errorMessage });
        }
      } else if (tipoValidacion === "clave") {
        // Validación para la clave
        if (response.data === null) {
          // Si la clave es incorrecta, mostramos el error y seteamos a vacío
          fieldSetter({ campo: "", valido: "null" });
          Swal.fire({ icon: "error", title: "Cuidado", text: errorMessage });
        } else {
          return;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validarExistenciaUsuarioId = () => {
    const options = {
      id: Id.campo,
      nombre: "",
      nombreUsuario: "",
      rol: 0,
      correo: "",
      clave: "",
    };
    // Pasamos el tipo de validación como 'usuarioId'
    validarUsuario(
      EndPointUsuarioXId,
      options,
      cambiarId,
      "Código Usuario Existente, Intente Nuevamente",
      "id"
    );
  };

  const validarClave = () => {
    const options = {
      id: Id.campo,
      nombre: "",
      nombreUsuario: "",
      rol: 0,
      correo: "",
      clave: Clave.campo,
    };
    // Pasamos el tipo de validación como 'clave'
    validarUsuario(
      EndPointValidarUsuarioLogin,
      options,
      cambiarClave,
      "Contraseña incorrecta, Intente Nuevamente",
      "clave"
    );
  };

  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  const showQuestionPost = () =>
    showQuestion("Desea Guardar Los Cambios?", peticionPost);
  const showQuestionPut = () =>
    showQuestion("Desea Editar Los Cambios?", peticionPut);
  const showQuestionDel = () =>
    showQuestion("Desea Eliminar Los Cambios?", peticionDelete);
  const showQuestionCambioClave = () =>
    showQuestion("Desea Cambiar la Contraseña?", peticionCambioClave);

  ////////////////////////////PETICION POST//////////////////////////////////////////////////

  const showQuestion = (title, accion) => {
    Swal.fire({
      title,
      showDenyButton: true,
      confirmButtonText: "Confirmar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Operacion Exitosa", "", "success");
        accion();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
      }
    });
  };

  const peticionPost = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

    const options = {
      Id: Id.campo,
      Nombre: Nombre.campo,
      NombreUSuario: NombreUsuario.campo,
      Rol: Rol.campo,
      Correo: Correo.campo,
      Clave: Clave.campo,
    };

    try {
      const response = await axios.post(UrlPost, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData([...data, response.data]);
      abrirCerrarModalInsertar();
    } catch (error) {
      console.error("Error en la peticion Post: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION POST/////////////////////////////////////////

  ////////////////////////////PETICION PUT///////////////////////////////////////////////////

  const peticionPut = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

    console.log("este es el token ", token);

    const options = {
      id: Id.campo,
      nombre: Nombre.campo,
      nombreUsuario: NombreUsuario.campo,
      rol: Rol.campo,
      correo: Correo.campo,
    };

    try {
      const response = await axios.put(UrlPut, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedData = data.map((user) =>
        user.id === options.id ? options : user
      );
      setData(updatedData);
      abrirCerrarModalEditar();
    } catch (error) {
      console.error("Error En La Peticion Put: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////

  const peticionDelete = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

    const id = Id.campo; // Asegúrate de que esto esté obteniendo el ID correcto
    const payload = {
      headers: {
        "Content-Type": "application/json", // Establecer tipo de contenido
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(id), // Convertimos a JSON, Aquí pasas el ID del usuario en el cuerpo de la solicitud
    };
    try {
      await axios.delete(UrlDel, payload);
      setData(data.filter((user) => user.Id !== Id.campo));
      abrirCerrarModalEliminar();
      peticionGet();
    } catch (error) {
      console.error("Error Al Eliminar Usuario: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarUsuario = async (usuario, caso) => {
    const XUsuario = Object.values(...usuario);

    cambiarId({ campo: XUsuario[0], valido: "true" });
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

  axios.defaults.withCredentials = true;

  const peticionGet = async () => {
    try {
      const response = await axios.get(UrlBase, {
        headers:{
          Authorization: `Bearer $token`,
        }
      });
      setData(response.data);
      console.log("Datos Recibidos: ", response.data);
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        // El servidor respondió con un código de estado diferente al 2xx
        console.error(
          "Error de respuesta del servidor:",
          error.response.status,
          error.response.data
        );

        // Si el error es 401 (no autorizado), redirige al usuario al login
        if (error.response.status === 401) {
          console.warn("No autorizado. Redirigiendo al login...");
          //window.location.href = '/'; // Ajusta el path según tu ruta de login
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error("Error en la solicitud:", error.request);
      } else {
        // Ocurrió un error al configurar la solicitud
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

  //////////////////////////FINALIZA PETICION SELECT////////////////////////

  ////////////////////////// PETICION CAMBIO CLAVE////////////////////////

  const peticionCambioClave = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

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
    const options = {
      Id: Id.campo,
      Clave: ConfirmarNuevaClave.campo,
      Rol: 0,
      Nombre: "",
      NombreUsuario: "",
      Correo: "",
    };

    try {
      const response = await axios.put(EndPointCambiarClave, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        showExito();
        abrirCerrarModalCambioClave();
      } else {
        showError();
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      showError();
    }
  };

  //////////////////////////FINALIZA PETICION CAMBIO CLAVE////////////////////////

  //////////////////////////MODALES//////////////////////////////////////////////

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

  const MensajeFormulario = ({
    titulo,
    formularioValido,
    onCancel,
    onSubmit,
  }) => {
    return (
      <>
        {formularioValido === false && (
          <MensajeError>
            <p>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <b>Error:</b> Por favor rellena el formulario correctamente.
            </p>
          </MensajeError>
        )}
        {formularioValido === true && (
          <MensajeExito>Campos llenos exitosamente!</MensajeExito>
        )}

        <div align="right">
          <Button color="success" onClick={onCancel}>
            Cancelar
          </Button>
          <Button color="primary" onClick={onSubmit} type="submit">
            {titulo}
          </Button>
        </div>
      </>
    );
  };

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
                estado={Id}
                cambiarEstado={cambiarId}
                tipo="text"
                label="Id Usuario"
                placeholder="Introduzca Id Del Usuario"
                name="Id"
                leyendaError="El Id Del Usuario solo puede contener numeros."
                expresionRegular={expresionesRegulares.Id}
                onChange={validarExistenciaUsuarioId}
                onBlur={validarExistenciaUsuarioId}
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
      <MensajeFormulario
        titulo="Insertar"
        formularioValido={formularioValido}
        onCancel={abrirCerrarModalInsertar}
        onSubmit={onSubmitPost} // Reemplaza con la función adecuada
      />
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Usuario</h3>
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
      <MensajeFormulario
        titulo="Editar"
        formularioValido={formularioValido}
        onCancel={abrirCerrarModalEditar}
        onSubmit={onSubmitPut} // Reemplaza con la función adecuada
      />
    </div>
  );

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3>Eliminar Usuario</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <h4>Codigo: {Id.campo}</h4>
              <h4>Nombre: {Nombre.campo}</h4>
              <h4>Nombre De Usuario: {NombreUsuario.campo}</h4>
              <h4>Rol: {Rol.campo}</h4>
              <h4>Correo: {Correo.campo}</h4>
            </Columna>
          </Formulario>
        </div>
      </div>
      <MensajeFormulario
        titulo="Eliminar"
        onCancel={abrirCerrarModalEliminar}
        onSubmit={showQuestionDel} // Reemplaza con la función adecuada
      />
    </div>
  );

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
                onChange={validarClave}
                onBlur={validarClave}
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
      <MensajeFormulario
        titulo="Cambiar Clave"
        formularioValido={formularioValido}
        onCancel={abrirCerrarModalCambioClave}
        onSubmit={onSubmitCambioClave} // Reemplaza con la función adecuada
      />
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
        <>{bodyInsertar}</>
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        <>{bodyEditar}</>
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        <>{bodyEliminar}</>
      </Modal>
      <Modal open={modalCambioClave} onClose={abrirCerrarModalCambioClave}>
        <>{bodyCambioClave}</>
      </Modal>
    </div>
  );
};

export default Usuario;
