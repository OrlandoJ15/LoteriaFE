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
import verificarToken from "../Components/VerificaToken";
import "../Styles/variables.css";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "Codigo", field: "id" },
  { title: "Sorteo", field: "nombre" },
  { title: "Fondo", field: "fondo" },
  { title: "% De Pago", field: "porcentajePago" },
  { title: "Hora Inicio", field: "inicio" },
  { title: "Hora Fin", field: "fin" },

];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////
// const UrlBase = "http://190.113.84.163:8000/TipoSorteoGeneral/RecTipoSorteoGeneral";
// const UrlPost = "http://190.113.84.163:8000/TipoSorteoGeneral/InsTipoSorteoGeneral";
// const UrlPut = "http://190.113.84.163:8000/TipoSorteoGeneral/ModTipoSorteoGeneral";
// const UrlDel = "http://190.113.84.163:8000/TipoSorteoGeneral/DelTipoSorteoGeneral";
// const EndPointTipoSorteoGeneralXId = "http://190.113.84.163:8000/TipoSorteoGeneral/RecTipoSorteoGeneralXId";

const UrlBase = "https://localhost:44366/TipoSorteoIntermedia/RecTipoSorteoIntermediaDetallado";
const UrlPost = "https://localhost:44366/TipoSorteoInteredia/InsTipoSorteoIntermedia";
const UrlPut = "https://localhost:44366/TipoSorteoGeneral/ModTipoSorteoGeneral";
const UrlDel = "https://localhost:44366/TipoSorteoGeneral/DelTipoSorteoGeneral";
const EndPointTipoSorteoGeneralXId = "https://localhost:44366/TipoSorteoGeneral/RecTipoSorteoGeneralXId";



//////////////////URL AZURE///////////////////////
// const UrlBase =
//    "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/RecTipoSorteoGeneral";
// const UrlPost =
//   "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/InsTipoSorteoGeneral";
// const UrlPut =
//   "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/ModTipoSorteoGeneral";
// const UrlDel =
//   "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/DelTipoSorteoGeneral";

//////////////////////////TERMINA URLs///////////////////////////

