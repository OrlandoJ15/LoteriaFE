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

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "Codigo", field: "idSorteo" },
  { title: "Nombre", field: "nombre" },
  { title: "Numero", field: "numero" },
  { title: "Monto", field: "monto" },
  { title: "Usuario", field: "idUsuario" },
  { title: "Tipo De Sorteo", field: "idTipoSorteo" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const UrlBase = "http://190.113.84.163:8000/Sorteo/RecSorteo";
const UrlPost = "http://190.113.84.163:8000/Sorteo/InsSorteo";
const UrlPut = "http://190.113.84.163:8000/Sorteo/ModSorteo";
const UrlDel = "http://190.113.84.163:8000/Sorteo/DelSorteo";
const EndPointSorteoXId = "http://190.113.84.163:8000/Sorteo/RecSorteoXId";
const UrlPostKardex = "http://190.113.84.163:8000/Kardex/InsKardex";

//////////////////////////TERMINA URLs///////////////////////////

const Sorteo = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  const initialState = { campo: "", valido: null };

  const [IdSorteo, cambiarIdSorteo] = useState(initialState);
  const [Nombre, cambiarNombre] = useState(initialState);
  const [Numero, cambiarNumero] = useState(initialState);
  const [Monto, cambiarMonto] = useState(initialState);
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
    IdSorteo: /^[0-9]*$/, //Numeros del 0-9
    Nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    Numero: /^[0-9]*$/, // Formato dd:mm:yyyy hh:mm:ss
    Monto: /^[0-9]*$/, //Numeros del 0-9
    IdUsuario: /^[0-9]*$/, //Numeros del 0-9
    IdTipoSorteo: /^[0-9]*$/, //Numeros del 0-9
  };

  /////////////////////////////////////TERMINA EXPRESIONES//////////////////////////////////

  const resetForm = () => {
    cambiarIdSorteo(initialState);
    cambiarNombre(initialState);
    cambiarNumero(initialState);
    cambiarMonto(initialState);
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
      IdSorteo,
      Nombre,
      Numero,
      Monto,
      IdUsuario,
      IdTipoSorteo,
    ]);

  const onSubmitPut = (e) => handleSubmit(e, showQuestionPut, [
      IdSorteo,
      Nombre,
      Numero,
      Monto,
      IdUsuario,
      IdTipoSorteo,
    ]);

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  const validarExistenciaSorteoId = async () => {
    const options = {
      idSorteo: IdSorteo.campo,
      nombre: "",
      numero: 0,
      monto: 0,
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
        cambiarIdSorteo({ campo: "", valido: "false" });
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
      IdUsuario: IdUsuario.campo,
    };
    try{
      const response = await axios.post(UrlPostKardex, options);
    } catch (error) {
      console.error("Error en la peticion Post del Kardex: ", error);
    }
  };

  const peticionPost = async () => {
    const options = {
      IdSorteo: IdSorteo.campo,
      Nombre: Nombre.campo,
      Numero: Numero.campo,
      Monto: Monto.campo,
      IdUsuario: IdUsuario.campo,
      IdTipoSorteo: IdTipoSorteo.campo,
    };

    try {
      const response = await axios.post(UrlPost, options);
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
    const options = {
      idSorteo: IdSorteo.campo,
      nombre: Nombre.campo,
      numero: Numero.campo,
      monto: Monto.campo,
      idUsuario: IdUsuario.campo,
      idTipoSorteo: IdTipoSorteo.campo,
    };

    try {
      const response = await axios.put(UrlPut, options);
      const updatedData = data.map((user) =>
        user.idSorteo === options.idSorteo ? options : user
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
    const idSorteo = IdSorteo.campo; // Asegúrate de que esto esté obteniendo el ID correcto
    const payload = {
      headers: {
        "Content-Type": "application/json", // Establecer tipo de contenido
        Authorization: "",
      },
      data: JSON.stringify(idSorteo), // Convertimos a JSON, Aquí pasas el ID del Sorteo en el cuerpo de la solicitud
    };
    try {
      await axios.delete(UrlDel, payload);
      setData(data.filter((user) => user.idSorteo !== idSorteo.campo));
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

    cambiarIdSorteo({ campo: XSorteo[0], valido: "true" });
    cambiarNombre({ campo: XSorteo[1], valido: "true" });
    cambiarNumero({ campo: XSorteo[2], valido: "true" });
    cambiarMonto({ campo: XSorteo[3], valido: "true" });
    cambiarIdUsuario({ campo: XSorteo[4], valido: "true" });
    cambiarIdTipoSorteo({ campo: XSorteo[5], valido: "true" });
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const peticionGet = async () => {
    try {
      const response = await axios.get(UrlBase);
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
      <h3>Insertar Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <InputGeneral
                estado={IdSorteo}
                cambiarEstado={cambiarIdSorteo}
                tipo="text"
                label="Id Del Sorteo"
                placeholder="Introduzca El Id Del Sorteo"
                name="IdSorteo"
                leyendaError="El Id Del Sorteo Solo Puede Contener Numeros."
                expresionRegular={expresionesRegulares.IdSorteo}
                onChange={validarExistenciaSorteoId}
                onBlur={validarExistenciaSorteoId}
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
                estado={Numero}
                cambiarEstado={cambiarNumero}
                tipo="text"
                label="Numero"
                placeholder="Introduzca El Numero"
                name="Numero"
                leyendaError="El Numero Debe Incluir Solo Dos Cifras De Numeros ."
                expresionRegular={expresionesRegulares.Numero}
              />

              <InputGeneral
                estado={Monto}
                cambiarEstado={cambiarMonto}
                tipo="text"
                label="Monto"
                placeholder="Introduzca El Monto"
                name="Monto"
                leyendaError="El Monto Deben Ser Solo Numeros"
                expresionRegular={expresionesRegulares.Monto}
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
      <h3>Editar Sorteo</h3>
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
              />

              <InputGeneral
                estado={Numero}
                cambiarEstado={cambiarNumero}
                tipo="text"
                label="Numero"
                placeholder="Introduzca El Numero"
                name="Numero"
                leyendaError="El Numero Debe Incluuir Solo Dos Cifras De Numeros ."
                expresionRegular={expresionesRegulares.Numero}
              />

              <InputGeneral
                estado={Monto}
                cambiarEstado={cambiarMonto}
                tipo="text"
                label="Monto"
                placeholder="Introduzca El Monto"
                name="Monto"
                leyendaError="El Monto Deben Ser Solo Numeros"
                expresionRegular={expresionesRegulares.Monto}
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
      <h3>Eliminar Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <h4>Codigo: {IdSorteo.campo}</h4>
              <h4>Nombre: {Nombre.campo}</h4>
              <h4>Numero: {Numero.campo}</h4>
              <h4>Monto: {Monto.campo}</h4>
              <h4>Usuario: {IdUsuario.campo}</h4>
              <h4>Tipo De Sorteo: {IdTipoSorteo.campo}</h4>
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

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>200-Mantenimiento De Sorteos</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Sorteo
        </Button>
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
    </div>
  );
};

export default Sorteo;
