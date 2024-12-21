import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
} from "@mui/material";
import MaterialTable from "@material-table/core";
import "../Styles/Cliente.modal.css";
import InputGeneral from "../Components/InputGeneral";
import {
  Formulario,
  Formulario3,
  Columna,
  ColumnaMargin,
} from "../Components/Formularios";
import axios from "axios";
import "../Styles/variables.css";
import { useReactToPrint } from "react-to-print";
import { Table } from "react-bootstrap";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";

//import ImpresionFactura from "../Print/ImpresionFactura";
const urlRecIdTipoSorteo =
  "https://localhost:44366/TipoSorteo/RecIdTipoSorteoFromTipoSorteoGeneral";
const urlBase =
  "https://localhost:44366/TipoSorteoGeneral/RecIdTipoSorteoFromTipoSorteoGeneralOExtraordinarioPA";
const urlPostSorteo = "https://localhost:44366/Sorteo/insSorteo";
const urlPostDetalleSorteo =
  "https://localhost:44366/DetalleSorteo/insDetalleSorteo";
const urlRecIdSorteoFromParametro =
  "https://localhost:44366/Sorteo/RecIdSorteoFromParametro";
const urlCrearTipoSorteoHoy =
  "https://localhost:44366/TipoSorteo/CrearTipoSorteoHoy";
const urlIncrementaronsecutivoSorteo =
  "https://localhost:44366/Parametro/IncrementarConsecutivoSorteo";
const urlRecSumaApostada =
  "https://localhost:44366/DetalleSorteo/RecSumaApostada";

const urlRecDetalleSorteoXId =
  "https://localhost:44366/DetalleSorteo/RecDetalleSorteoFromIdSorteo";

//////////////////////////////////Azure Url///////////////////////

// const urlRecIdTipoSorteo = "https://loteriawebapimvp.azurewebsites.net/TipoSorteo/RecIdTipoSorteoFromTipoSorteoGeneral";
// const urlBase = "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/RecTipoSorteoGeneral";
// const urlPostSorteo = "https://loteriawebapimvp.azurewebsites.net/Sorteo/insSorteo";
// const urlPostDetalleSorteo = "https://loteriawebapimvp.azurewebsites.net/Sorteo/insDetalleSorteo";
// const urlRecIdSorteoFromParametro = "https://loteriawebapimvp.azurewebsites.net/Sorteo/RecIdSorteoFromParametro";

