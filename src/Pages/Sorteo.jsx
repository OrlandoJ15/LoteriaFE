import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Button } from "@mui/material";
import { AddBox, Checklist, DeleteOutline, Details, Edit, Password } from "@mui/icons-material";
import Swal from "sweetalert2";
import InputGeneral from "../Components/InputGeneral";
import {
  ColumnaCenter,
  Columna,
  Formulario,
  MensajeExito,
  MensajeError,
  Formulario1,
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
  { title: "Id Usuario", field: "idUsuario" },
  { title: "Usuario", field: "nombreUsuario" },
  { title: "Id Tipo De Sorteo", field: "idTipoSorteo" },
  { title: "Tipo De Sorteo", field: "nombreTipoSorteoGeneral" },
  { title: "Fecha", field: "fechaTipoSorteo" },
  
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////
// const UrlBase = "http://190.113.84.163:8000/Sorteo/RecSorteo";
// const UrlPost = "http://190.113.84.163:8000/Sorteo/InsSorteo";
// const UrlPut = "http://190.113.84.163:8000/Sorteo/ModSorteo";
// const UrlDel = "http://190.113.84.163:8000/Sorteo/DelSorteo";
// const EndPointSorteoXId = "http://190.113.84.163:8000/Sorteo/RecSorteoXId";
// const UrlPostKardex = "http://190.113.84.163:8000/Kardex/InsKardex";

// const UrlBase = "https://localhost:44366/Sorteo/RecSorteo";
// const UrlPost = "https://localhost:44366/Sorteo/InsSorteo";
// const UrlPut = "https://localhost:44366/Sorteo/ModSorteo";
// const UrlDel = "https://localhost:44366/Sorteo/DelSorteo";
// const EndPointSorteoXId = "https://localhost:44366/Sorteo/RecSorteoXId";
// const UrlPostKardex = "https://localhost:44366/Kardex/InsKardex";

////////////////////////Azure Url///////////////////

const UrlBase = "https://loteriawebapimvp.azurewebsites.net/Sorteo/RecSorteo";
const UrlPost = "https://loteriawebapimvp.azurewebsites.net/Sorteo/InsSorteo";
const UrlPut = "https://loteriawebapimvp.azurewebsites.net/Sorteo/ModSorteo";
const UrlDel = "https://loteriawebapimvp.azurewebsites.net/Sorteo/DelSorteo";
const EndPointSorteoXId = "https://loteriawebapimvp.azurewebsites.net/Sorteo/RecSorteoXId";
const UrlPostKardex = "https://loteriawebapimvp.azurewebsites.net/Kardex/InsKardex"

//////////////////////////TERMINA URLs///////////////////////////

const Sorteo = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  const initialState = { campo: "", valido: null };

  const [Id, cambiarId] = useState(initialState);
  const [IdUsuario, cambiarIdUsuario] = useState(initialState);
  const [IdTipoSorteo, cambiarIdTipoSorteo] = useState(initialState);
  const [formularioValido, cambiarFormularioValido] = useState(false);
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  /////////////////////////////////////INICIA EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    Id: /^[0-9]*$/, //Numeros del 0-9
    IdUsuario: /^[0-9]*$/, //Numeros del 0-9
    IdTipoSorteo: /^[0-9]*$/, //Numeros del 0-9
  };

  /////////////////////////////////////TERMINA EXPRESIONES//////////////////////////////////

  const resetForm = () => {
    cambiarId(initialState);
    cambiarIdUsuario(initialState);
    cambiarIdTipoSorteo(initialState);
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

  const onSubmitPost = (e) => handleSubmit(e, showQuestionPost, [
      Id,
      IdUsuario,
      IdTipoSorteo,
    ]);

  const onSubmitPut = (e) => handleSubmit(e, showQuestionPut, [
      Id,
      IdUsuario,
      IdTipoSorteo,
    ]);

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  const validarExistenciaSorteoId = async () => {
    const options = {
      id: Id.campo,
      idUsuario: 0,
      idTipoSorteo: 0,
    };
    try {
      const response = await axios.post(EndPointSorteoXId, options);

      // Validación para existencia de Tipo de Sorteo por ID
      if (response.data === null) {
        // Si el Tipo de Sorteo no existe (es un nuevo ID), dejamos el campo como está.
        return;
      } else {
        // Si existe otro usuario con ese ID, seteamos el campo a vacío y no válido
        cambiarId({ campo: "", valido: "false" });
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Código De Sorteo Existente, Intente Nuevamente",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  const showQuestionPost = () =>
    showQuestion("Desea Guardar Los Cambios?", peticionPost);
  const showQuestionPut = () =>
    showQuestion("Desea Editar Los Cambios?", peticionPut);
  const showQuestionDel = () =>
    showQuestion("Desea Eliminar Los Cambios?", peticionDelete);

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

  const peticionPostKardex = async (serie) => {
    const options = {
      Serie: serie,
      Numero: Numero.campo,
      Nombre: Nombre.campo,
      Monto: Monto.campo,
      Id: Id.campo,
    };
    try{
      const response = await axios.post(UrlPostKardex, options);
    } catch (error) {
      console.error("Error en la peticion Post del Kardex: ", error);
    }
  };

  const peticionPost = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

    const options = {
      Id: Id.campo,
      IdUsuario: IdUsuario.campo,
      IdTipoSorteo: IdTipoSorteo.campo,
    };

    try {
      const response = await axios.post(UrlPost, options,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setData([...data, response.data]);
      peticionPostKardex("Ins");
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

    const options = {
      id: Id.campo,
      idUsuario: IdUsuario.campo,
      idTipoSorteo: IdTipoSorteo.campo,
    };

    try {
      const response = await axios.put(UrlPut, options,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const updatedData = data.map((user) =>
        user.id === options.id ? options : user
      );
      setData(updatedData);
      peticionPostKardex("Mod");
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
      data: JSON.stringify(id), // Convertimos a JSON, Aquí pasas el ID del Sorteo en el cuerpo de la solicitud
    };
    try {
      await axios.delete(UrlDel, payload);
      setData(data.filter((user) => user.id !== id.campo));
      peticionPostKardex("Del");
      abrirCerrarModalEliminar();
      peticionGet();
    } catch (error) {
      console.error("Error Al Eliminar El Sorteo: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarSorteo = async (Sorteo, caso) => {
    const XSorteo = Object.values(...Sorteo);

    cambiarId({ campo: XSorteo[0], valido: "true" });
    cambiarIdUsuario({ campo: XSorteo[1], valido: "true" });
    cambiarIdTipoSorteo({ campo: XSorteo[2], valido: "true" });
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const peticionGet = async () => {
    const token = verificarToken(); // Verificar token antes de llamar a la API
    if (!token) return;

    try {
      const response = await axios.get(UrlBase,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setData(response.data);
    } catch (eror) {
      console.error("Error Al Obtener Los Sorteos", error);
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

  //////////////////////////FINALIZA PETICION SELECT////////////////////////

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

  //////////////////////////MODALES////////////////////////

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
      <div className="container-footer">
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
            <Button className="btn-cancelar" onClick={onCancel}>
              Cancelar
            </Button>
            <Button class="btn-agregar" onClick={onSubmit} type="submit">
              {titulo}
            </Button>
          </div>
        </div>
      </>
    );
  };

  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 301 - Agregar Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={Id}
                cambiarEstado={cambiarId}
                tipo="text"
                label="Id Del Sorteo"
                placeholder="Introduzca El Id Del Sorteo"
                name="Id"
                leyendaError="El Id Del Sorteo Solo Puede Contener Numeros."
                expresionRegular={expresionesRegulares.Id}
                onChange={validarExistenciaSorteoId}
                onBlur={validarExistenciaSorteoId}
                autofocus
              />

              <InputGeneral
                estado={IdUsuario}
                cambiarEstado={cambiarIdUsuario}
                tipo="text"
                label="Id Del Usuario"
                placeholder="Introduzca El Id Del Usuario"
                name="IdUsuario"
                leyendaError="El Id Debe Ser Numeros entro 0-9"
                expresionRegular={expresionesRegulares.IdUsuario}
              />

              <InputGeneral
                estado={IdTipoSorteo}
                cambiarEstado={cambiarIdTipoSorteo}
                tipo="text"
                label="Id Del Tipo De Sorteo"
                placeholder="Introduzca El Id Del Tipo De Sorteo"
                name="IdTipoSorteo"
                leyendaError="El Id Debe Ser Numeros entro 0-9"
                expresionRegular={expresionesRegulares.IdTipoSorteo}
              />
            </Columna>
          </Formulario1>
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
      <h3 className="container-header"> 302 - Modificar Sorteo</h3>
      <div className="relleno-general">
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={IdUsuario}
                cambiarEstado={cambiarIdUsuario}
                tipo="text"
                label="Id Del Usuario"
                placeholder="Introduzca El Id Del Usuario"
                name="IdUsuario"
                leyendaError="El Id Debe Ser Numeros entro 0-9"
                expresionRegular={expresionesRegulares.IdUsuario}
              />

              <InputGeneral
                estado={IdTipoSorteo}
                cambiarEstado={cambiarIdTipoSorteo}
                tipo="text"
                label="Id Del Tipo De Sorteo"
                placeholder="Introduzca El Id Del Tipo De Sorteo"
                name="IdTipoSorteo"
                leyendaError="El Id Debe Ser Numeros entro 0-9"
                expresionRegular={expresionesRegulares.IdTipoSorteo}
              />
            </Columna>
          </Formulario1>
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
      <h3 className="container-header"> 303 - Eliminar Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <h4>Codigo: {Id.campo}</h4>
              <h4>Usuario: {IdUsuario.campo}</h4>
              <h4>Tipo De Sorteo: {IdTipoSorteo.campo}</h4>
            </Columna>
          </Formulario1>
        </div>
      </div>
      <MensajeFormulario
        titulo="Eliminar"
        onCancel={abrirCerrarModalEliminar}
        onSubmit={showQuestionDel} // Reemplaza con la función adecuada
      />
    </div>
  );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          300-Mantenimiento De Sorteos
        </h3>
      </div>
      <div>
        <button className="btn-añadir"
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Sorteo
        </button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Sorteos"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarSorteo(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) => seleccionarSorteo(rowData, "Eliminar"),
          },
          {
            icon: Checklist,
            tooltip: "Detalles",
            onClick: (event, rowData) => seleccionarSorteo(rowData, "Detalles"),
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

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar} style={modalStyles}>
        <>{bodyInsertar}</>
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar} style={modalStyles}>
        <>{bodyEditar}</>
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar} style={modalStylesDelete}>
        <>{bodyEliminar}</>
      </Modal>
    </div>
  );
};

export default Sorteo;
