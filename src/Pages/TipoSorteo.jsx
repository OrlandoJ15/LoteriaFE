import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Button } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";
import Swal from "sweetalert2";
import InputGeneral from "../Components/InputGeneral";
import {ColumnaCenter, Columna, Formulario, MensajeExito, MensajeError} from "../Components/Formularios";
import "../Styles/Cliente.modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "Codigo", field: "idTipoSorteo" },
  { title: "Nombre", field: "nombre" },
  { title: "Inicio", field: "fechaInicio" },
  { title: "Fin", field: "fechaFin" },
  { title: "NumeroGanador", field: "numeroGanador" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const UrlBase = "http://190.113.84.163:8000/TipoSorteo/RecTipoSorteo";
const UrlPost = "http://190.113.84.163:8000/TipoSorteo/InsTipoSorteo";
const UrlPut = "http://190.113.84.163:8000/TipoSorteo/ModTipoSorteo";
const UrlDel = "http://190.113.84.163:8000/TipoSorteo/DelTipoSorteo";
const EndPointTipoSorteoXId = "http://190.113.84.163:8000/TipoSorteo/RecTipoSorteoXId";

//////////////////////////TERMINA URLs///////////////////////////

const TipoSorteo = () => {
    
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  const initialState = {campo: "", valido: null};

  const [IdTipoSorteo, cambiarIdTipoSorteo] = useState(initialState);
  const [Nombre, cambiarNombre] = useState(initialState);
  const [FechaInicio, cambiarFechaInicio] = useState(initialState);
  const [FechaFin, cambiarFechaFin] = useState(initialState);
  const [NumeroGanador, cambiarNumeroGanador] = useState(initialState);
  const [formularioValido, cambiarFormularioValido] = useState(false);
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  /////////////////////////////////////INICIA EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    IdTipoSorteo: /^[0-9]*$/,
    Nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    //FechaInicio: /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})(\s)([0-1][0-9]|2[0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/, // Formato dd:mm:yyyy hh:mm:ss
    FechaInicio: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, // Formato dd:mm:yyyy hh:mm:ss
    FechaFin: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, // Formato dd:mm:yyyy hh:mm:ss
    NumeroGanador: /^[0-9]*$/,
  };


  /////////////////////////////////////TERMINA EXPRESIONES//////////////////////////////////

  const resetForm = () => {
    cambiarIdTipoSorteo(initialState);
    cambiarNombre(initialState);
    cambiarFechaInicio(initialState);
    cambiarFechaFin(initialState);
    cambiarNumeroGanador(initialState);
  };

  const validarFormulario = (fields) => {
    return fields.every(field => field.valido === "true");
  };

  const handleSubmit = (e, action, fields) => {
    console.log(fields);
    e.preventDefault();
    if (validarFormulario(fields)) {
      cambiarFormularioValido(true);
      resetForm();
      action();
    } else {
      console.log("entro al else handlesubmit");

      cambiarFormularioValido(false);
    }
  };

  const onSubmitPost = (e) => handleSubmit(e, showQuestionPost, [IdTipoSorteo, Nombre, FechaInicio, FechaFin, NumeroGanador]);

  const onSubmitPut = (e) => handleSubmit(e, showQuestionPut, [IdTipoSorteo, Nombre, FechaInicio, FechaFin, NumeroGanador]);

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
  const validarExistenciaTipoSorteoId = async () => {
    const options = {
          idTipoSorteo: IdTipoSorteo.campo,
          nombre: "",
          fechaInicio: new Date(null),
          fechaFin: new Date(null),
          numeroGanador: 0,
        };  
    try {
      const response = await axios.post(EndPointTipoSorteoXId, options);

      // Validación para existencia de Tipo de Sorteo por ID
      if (response.data === null) {
        // Si el Tipo de Sorteo no existe (es un nuevo ID), dejamos el campo como está.
        return;
      } else {
        // Si existe otro usuario con ese ID, seteamos el campo a vacío y no válido
        cambiarIdTipoSorteo({ campo: "", valido: "false" });
        Swal.fire({ icon: "error", title: "Cuidado", text: "Código Tipo de Sorteo Existente, Intente Nuevamente" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  const showQuestionPost = () => showQuestion("Desea Guardar Los Cambios?", peticionPost);
  const showQuestionPut = () => showQuestion("Desea Editar Los Cambios?", peticionPut);
  const showQuestionDel = () => showQuestion("Desea Eliminar Los Cambios?", peticionDelete);

  ////////////////////////////PETICION POST//////////////////////////////////////////////////

  const showQuestion = (title, accion) => {
    Swal.fire({
      title,
      showDenyButton: true,
      confirmButtonText: "Confirmar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed){
        Swal.fire("Operacion Exitosa", "", "success");
        accion();
      }else if (result.isDenied){
        Swal.fire("Cambios No Guardados", "","info");
      }
    });
  };

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

  const peticionPost = async () => {
    const options = {
      IdTipoSorteo: IdTipoSorteo.campo,
      Nombre: Nombre.campo,
      FechaInicio: FechaInicio.campo,
      FechaFin: FechaFin.campo,
      NumeroGanador: NumeroGanador.campo,
    };

    try {
      const response = await axios.post(UrlPost, options);
      setData([...data, response.data]);
      abrirCerrarModalInsertar();
    }catch (error){
      console.error("Error en la peticion Post: ",error);
    }
  };

  ////////////////////////////FINALIZA PETICION POST/////////////////////////////////////////

  ////////////////////////////PETICION PUT///////////////////////////////////////////////////

  const peticionPut = async () => {
    const options = {
      idTipoSorteo: IdTipoSorteo.campo,
      nombre: Nombre.campo,
      fechaInicio: FechaInicio.campo,
      fechaFin: FechaFin.campo,
      numeroGanador: NumeroGanador.campo,
    };

    try{
      const response = await axios.put(UrlPut, options);
      const updatedData = data.map(user => (user.idTipoSorteo === options.idTipoSorteo ? options : user));
      setData(updatedData);
      abrirCerrarModalEditar();
    } catch (error){
      console.error("Error En La Peticion Post: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////

  const peticionDelete = async () => {
    const idTipoSorteo = IdTipoSorteo.campo; // Asegúrate de que esto esté obteniendo el ID correcto
    const payload = {
        headers: {
          "Content-Type": "application/json", // Establecer tipo de contenido
          Authorization: "",
        },
        data: JSON.stringify(idTipoSorteo), // Convertimos a JSON, Aquí pasas el ID del TipoSorteo en el cuerpo de la solicitud
      };
    try{
      await axios.delete(UrlDel, payload)
      setData(data.filter(user => user.IdTipoSorteo !== IdTipoSorteo.campo));
      abrirCerrarModalEliminar();
      peticionGet();
    } catch (error) {
      console.error("Error Al Eliminar el Tipo de Sorteo: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarTipoSorteo = async (TipoSorteo, caso) => {
    const XTipoSorteo = Object.values(...TipoSorteo);

    cambiarIdTipoSorteo({ campo: XTipoSorteo[0], valido: "true" });
    cambiarNombre({ campo: XTipoSorteo[1], valido: "true" });
    cambiarFechaInicio({ campo: XTipoSorteo[2], valido: "true" });
    cambiarFechaFin({ campo: XTipoSorteo[3], valido: "true" });
    cambiarNumeroGanador({ campo: XTipoSorteo[4], valido: "true" });
    caso === "Editar"
      ? abrirCerrarModalEditar()
      : abrirCerrarModalEliminar()
  };

  const peticionGet = async () => {
    try{
      const response = await axios.get(UrlBase);
      setData(response.data);
    } catch (eror){
      console.error ("Error al obtener los tipos de sorteos", error);
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

  const MensajeFormulario = ({titulo, formularioValido, onCancel, onSubmit }) => {
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
      <h3>Incluir Tipo De Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <InputGeneral
                estado={IdTipoSorteo}
                cambiarEstado={cambiarIdTipoSorteo}
                tipo="text"
                label="Id Tipo De Sorteo"
                placeholder="Introduzca Id Del Tipo de Sorteo"
                name="IdTipoSorteo"
                leyendaError="El Id Del Tipo de Sorteo solo puede contener numeros."
                expresionRegular={expresionesRegulares.IdTipoSorteo}
                onChange={validarExistenciaTipoSorteoId}
                onBlur={validarExistenciaTipoSorteoId}
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
                estado={FechaInicio}
                cambiarEstado={cambiarFechaInicio}
                tipo="date"
                label="Fecha De Inicio"
                placeholder="Introduzca La Fecha De Inicio"
                name="FechaInicio"
                leyendaError="La Fecha De Inicio Debe Tener Formato De Fecha."
                expresionRegular={expresionesRegulares.FechaInicio}
              />

              <InputGeneral
                estado={FechaFin}
                cambiarEstado={cambiarFechaFin}
                tipo="date"
                label="Fecha De Fin"
                placeholder="Introduzca la Fecha de Fin"
                name="FechaFin"
                leyendaError="La Fecha De Fin Debe Tener Formato De Fecha"
                expresionRegular={expresionesRegulares.FechaFin}
              />

              <InputGeneral
                estado={NumeroGanador}
                cambiarEstado={cambiarNumeroGanador}
                tipo="text"
                label="Numero Ganador"
                placeholder="Introduzca El Numero Ganador"
                name="NumeroGanador"
                leyendaError="El Numero Ganador Debe Ser Un Numero Entre 00-99"
                expresionRegular={expresionesRegulares.NumeroGanador}
              />
            </Columna>
          </Formulario>
        </div>
      </div>
      <MensajeFormulario
        titulo= "Insertar"
        formularioValido={formularioValido}
        onCancel={abrirCerrarModalInsertar}
        onSubmit={onSubmitPost} // Reemplaza con la función adecuada
      />
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Tipo De Sorteo</h3>
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
                estado={FechaInicio}
                cambiarEstado={cambiarFechaInicio}
                tipo="date"
                label="Fecha De Inicio"
                placeholder="Introduzca La Fecha De Inicio"
                name="FechaInicio"
                leyendaError="La Fecha De Inicio Debe Tener Formato De Fecha."
                expresionRegular={expresionesRegulares.FechaInicio}
                value={FechaInicio.campo}
              />

              <InputGeneral
                estado={FechaFin}
                cambiarEstado={cambiarFechaFin}
                tipo="date"
                label="Fecha De Fin"
                placeholder="Introduzca La Fecha De Fin"
                name="FechaFin"
                leyendaError="La Fecha De Fin Debe Tener Formato De Fecha."
                expresionRegular={expresionesRegulares.FechaFin}
                value={FechaFin.campo}
              />

              <InputGeneral
                estado={NumeroGanador}
                cambiarEstado={cambiarNumeroGanador}
                tipo="email"
                label="Numero Ganador"
                placeholder="Introduzca El Numero Ganador"
                name="NumeroGanador"
                leyendaError="El Numero Ganador Debe Ser Un Numero Entro 00-99"
                expresionRegular={expresionesRegulares.NumeroGanador}
                value={NumeroGanador.campo}
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
      <h3>Eliminar Tipo De Sorteo</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <h4>Codigo: {IdTipoSorteo.campo}</h4>
              <h4>Nombre: {Nombre.campo}</h4>
              <h4>Fecha De Inicio: {FechaInicio.campo}</h4>
              <h4>Fecha De Fin: {FechaFin.campo}</h4>
              <h4>Numero Ganador: {NumeroGanador.campo}</h4>
            </Columna>
          </Formulario>
        </div>
      </div>
      <MensajeFormulario
        titulo = "Eliminar"
        onCancel={abrirCerrarModalEliminar}
        onSubmit={showQuestionDel} // Reemplaza con la función adecuada
      />
    </div>
  );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>200-Mantenimiento Tipo De Sorteos</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Tipo De Sorteo
        </Button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Tipo De Sorteos"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarTipoSorteo(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarTipoSorteo(rowData, "Eliminar"),
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

export default TipoSorteo;