const TipoSorteoIntermedia = () => {
    
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  const initialState = {campo: "", valido: null};

  const [Id, cambiarId] = useState(initialState);
  const [Nombre, cambiarNombre] = useState(initialState);
  const [Fondo, cambiarFondo] = useState({campo: 0, valido: null});
  const [PorcentajePago, cambiarPorcentajePago] = useState({campo: 0, valido: null});
  const [NombreReventado, cambiarNombreReventado] = useState(initialState);
  const [PorcentajePagoReventado, cambiarPorcentajePagoReventado] = useState({campo: 0, valido: null});
  const [HoraInicio, cambiarHoraInicio] = useState(initialState);
  const [HoraFin, cambiarHoraFin] = useState(initialState);
  const [formularioValido, cambiarFormularioValido] = useState(false);
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [esReventado, cambiarEsReventado] = useState(false);



  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  /////////////////////////////////////INICIA EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    Id: /^[0-9]*$/,
    Nombre: /^[\s\S]{1,40}$/, //El nombre admite cualquier caracter unicamente valida la longitud a 30
    Fondo: /^[0-9]*$/,
    PorcentajePago: /^[0-9]*$/,
    NombreReventado: /^[\s\S]{1,40}$/, //El nombre admite cualquier caracter unicamente valida la longitud a 30
    PorcentajePagoReventado: /^[0-9]*$/,
    //HoraFin: /^[0-9]*$/,
  };


  /////////////////////////////////////TERMINA EXPRESIONES//////////////////////////////////

  const resetForm = () => {
    cambiarId(initialState);
    cambiarNombre(initialState);
    cambiarFondo(initialState);
    cambiarPorcentajePago(initialState);
    cambiarHoraFin(initialState);
  };

  const validarFormulario = (fields) => {
    return fields.every(field => field.valido === "true");
  };

  const handleSubmit = (e, action, fields) => {
    console.log(fields);
    console.log(HoraFin);
    e.preventDefault();
    if (esReventado){
      console.log("entro el if de check");
      if (validarFormulario(fields)) {
        cambiarFormularioValido(true);
        resetForm();
        action();
      } else {
        cambiarFormularioValido(false);
      }
    }else{
      console.log("entro el if de No check");
      fields=[Nombre, Fondo, PorcentajePago, HoraInicio, HoraFin];
      console.log(fields);
      if (validarFormulario(fields)) {
        cambiarFormularioValido(true);
        resetForm();
        action();
      } else {
        cambiarFormularioValido(false);
      }
    }   
  };

  const onSubmitPost = (e) => handleSubmit(e, showQuestionPost, [Nombre, Fondo, PorcentajePago, HoraInicio, HoraFin, esReventado, NombreReventado, PorcentajePagoReventado]);

  const onSubmitPut = (e) => handleSubmit(e, showQuestionPut, [Id, Nombre, Fondo, PorcentajePago, HoraFin]);

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
  const validarExistenciaTipoSorteoGeneralId = async () => {
    const options = {
          id: Id.campo,
          nombre: "",
          fondo: 0,
          porcentajePago: 0,
          horaFin: "",
        };  
    try {
      const response = await axios.post(EndPointTipoSorteoGeneralXId, options);

      // Validación para existencia de Tipo de Sorteo por ID
      if (response.data === null) {
        // Si el Tipo de Sorteo no existe (es un nuevo ID), dejamos el campo como está.
        return;
      } else {
        // Si existe otro usuario con ese ID, seteamos el campo a vacío y no válido
        cambiarId({ campo: "", valido: "false" });
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
    //const token = verificarToken(); // Verificar token antes de llamar a la API
    //if (!token) return;

    const options = {
      Nombre: Nombre.campo,
      Fondo: Fondo.campo,
      PorcentajePago: porcentaje.campo,
      HoraInicio: horaInicio.campo,
      HoraFin: horaFin.campo,
    };

    try {
      // const response = await axios.post(UrlPost, options, {
      //   headers: {
      //       Authorization: `Bearer ${token}`,
      //   }
      // });
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
    //const token = verificarToken(); // Verificar token antes de llamar a la API
    //if (!token) return;

    const options = {
        Id: Id.campo,
        Nombre: Nombre.campo,
        Fondo: Fondo.campo,
        PorcentajePago: porcentaje.campo,
        HoraFin: horaFin.campo
      };

    try{
      // const response = await axios.put(UrlPut, options,{
      //   headers: {
      //       Authorization: `Bearer ${token}`,
      //   }
      // });
      const response = await axios.put(UrlPut, options);

      const updatedData = data.map(user => (user.id === options.idTipoSorteoGeneral ? options : user));
      setData(updatedData);
      abrirCerrarModalEditar();
    } catch (error){
      console.error("Error En La Peticion Post: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////

  const peticionDelete = async () => {
    //const token = verificarToken(); // Verificar token antes de llamar a la API
    //if (!token) return;

    const id = Id.campo; // Asegúrate de que esto esté obteniendo el ID correcto
    const payload = {
        headers: {
          "Content-Type": "application/json", // Establecer tipo de contenido
          //Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(id), // Convertimos a JSON, Aquí pasas el ID del TipoSorteoGeneral en el cuerpo de la solicitud
      };
    try{
      await axios.delete(UrlDel, payload)
      setData(data.filter(user => user.Id !== Id.campo));
      abrirCerrarModalEliminar();
      peticionGet();
    } catch (error) {
      console.error("Error Al Eliminar el Tipo de Sorteo: ", error);
    }
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarTipoSorteoGeneral = async (TipoSorteoGeneral, caso) => {
    const XTipoSorteoGeneral = Object.values(...TipoSorteoGeneral);

    cambiarId({ campo: XTipoSorteoGeneral[0], valido: "true" });
    cambiarNombre({ campo: XTipoSorteoGeneral[1], valido: "true" });
    cambiarFondo({ campo: XTipoSorteoGeneral[2], valido: "true" });
    cambiarPorcentajePago({ campo: XTipoSorteoGeneral[3], valido: "true" });
    cambiarHoraFin({ campo: XTipoSorteoGeneral[4], valido: "true" });
    caso === "Editar"
      ? abrirCerrarModalEditar()
      : abrirCerrarModalEliminar()
  };

  const peticionGet = async () => {
    //const token = verificarToken(); // Verificar token antes de llamar a la API
    //if (!token) return;

    try{
      // const response = await axios.get(UrlBase,{
      //   headers: {
      //       Authorization: `Bearer ${token}`,
      //   }
      // });
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
  
  // const bodyInsertar = (
  //   <div style={scrollVertical}>
  //     <h3>Incluir Tipo De Sorteo General</h3>
  //     <div className="relleno-general">
  //       {" "}
  //       General
  //       <div className="container-fluid">
  //         <Formulario>
  //           <Columna>
  //             {/* <InputGeneral
  //               estado={Id}
  //               cambiarEstado={cambiarId}
  //               tipo="text"
  //               label="Id Tipo De Sorteo General"
  //               placeholder="Introduzca el id del tipo de sorteo"
  //               name="Id"
  //               leyendaError="El Id Del Tipo de Sorteo solo puede contener numeros."
  //               expresionRegular={expresionesRegulares.Id}
  //               onChange={validarExistenciaTipoSorteoGeneralId}
  //               onBlur={validarExistenciaTipoSorteoGeneralId}
  //               autofocus
  //             /> */}
  //             <InputGeneral
  //               estado={Nombre}
  //               cambiarEstado={cambiarNombre}
  //               tipo="text"
  //               label="Nombre"
  //               placeholder="Introduzca el nombre"
  //               name="Nombre"
  //               leyendaError="El nombre solo puede contener letras y espacios."
  //               expresionRegular={expresionesRegulares.Nombre}
  //             />

  //             <InputGeneral
  //               estado={Fondo}
  //               cambiarEstado={cambiarFondo}
  //               tipo="numeric"
  //               label="Fondo del sorteo"
  //               placeholder="Introduzca el fondo para el sorteo"
  //               name="Fondo"
  //               leyendaError="El fondo debe ser numerico"
  //               expresionRegular={expresionesRegulares.Fondo}
  //             />

  //             <InputGeneral
  //               estado={PorcentajePago}
  //               cambiarEstado={cambiarPorcentajePago}
  //               tipo="numeric"
  //               label="Porcentaje de pago"
  //               placeholder="Introduzca el porcentaje de pago"
  //               name="FechaFin"
  //               leyendaError="El porcentaje de pago debe ser numerico"
  //               expresionRegular={expresionesRegulares.PorcentajePago}
  //             />

  //             <InputGeneral
  //               estado={HoraFin}
  //               cambiarEstado={cambiarHoraFin}
  //               tipo="time"
  //               label="Hora De Fin"
  //               placeholder="Introduzca la hora de fin"
  //               name="HoraFin"
  //               leyendaError="Formato de hora incorrecta "
  //               expresionRegular={expresionesRegulares.HoraFin}
  //             />
  //           </Columna>
  //         </Formulario>
  //       </div>
  //     </div>
  //     <MensajeFormulario
  //       titulo= "Insertar"
  //       formularioValido={formularioValido}
  //       onCancel={abrirCerrarModalInsertar}
  //       onSubmit={onSubmitPost} // Reemplaza con la función adecuada
  //     />
  //   </div>
  // );




  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3>Incluir Tipo De Sorteo General</h3>
      <div className="relleno-general">
        <div className="grupo">
          <h4>General</h4>
          <div className="container-fluid">
            <Formulario>
              <Columna>
                <InputGeneral
                  estado={Nombre}
                  cambiarEstado={cambiarNombre}
                  tipo="text"
                  label="Nombre"
                  placeholder="Introduzca el nombre"
                  name="Nombre"
                  leyendaError="El nombre solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.Nombre}
                />
  
                <InputGeneral
                  estado={Fondo}
                  cambiarEstado={cambiarFondo}
                  tipo="numeric"
                  label="Fondo del sorteo"
                  placeholder="Introduzca el fondo para el sorteo"
                  name="Fondo"
                  leyendaError="El fondo debe ser numerico"
                  expresionRegular={expresionesRegulares.Fondo}
                />
  
                <InputGeneral
                  estado={PorcentajePago}
                  cambiarEstado={cambiarPorcentajePago}
                  tipo="numeric"
                  label="Porcentaje de pago"
                  placeholder="Introduzca el porcentaje de pago"
                  name="PorcentajePago"
                  leyendaError="El porcentaje de pago debe ser numerico"
                  expresionRegular={expresionesRegulares.PorcentajePago}
                />
  
                <InputGeneral
                  estado={HoraInicio}
                  cambiarEstado={cambiarHoraInicio}
                  tipo="time"
                  label="Hora De Inicio"
                  placeholder="Introduzca la hora de inicio"
                  name="HoraInicio"
                  leyendaError="Formato de hora incorrecta"
                  //expresionRegular={expresionesRegulares.HoraInicio}
                />
  
                <InputGeneral
                  estado={HoraFin}
                  cambiarEstado={cambiarHoraFin}
                  tipo="time"
                  label="Hora De Fin"
                  placeholder="Introduzca la hora de fin"
                  name="HoraFin"
                  leyendaError="Formato de hora incorrecta"
                  //expresionRegular={expresionesRegulares.HoraFin}
                />
              </Columna>
            </Formulario>
          </div>
        </div>
  
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={esReventado}
              onChange={(e) => cambiarEsReventado(e.target.checked)}
            />
            Sorteo Reventado
          </label>
        </div>
  
        {esReventado && (
          <div className="grupo">
            <h4>Reventado</h4>
            <div className="container-fluid">
              <Formulario>
                <Columna>
                  <InputGeneral
                    estado={NombreReventado}
                    cambiarEstado={cambiarNombreReventado}
                    tipo="text"
                    label="Nombre"
                    placeholder="Introduzca el nombre"
                    name="NombreReventado"
                    leyendaError="El nombre solo puede contener letras y espacios."
                    expresionRegular={expresionesRegulares.Nombre}
                  />
  
                  <InputGeneral
                    estado={PorcentajePagoReventado}
                    cambiarEstado={cambiarPorcentajePagoReventado}
                    tipo="numeric"
                    label="Porcentaje de pago"
                    placeholder="Introduzca el porcentaje de pago"
                    name="PorcentajePagoReventado"
                    leyendaError="El porcentaje de pago debe ser numerico"
                    expresionRegular={expresionesRegulares.PorcentajePago}
                  />
                </Columna>
                <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                  El fondo sugerido será generado automáticamente.
                </p>
              </Formulario>
            </div>
          </div>
        )}
      </div>
  
      <MensajeFormulario
        titulo="Insertar"
        formularioValido={formularioValido}
        onCancel={abrirCerrarModalInsertar}
        onSubmit={onSubmitPost}
      />
    </div>
  );




  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Tipo De Sorteo General</h3>
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
                estado={Fondo}
                cambiarEstado={cambiarFondo}
                tipo="numeric"
                label="Fondo del Sorteo"
                placeholder="Introduzca el Fondo Para El Sorteo"
                name="Fondo"
                leyendaError="El Fondo Debe Ser Numerico"
                expresionRegular={expresionesRegulares.Fondo}
                value={Fondo.campo}
              />

              <InputGeneral
                estado={PorcentajePago}
                cambiarEstado={cambiarPorcentajePago}
                tipo="numeric"
                label="Porcentaje De Pago"
                placeholder="Introduzca El Porcentaje De Pago"
                name="FechaFin"
                leyendaError="El Porcentaje De Pago Debe Ser Numerico"
                expresionRegular={expresionesRegulares.PorcentajePago}
                value={PorcentajePago.campo}
              />

              <InputGeneral
                estado={HoraFin}
                cambiarEstado={cambiarHoraFin}
                tipo="time"
                label="Hora De Fin"
                placeholder="Introduzca La Hora De Fin"
                name="HoraFin"
                leyendaError="Formato De Hora Incorrecta "
                expresionRegular={expresionesRegulares.HoraFin}
                value={HoraFin.campo}
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
      <h3>Eliminar Tipo De Sorteo General</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario>
            <Columna>
              <h4>Codigo: {Id.campo}</h4>
              <h4>Nombre: {Nombre.campo}</h4>
              <h4>Fondo: {Fondo.campo}</h4>
              <h4>PorcentajePago: {PorcentajePago.campo}</h4>
              <h4>HoraFin: {HoraFin.campo}</h4>
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
          <b>200-Mantenimiento Tipo De Sorteos Intermedia</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Tipo De Sorteo Intermedia
        </Button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Tipo De Sorteo Intermedia"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarTipoSorteoGeneral(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarTipoSorteoGeneral(rowData, "Eliminar"),
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

export default TipoSorteoIntermedia;
