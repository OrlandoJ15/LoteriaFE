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
  { title: "Codigo", field: "idKardex" },
  { title: "Serie", field: "serie" },
  { title: "Numero", field: "numero" },
  { title: "Nombre", field: "nombre" },
  { title: "Monto", field: "monto" },
  { title: "Usuario", field: "idUsuario" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const UrlBase = "http://190.113.84.163:8000/Kardex/RecKardex";

//////////////////////////TERMINA URLs///////////////////////////

const Kardex = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [data, setData] = useState([]);

  //////////////////////////FINALIZA CONSTANTES - STATE///////////////////////////

  const peticionGet = async () => {
    try {
      const response = await axios.get(UrlBase);
      setData(response.data);
    } catch (eror) {
      console.error("Error Al Obtener Los Kardexs", error);
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

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

//   const MensajeFormulario = ({
//     titulo,
//     formularioValido,
//     onCancel,
//     onSubmit,
//   }) => {
//     return (
//       <>
//         {formularioValido === false && (
//           <MensajeError>
//             <p>
//               <FontAwesomeIcon icon={faExclamationTriangle} />
//               <b>Error:</b> Por favor rellena el formulario correctamente.
//             </p>
//           </MensajeError>
//         )}
//         {formularioValido === true && (
//           <MensajeExito>Campos llenos exitosamente!</MensajeExito>
//         )}

//         <div align="right">
//           <Button color="success" onClick={onCancel}>
//             Cancelar
//           </Button>
//           <Button color="primary" onClick={onSubmit} type="submit">
//             {titulo}
//           </Button>
//         </div>
//       </>
//     );
//   };

//   const bodyInsertar = (
//     <div style={scrollVertical}>
//       <h3>Insertar Kardex</h3>
//       <div className="relleno-general">
//         {" "}
//         General
//         <div className="container-fluid">
//           <Formulario>
//             <Columna>
//               <InputGeneral
//                 estado={IdKardex}
//                 cambiarEstado={cambiarIdKardex}
//                 tipo="text"
//                 label="Id Del Kardex"
//                 placeholder="Introduzca El Id Del Kardex"
//                 name="IdKardex"
//                 leyendaError="El Id Del Kardex Solo Puede Contener Numeros."
//                 expresionRegular={expresionesRegulares.IdKardex}
//                 onChange={validarExistenciaKardexId}
//                 onBlur={validarExistenciaKardexId}
//                 autofocus
//               />
//               <InputGeneral
//                 estado={Nombre}
//                 cambiarEstado={cambiarNombre}
//                 tipo="text"
//                 label="Nombre"
//                 placeholder="Introduzca El Nombre"
//                 name="Nombre"
//                 leyendaError="El Nombre solo puede contener letras y espacios."
//                 expresionRegular={expresionesRegulares.Nombre}
//               />

//               <InputGeneral
//                 estado={Numero}
//                 cambiarEstado={cambiarNumero}
//                 tipo="text"
//                 label="Numero"
//                 placeholder="Introduzca El Numero"
//                 name="Numero"
//                 leyendaError="El Numero Debe Incluir Solo Dos Cifras De Numeros ."
//                 expresionRegular={expresionesRegulares.Numero}
//               />

//               <InputGeneral
//                 estado={Monto}
//                 cambiarEstado={cambiarMonto}
//                 tipo="text"
//                 label="Monto"
//                 placeholder="Introduzca El Monto"
//                 name="Monto"
//                 leyendaError="El Monto Deben Ser Solo Numeros"
//                 expresionRegular={expresionesRegulares.Monto}
//               />

//               <InputGeneral
//                 estado={IdUsuario}
//                 cambiarEstado={cambiarIdUsuario}
//                 tipo="text"
//                 label="Id Del Usuario"
//                 placeholder="Introduzca El Id Del Usuario"
//                 name="IdUsuario"
//                 leyendaError="El Id Debe Ser Numeros entro 0-9"
//                 expresionRegular={expresionesRegulares.IdUsuario}
//               />

//               <InputGeneral
//                 estado={IdTipoKardex}
//                 cambiarEstado={cambiarIdTipoKardex}
//                 tipo="text"
//                 label="Id Del Tipo De Kardex"
//                 placeholder="Introduzca El Id Del Tipo De Kardex"
//                 name="IdTipoKardex"
//                 leyendaError="El Id Debe Ser Numeros entro 0-9"
//                 expresionRegular={expresionesRegulares.IdTipoKardex}
//               />
//             </Columna>
//           </Formulario>
//         </div>
//       </div>
//       <MensajeFormulario
//         titulo="Insertar"
//         formularioValido={formularioValido}
//         onCancel={abrirCerrarModalInsertar}
//         onSubmit={onSubmitPost} // Reemplaza con la función adecuada
//       />
//     </div>
//   );

//   const bodyEditar = (
//     <div style={scrollVertical}>
//       <h3>Editar Kardex</h3>
//       <div className="relleno-general">
//         General
//         <div className="container-fluid">
//           <Formulario>
//             <Columna>
//               <InputGeneral
//                 estado={Nombre}
//                 cambiarEstado={cambiarNombre}
//                 tipo="text"
//                 label="Nombre"
//                 placeholder="Introduzca El Nombre"
//                 name="Nombre"
//                 leyendaError="El Nombre solo puede contener letras y espacios."
//                 expresionRegular={expresionesRegulares.Nombre}
//               />

//               <InputGeneral
//                 estado={Numero}
//                 cambiarEstado={cambiarNumero}
//                 tipo="text"
//                 label="Numero"
//                 placeholder="Introduzca El Numero"
//                 name="Numero"
//                 leyendaError="El Numero Debe Incluuir Solo Dos Cifras De Numeros ."
//                 expresionRegular={expresionesRegulares.Numero}
//               />

//               <InputGeneral
//                 estado={Monto}
//                 cambiarEstado={cambiarMonto}
//                 tipo="text"
//                 label="Monto"
//                 placeholder="Introduzca El Monto"
//                 name="Monto"
//                 leyendaError="El Monto Deben Ser Solo Numeros"
//                 expresionRegular={expresionesRegulares.Monto}
//               />

//               <InputGeneral
//                 estado={IdUsuario}
//                 cambiarEstado={cambiarIdUsuario}
//                 tipo="text"
//                 label="Id Del Usuario"
//                 placeholder="Introduzca El Id Del Usuario"
//                 name="IdUsuario"
//                 leyendaError="El Id Debe Ser Numeros entro 0-9"
//                 expresionRegular={expresionesRegulares.IdUsuario}
//               />

//               <InputGeneral
//                 estado={IdTipoKardex}
//                 cambiarEstado={cambiarIdTipoKardex}
//                 tipo="text"
//                 label="Id Del Tipo De Kardex"
//                 placeholder="Introduzca El Id Del Tipo De Kardex"
//                 name="IdTipoKardex"
//                 leyendaError="El Id Debe Ser Numeros entro 0-9"
//                 expresionRegular={expresionesRegulares.IdTipoKardex}
//               />
//             </Columna>
//           </Formulario>
//         </div>
//       </div>
//       <MensajeFormulario
//         titulo="Editar"
//         formularioValido={formularioValido}
//         onCancel={abrirCerrarModalEditar}
//         onSubmit={onSubmitPut} // Reemplaza con la función adecuada
//       />
//     </div>
//   );

//   const bodyEliminar = (
//     <div style={scrollVertical}>
//       <h3>Eliminar Kardex</h3>
//       <div className="relleno-general">
//         {" "}
//         General
//         <div className="container-fluid">
//           <Formulario>
//             <Columna>
//               <h4>Codigo: {IdKardex.campo}</h4>
//               <h4>Nombre: {Nombre.campo}</h4>
//               <h4>Numero: {Numero.campo}</h4>
//               <h4>Monto: {Monto.campo}</h4>
//               <h4>Usuario: {IdUsuario.campo}</h4>
//               <h4>Tipo De Kardex: {IdTipoKardex.campo}</h4>
//             </Columna>
//           </Formulario>
//         </div>
//       </div>
//       <MensajeFormulario
//         titulo="Eliminar"
//         onCancel={abrirCerrarModalEliminar}
//         onSubmit={showQuestionDel} // Reemplaza con la función adecuada
//       />
//     </div>
//   );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>200-Registro De Kardexs</b>
        </h3>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Kardexs"
        // actions={[
        //   {
        //     icon: Edit,
        //     tooltip: "Modificar",
        //     onClick: (event, rowData) => seleccionarKardex(rowData, "Editar"),
        //   },
        //   {
        //     icon: DeleteOutline,
        //     tooltip: "Eliminar",
        //     onClick: (event, rowData) => seleccionarKardex(rowData, "Eliminar"),
        //   },
        // ]}
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

      {/* <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        <>{bodyInsertar}</>
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        <>{bodyEditar}</>
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        <>{bodyEliminar}</>
      </Modal> */}
    </div>
  );
};

export default Kardex;