const Principal = () => {
  const [numero, setNumero] = useState({ campo: "", valido: false });
  const [numeroRango, setNumeroRango] = useState({ campo: "", valido: false });
  const [monto, setMonto] = useState({ campo: "", valido: false });
  const [montoRango, setMontoRango] = useState({ campo: "", valido: false });
  const [jugadas, setJugadas] = useState([]);
  const [tipoSorteoGeneral, setTipoSorteoGeneral] = useState([]);
  const [tipoSorteoGeneralSeleccionado, setTipoSorteoGeneralSeleccionado] =
    useState(null);
  const [horaCierre, setHoraCierre] = useState("");
  const [contador, setContador] = useState("");
  const [nombreJugador, setNombreJugador] = useState("");
  const [modalRango, setModalRango] = useState(false);
  const [modalCopiarSorteo, setModalCopiarSorteo] = useState(false);
  const [rangoSeleccionado, setRangoSeleccionado] = useState(""); // Nuevo estado para el rango seleccionado
  const [idSorteo, setIdSorteo] = useState({ campo: "", valido: false });
  const [idTipoSorteoHoy, setIdTipoSorteoHoy] = useState(null);
  const [idSorteoFromParametro, setIdSorteoFromParametro] = useState(0);
  const [reseteaCamposTrigger, setReseteaCamposTrigger] = useState(false);

  //const [topeApuesta, setTopeApuesta] = useState(0);
  //const [sumaApostada, setSumaApostada] = useState(0);

  const impresionPV = useRef(null); // Referencia para la impresión

  const expresionesRegulares = {
    numero: /^(0[0-9]|[1-9][0-9]|00|99)$/,
    numeroRango: /^[0-9]$/,
    monto: /^([1-9]\d*00)$/,
    idSorteo: /^\d+$/,
  };

  const peticionGetTipoSorteoGeneral = async () => {
    try {
      const respuestaGetTipoSorteoGeneral = await axios.get(urlBase);
      setTipoSorteoGeneral(respuestaGetTipoSorteoGeneral.data);
    } catch (error) {
      alert("Error al obtener los sorteos");
    }
  };

  //Crea los tipos de sorteo para el dia actual
  const crearTipoSorteoHoy = async () => {
    try {
      await axios.post(urlCrearTipoSorteoHoy);
    } catch (error) {
      console.error("Error al crear los tipos de sorteos para hoy: ", error);
    }
  };

  useEffect(() => {
    peticionGetTipoSorteoGeneral();
    crearTipoSorteoHoy();
    const obtenerIdSorteoFromParametro = async () => {
      try {
        const { data: idSorteoFromParametroLocal } = await axios.get(
          urlRecIdSorteoFromParametro
        );
        setIdSorteoFromParametro(idSorteoFromParametroLocal);
        console.log(
          "este es el nuevo id de sorteo from parametro local ",
          idSorteoFromParametroLocal
        );
        console.log(
          "este es el nuevo id de sorteo from parametro state ",
          idSorteoFromParametro
        );
      } catch (error) {
        console.error("Error al obtener el consecutivo del sorteo: ", error);
      }
    };
    obtenerIdSorteoFromParametro();
  }, [reseteaCamposTrigger]);

  useEffect(() => {
    const reseteaCampos = () => {
      reseteaCamposSinTipoSorteoGeneralSeleccionado();
    };

    const obtenerIdTipoSorteoHoy = async () => {
      try {
        const options = {
          id: tipoSorteoGeneralSeleccionado?.id || 0,
          nombre: "",
          fondo: 0,
          porcentajePago: 0,
          horaFin: "00:00:00",
        };
        const { data: idTipoSorteoHoyLocal } = await axios.post(
          urlRecIdTipoSorteo,
          options
        );
        console.log("ID tipo Sorteo Hoy Obtenido: ", idTipoSorteoHoyLocal);
        setIdTipoSorteoHoy(idTipoSorteoHoyLocal);
      } catch (error) {
        console.error("Error al obtener id del tipo de sorteo de hoy: ", error);
      }
    };

    const actualizarContador = () => {
      if (!tipoSorteoGeneralSeleccionado) return;

      const ahora = new Date();
      const horaCierreDate = new Date();
      const [horas, minutos, segundos] =
        tipoSorteoGeneralSeleccionado.horaFin.split(":");
      horaCierreDate.setHours(horas, minutos, segundos);

      const tiempoRestante = horaCierreDate - ahora;

      if (tiempoRestante > 0) {
        const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutos = Math.floor(
          (tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

        setContador(
          `Faltan ${dias} días ${horas} horas ${minutos} minutos ${segundos} segundos`
        );
      } else {
        setContador("Sorteo Cerrado");
      }
    };

    reseteaCampos();
    obtenerIdTipoSorteoHoy();

    const interval = setInterval(actualizarContador, 1000);

    return () => clearInterval(interval);
  }, [tipoSorteoGeneralSeleccionado]);

  const agregarJugada = async () => {
    if (numero.valido === "true" && monto.valido === "true") {
      const resultadoTopeApuesta = calcularTope();

      const options = {
        idSorteo: 0,
        numero: numero.campo,
        monto: 0,
        idTipoSorteo: idTipoSorteoHoy,
      };
      console.log("Este es el id del sorteo hoy ", idTipoSorteoHoy);
      try {
        const respuesta = await axios.post(urlRecSumaApostada, options);
        const resultadoSumaApostada = respuesta.data;

        let montoEntabla = 0;

        const numeroExiste = jugadas.findIndex(
          (j) => j.numero === numero.campo
        );

        if (numeroExiste !== -1) {
          montoEntabla = jugadas[numeroExiste].monto;
        }

        if (
          estaDentroTope(
            resultadoTopeApuesta,
            monto.campo,
            resultadoSumaApostada + montoEntabla
          )
        ) {
          const jugadaExistente = jugadas.find(
            (j) => j.numero === numero.campo
          );

          if (jugadaExistente) {
            console.log("encontro el numero en la lista ");
            const nuevasJugadas = jugadas.map((j) =>
              j.numero === numero.campo
                ? { ...j, monto: j.monto + parseFloat(monto.campo) }
                : j
            );
            console.log(nuevasJugadas);
            setJugadas(nuevasJugadas);
          } else {
            console.log("La apuesta si se puede realizar");
            const nuevaJugada = {
              id: jugadas.length + 1,
              numero: numero.campo,
              monto: parseFloat(monto.campo),
            };
            console.log(nuevaJugada);
            setJugadas([...jugadas, nuevaJugada]);
          }
          setNumero({ campo: "", valido: false });
          setMonto({ campo: "", valido: false });
        } else {
          alert(
            `La apuesta supera el tope permitido, el maximo posible seria: ${
              resultadoTopeApuesta - (resultadoSumaApostada + montoEntabla)
            }`
          );
        }
      } catch (error) {
        console.error("Error al calcular la suma apostada: ", error);
      }
    } else {
      alert("Por favor completa los campos o verifica que sean validos");
    }
  };

  function estaDentroTope(tope, monto, apostado) {
    const apuestaPosible = tope - apostado;
    if (monto <= apuestaPosible) return true;
    else return false;
  }

  const calcularTotal = () => {
    return jugadas
      .reduce((total, jugada) => total + jugada.monto, 0)
      .toFixed(2);
  };

  const agregarJugadaRango = async (event) => {
    if (event) event.preventDefault();

    if (
      (rangoSeleccionado === "empieza" || rangoSeleccionado === "termina") &&
      numeroRango.valido === "true" &&
      montoRango.valido === "true"
    ) {
      let numerosGenerados = [];
      const numeroRangoValido = numeroRango.campo;

      if (rangoSeleccionado === "empieza") {
        for (let i = 0; i <= 9; i++) {
          const numeroGenerado = `${numeroRangoValido}${i}`;
          numerosGenerados.push(numeroGenerado);
        }
      } else if (rangoSeleccionado === "termina") {
        for (let i = 0; i <= 9; i++) {
          const numeroGenerado = `${i}${numeroRangoValido}`;
          numerosGenerados.push(numeroGenerado);
        }
      }

      console.log("Estos son los numeros generados ", numerosGenerados);

      const resultadoTopeApuesta = calcularTope();
      let numerosNoAgregados = [];

      let nuevasJugadas = [...jugadas];

      for (const numero of numerosGenerados) {
        const options = {
          idSorteo: 0,
          numero: numero,
          monto: 0,
          idTipoSorteo: idTipoSorteoHoy,
        };

        let montoEntabla = 0;

        const numeroExiste = nuevasJugadas.findIndex(
          (j) => j.numero === numero
        );

        if (numeroExiste !== -1) {
          montoEntabla = nuevasJugadas[numeroExiste].monto;
        }

        try {
          const respuesta = await axios.post(urlRecSumaApostada, options);
          const resultadoSumaApostada = respuesta.data;

          if (
            estaDentroTope(
              resultadoTopeApuesta,
              montoRango.campo,
              resultadoSumaApostada + montoEntabla
            )
          ) {
            const indexExistente = nuevasJugadas.findIndex(
              (j) => j.numero === numero
            );

            if (indexExistente !== -1) {
              nuevasJugadas[indexExistente].monto += parseFloat(
                montoRango.campo
              );
            } else {
              nuevasJugadas.push({
                id: nuevasJugadas.length + 1,
                numero: numero,
                monto: parseFloat(montoRango.campo),
              });
            }
          } else {
            const maximoPermitido =
              resultadoTopeApuesta - (resultadoSumaApostada + montoEntabla);
            numerosNoAgregados.push({ numero, maximoPermitido });
          }
        } catch (error) {
          console.error(
            `Error al calcular la suma apostada para el número ${numero}: `,
            error
          );
        }
      }

      setJugadas(nuevasJugadas);

      if (numerosNoAgregados.length > 0) {
        const mensaje = numerosNoAgregados
          .map(
            (item) =>
              `Número: ${
                item.numero
              }, Máximo permitido: ${item.maximoPermitido.toFixed(2)}`
          )
          .join("\n");
        alert(`Algunos números no se pudieron agregar:\n${mensaje}`);
      }

      // Reiniciar los campos si al menos un número fue agregado
      if (numerosNoAgregados.length < numerosGenerados.length) {
        setNumeroRango({ campo: "", valido: false });
        setMontoRango({ campo: "", valido: false });
        setRangoSeleccionado(""); // Reiniciar el estado del rango seleccionado
        setModalRango(false); // Cerrar el modal después de agregar las jugadas
      }
    } else {
      console.log("modal deberia quedarse abierto");
      alert("Por favor completa los campos o verifica que sean válidos");
    }
  };

  const jugarGalloTapado = () => {
    const numeroAleatorio = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    setNumero({ campo: numeroAleatorio, valido: "true" }); // Respetando la estructura del estado
  };

  const handleTipoSorteoGeneralSeleccionado = (selected) => {
    setTipoSorteoGeneralSeleccionado(selected);
    setHoraCierre(selected.horaFin);
  };

  const reseteaCampos = () => {
    setNumero({ campo: "", valido: false });
    setMonto({ campo: "", valido: false });
    setNumeroRango({ campo: "", valido: false });
    setMontoRango({ campo: "", valido: false });
    setJugadas([]);
    setTipoSorteoGeneralSeleccionado(null);
    setHoraCierre("");
    setContador("");
    setNombreJugador("");
    setIdSorteo({ campo: "", valido: false });
    setReseteaCamposTrigger((prev) => !prev); // Cambia el valor para activar el useEffect.
  };

  const reseteaCamposSinTipoSorteoGeneralSeleccionado = () => {
    setNumero({ campo: "", valido: false });
    setMonto({ campo: "", valido: false });
    setNumeroRango({ campo: "", valido: false });
    setMontoRango({ campo: "", valido: false });
    setJugadas([]);
    setHoraCierre("");
    setContador("");
    setNombreJugador("");
    setIdSorteo({ campo: "", valido: false });
  };

  const handleValidatedPrint = () => {
    console.log("entro al validate to print ");
    if (!impresionPV.current) {
      console.error("El contenido de impresión no está disponible.");
      return;
    }
    console.log("Esto es el div ", impresionPV.current);
    console.log(impresionPV.current.innerHTML);
    if (jugadas.length === 0) {
      console.error("No hay jugadas para imprimir.");
      return;
    }

    handlePrint(); // Llama a la función original de impresión si el contenido es válido
  };

  const handlePrint = useReactToPrint({
    content: () => impresionPV.current.value, // Se usa la referencia correcta
    // documentTitle: 'Detalle De Sorteo',
    // onAfterPrint: () => console.log('Impresión completada'),
  });

  useEffect(() => {
    if (impresionPV.current) {
      console.log(impresionPV.current); // Accede al div cuando el componente se haya renderizado
    }
  }, [impresionPV.current]);

  function calcularTopeApuesta(totalPote, porcentajePago) {
    if (porcentajePago <= 0 || porcentajePago > 100 || totalPote <= 0) {
      throw new Error(
        "Porcentaje de pago debe estar entre 0 y 100 y el pote debe ser mayor a 0."
      );
    }
    // Calcular el tope de apuesta
    const tope = totalPote / porcentajePago;

    return tope;
  }

  const calcularTope = () => {
    const fondo = tipoSorteoGeneralSeleccionado.fondo;
    const porc = tipoSorteoGeneralSeleccionado.porcentajePago;

    return calcularTopeApuesta(fondo, porc);
  };

  const realizarSorteo = async () => {
    if (jugadas.length === 0) {
      alert("No has insertado ningún número a tu sorteo.");
      console.error("No has insertado ningún número a tu sorteo.");
      return;
    }

    if (!idTipoSorteoHoy || !idSorteoFromParametro) {
      console.error("Faltan datos esenciales para realizar el sorteo");
      return;
    }

    try {
      //Metodo para insertar el sorteo
      const insertarSorteo = async () => {
        const options = {
          id: idSorteoFromParametro,
          idUsuario: 1,
          idTipoSorteo: idTipoSorteoHoy,
        };
        return await axios.post(urlPostSorteo, options);
      };

      //Metodo para insertar los detalles
      const insertarDetalles = async () => {
        const detalles = await Promise.all(
          jugadas.map(async (jugada) => {
            const options = {
              idSorteo: idSorteoFromParametro,
              numero: jugada.numero,
              monto: jugada.monto,
            };
            try {
              const respuestaInsertarDetalles = await axios.post(
                urlPostDetalleSorteo,
                options
              );
              return options;
            } catch (error) {
              console.error("Error al insertar el detalle de sorteo:", error);
              return null;
            }
          })
        );
        return detalles.filter((detalle) => detalle !== null);
      };

      // Incrementar el consecutivo del sorteo
      const incrementarConsecutivo = async () => {
        try {
          await axios.post(urlIncrementaronsecutivoSorteo);
          console.log("Consecutivo del sorteo incrementado con éxito.");
        } catch (error) {
          console.error(
            "Error al incrementar el consecutivo del sorteo:",
            error
          );
        }
      };

      //Ejecucion de los metodos para la realizacion del sorteo

      const respuestaInsertarSorteo = await insertarSorteo();

      const detallesValidos = await insertarDetalles();

      await incrementarConsecutivo();

      // Actualizar jugadas
      setJugadas(detallesValidos);

      if (detallesValidos.length > 0) {
        setTimeout(() => handleValidatedPrint(), 1000);
      } else {
        console.error("No hay detalles de jugadas para imprimir.");
      }

      // Resetear campos
      reseteaCampos();
    } catch (error) {
      console.error("Error al realizar el sorteo:", error);
    }
  };

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    backgroundColor: "rgb(255, 255, 255)",
  };

  const abrirCerrarModalRango = () => {
    setModalRango((prevState) => !prevState);
  };
  const abrirCerrarModalCopiarSorteo = () => {
    setModalCopiarSorteo((prevState) => !prevState);
  };

  const copiarSorteo = async (event) => {
    try {
      if (event) event.preventDefault();

      if (!idSorteo.valido) {
        alert("Por favor, ingrese un número de sorteo válido.");
        return;
      }

      const options = {
        id: 0,
        idSorteo: idSorteo.campo,
        numero: 0,
        monto: 0,
      };

      // Solicitar detalles del sorteo a copiar
      const response = await obtenerDetallesSorteo(options);

      if (response && response.length > 0) {
        // Insertar detalles del sorteo en la tabla
        insertarCopiaSorteo(response);

        setModalCopiarSorteo(false); // Cerrar modal
      } else {
        alert("El ID del sorteo no se encuentra registrado.");
      }
    } catch (error) {
      console.error("Error al copiar sorteo:", error);
      alert("Ocurrió un error al procesar la solicitud.");
    }
  };

  // Función para obtener detalles del sorteo a copiar
  const obtenerDetallesSorteo = async (options) => {
    try {
      const response = await axios.post(urlRecDetalleSorteoXId, options);
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener los detalles del sorteo:", error);
      throw error;
    }
  };

  const insertarCopiaSorteo = (jsonJugadas) => {
    try {
      if (!Array.isArray(jsonJugadas) || jsonJugadas.length === 0) {
        alert("No se encontraron jugadas en el JSON proporcionado.");
        return;
      }

      // Crear una copia de las jugadas actuales
      const nuevasJugadas = [...jugadas];

      jsonJugadas.forEach((jugada) => {
        const numeroExiste = nuevasJugadas.findIndex(
          (j) => j.numero === jugada.numero
        );

        if (numeroExiste !== -1) {
          // Si el número ya existe, suma el monto a la jugada existente
          nuevasJugadas[numeroExiste].monto += parseFloat(jugada.monto);
        } else {
          // Si el número no existe, agrega una nueva jugada con un ID único
          const nuevaJugada = {
            id: nuevasJugadas.length + 1, // Generar un ID único
            numero: jugada.numero,
            monto: parseFloat(jugada.monto),
          };
          nuevasJugadas.push(nuevaJugada);
        }
      });

      // Actualizar el estado con las nuevas jugadas
      setJugadas(nuevasJugadas);
      alert("Jugadas procesadas e insertadas exitosamente.");
    } catch (error) {
      console.error("Error al procesar las jugadas desde el JSON:", error);
      alert("Ocurrió un error al procesar las jugadas desde el JSON.");
    }
  };

  const ventanaCopiarSorteo = (
    <>
      <h3>Copiar Sorteo</h3>
      <div className="relleno-general">
        <div className="container-fluid">
          <Formulario>
            <InputGeneral
              estado={idSorteo}
              cambiarEstado={setIdSorteo}
              tipo="text"
              label="Id de Sorteo"
              placeholder="Introduce un número de sorteo"
              name="idSorteo"
              leyendaError="El id solo puede ser numerico"
              expresionRegular={expresionesRegulares.idSorteo}
              style={{ flex: 1 }} // Para que ambos campos ocupen el mismo espacio
            />
            <div>
              <button onClick={copiarSorteo}>Copiar Sorteo</button>
              <button onClick={abrirCerrarModalCopiarSorteo}>Cancelar</button>
            </div>
          </Formulario>
        </div>
      </div>
    </>
  );

  const ventanaRango = (
    <div>
      <h3>Seleccionar rango de apuesta</h3>
      <div className="relleno-general">
        <div className="container-fluid">
          <Formulario>
            {/* Fila para los radio buttons: uno debajo del otro */}
            <div style={{ marginBottom: "20px" }}>
              <div>
                <label>
                  <input
                    type="radio"
                    name="rango"
                    value="empieza"
                    onChange={(e) => setRangoSeleccionado(e.target.value)}
                  />
                  Empieza con
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="rango"
                    value="termina"
                    onChange={(e) => setRangoSeleccionado(e.target.value)}
                  />
                  Termina con
                </label>
              </div>
            </div>

            {/* Fila para los campos de entrada: uno al lado del otro */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <InputGeneral
                estado={numeroRango}
                cambiarEstado={setNumeroRango}
                tipo="text"
                label="Numero"
                placeholder="Introduce un número"
                name="numeroRango"
                leyendaError="El numero solo puede estar del 0-9"
                expresionRegular={expresionesRegulares.numeroRango}
                style={{ flex: 1 }} // Para que ambos campos ocupen el mismo espacio
              />
              <InputGeneral
                estado={montoRango}
                cambiarEstado={setMontoRango}
                tipo="text"
                label="Monto"
                placeholder="Introduce un Monto"
                name="monto"
                leyendaError="El monto debe ser mayor y múltiplo de 100"
                expresionRegular={expresionesRegulares.monto}
                style={{ flex: 1 }} // Para que ambos campos ocupen el mismo espacio
              />
            </div>

            {/* Fila para los botones: uno al lado del otro */}
            <div style={{ display: "flex", gap: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={agregarJugadaRango}
              >
                Agregar rango
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={abrirCerrarModalRango}
              >
                Cancelar
              </button>
            </div>
          </Formulario>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="principal-container">
        <Formulario3>
          {/* Primera columna: Lista de sorteos */}
          <Columna>
            <Typography variant="h5">Lista de Tipos de Sorteos</Typography>
            <TextField
              label="Fecha Actual"
              variant="outlined"
              value={new Date().toLocaleDateString()}
              fullWidth
              disabled
              style={{ marginBottom: "1rem" }}
            />
            <RadioGroup
              value={tipoSorteoGeneralSeleccionado?.id || ""}
              onChange={(e) => {
                const selected = tipoSorteoGeneral.find(
                  (s) => s.id === parseInt(e.target.value)
                );
                handleTipoSorteoGeneralSeleccionado(selected);
              }}
            >
              {tipoSorteoGeneral.map((tipoSorteoGeneral) => (
                <FormControlLabel
                  key={tipoSorteoGeneral.id}
                  value={tipoSorteoGeneral.id}
                  control={<Radio />}
                  label={`${tipoSorteoGeneral.nombre} | Hora de fin: ${tipoSorteoGeneral.horaFin}`}
                />
              ))}
            </RadioGroup>
          </Columna>
          {/* Segunda columna: Venta de números */}
          {tipoSorteoGeneralSeleccionado ? (
            <>
              <ColumnaMargin>
                <Typography variant="h6">
                  Hora de Cierre: {horaCierre || "Seleccione un sorteo"}
                </Typography>
                <Typography variant="body1">{contador}</Typography>
                <Typography variant="h6">Venta Números</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <InputGeneral
                      estado={numero}
                      cambiarEstado={setNumero}
                      tipo="text"
                      label="Numero a comprar"
                      placeholder="Introduzca el numero"
                      name="numero"
                      leyendaError="El numero debe estar en el rango de 00-99"
                      expresionRegular={expresionesRegulares.numero}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputGeneral
                      estado={monto}
                      cambiarEstado={setMonto}
                      tipo="text"
                      label="Monto a comprar"
                      placeholder="Introduzca el monto"
                      name="Monto"
                      leyendaError="El monto debe numerico, mayor y multiplo de 100"
                      expresionRegular={expresionesRegulares.monto}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      onClick={jugarGalloTapado}
                      fullWidth
                    >
                      Gallo Tapado
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      onClick={abrirCerrarModalRango}
                      fullWidth
                    >
                      Seleccionar Rango
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={agregarJugada}
                      fullWidth
                    >
                      Agregar Jugada
                    </Button>
                  </Grid>
                </Grid>
              </ColumnaMargin>
              {/* Tercera columna: Acciones y tabla */}
              <Columna>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginBottom: "1rem" }}
                  onClick={() => setModalCopiarSorteo(true)}
                  fullWidth
                >
                  Copiar Sorteo
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginBottom: "1rem" }}
                  fullWidth
                >
                  Lista
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  style={{ marginBottom: "1rem" }}
                  fullWidth
                >
                  Tiquetes
                </Button>
                <div style={{ width: "100%", marginBottom: "1rem" }}>
                  <MaterialTable
                    columns={[
                      { title: "Número", field: "numero" },
                      { title: "Monto", field: "monto" },
                      { title: `Total: ${calcularTotal()}` },
                    ]}
                    data={jugadas}
                    title="Jugadas"
                    actions={[
                      {
                        icon: Edit,
                        tooltip: "Modificar Monto",
                        //onClick: (event, rowData) => seleccionarUsuario(rowData, "Editar"),
                      },
                      {
                        icon: DeleteOutline,
                        tooltip: "Eliminar Numero",
                        //onClick: (event, rowData) => seleccionarUsuario(rowData, "Eliminar"),
                      },
                    ]}
                    options={{
                      actionsColumnIndex: -1,
                      headerStyle: { backgroundColor: "lightblue" },
                      selection: true,
                      search: false,
                      paging: true,
                      pageSize: 5,
                    }}
                    localization={{
                      header: { actions: "Acciones" },
                      pagination: {
                        labelDisplayedRows: "{from}-{to} de {count}",
                        labelRowsPerPage: "Filas por página:",
                        //labelRowsSelect: "filas",
                      },
                    }}
                  />
                </div>
                <TextField
                  label="Nombre del Jugador (Opcional)"
                  variant="outlined"
                  value={nombreJugador}
                  onChange={(e) => setNombreJugador(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Nombre del Jugador (Opcional)"
                  variant="outlined"
                  value={nombreJugador}
                  onChange={(e) => setNombreJugador(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={realizarSorteo}
                  fullWidth
                >
                  Guardar e Imprimir Tiquete
                </Button>
                <div ref={impresionPV}>
                  {jugadas.length > 0 ? (
                    <>
                      <h1 className="text-center my-3 border py-2">
                        Detalle de Sorteo
                      </h1>
                      <Table className="w-75 mx-auto" bordered>
                        <thead>
                          <tr>
                            <th>Numero</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jugadas.map((jugada, index) => (
                            <tr key={index}>
                              <td>{jugada.numero}</td>
                              <td>{jugada.monto.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <p>No hay jugadas para mostrar.</p>
                  )}
                </div>
              </Columna>
              <Modal open={modalRango} onClose={abrirCerrarModalRango}>
                <>{ventanaRango}</>
              </Modal>
              <Modal
                open={modalCopiarSorteo}
                onClose={abrirCerrarModalCopiarSorteo}
              >
                <>{ventanaCopiarSorteo}</>
              </Modal>
            </>
          ) : (
            <p>Selecciona un tipo de sorteo.</p>
          )}
        </Formulario3>
      </div>
    </>
  );
};
export default Principal;
