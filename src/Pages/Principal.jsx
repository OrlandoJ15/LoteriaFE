import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal
} from "@mui/material";
import MaterialTable from "@material-table/core";
import "../Styles/Cliente.modal.css";
import InputGeneral from "../Components/InputGeneral";
import { Formulario, Formulario3, Columna, ColumnaMargin } from "../Components/Formularios";
import axios from "axios";
import "../Styles/variables.css";

// const urlRecIdTipoSorteo = "https://localhost:44366/TipoSorteo/RecIdTipoSorteoFromTipoSorteoGeneral";
// const urlBase = "https://localhost:44366/TipoSorteoGeneral/RecTipoSorteoGeneral";
// const urlPostSorteo = "https://localhost:44366/Sorteo/insSorteo";
// const urlPostDetalleSorteo = "https://localhost:44366/Sorteo/insDetalleSorteo";
// const urlRecIdSorteoFromParametro = "https://localhost:44366/Sorteo/RecIdSorteoFromParametro";

//////////////////////////////////Azure Url///////////////////////

const urlRecIdTipoSorteo = "https://loteriawebapimvp.azurewebsites.net/TipoSorteo/RecIdTipoSorteoFromTipoSorteoGeneral";
const urlBase = "https://loteriawebapimvp.azurewebsites.net/TipoSorteoGeneral/RecTipoSorteoGeneral";
const urlPostSorteo = "https://loteriawebapimvp.azurewebsites.net/Sorteo/insSorteo";
const urlPostDetalleSorteo = "https://loteriawebapimvp.azurewebsites.net/Sorteo/insDetalleSorteo";
const urlRecIdSorteoFromParametro = "https://loteriawebapimvp.azurewebsites.net/Sorteo/RecIdSorteoFromParametro";

const Principal = () => {
  const [numero, setNumero] = useState({campo: "", valido: false});
  const [numeroRango, setNumeroRango] = useState({campo: "", valido: false});
  const [monto, setMonto] = useState({campo: "", valido: false});
  const [montoRango, setMontoRango] = useState({campo: "", valido: false});
  const [jugadas, setJugadas] = useState([]);
  const [tipoSorteoGeneral, setTipoSorteoGeneral] = useState([]);
  const [tipoSorteoGeneralSeleccionado, setTipoSorteoGeneralSeleccionado] = useState(null);
  const [horaCierre, setHoraCierre] = useState("");
  const [contador, setContador] = useState("");
  const [nombreJugador, setNombreJugador] = useState("");
  const [modalRango, setModalRango] = useState(false);
  const [modalCopiarOpen, setModalCopiarOpen] = useState(false);
  const [idSorteoCopiar, setIdSorteoCopiar] = useState("");

  const [rangoSeleccionado, setRangoSeleccionado] = useState(""); // Nuevo estado para el rango seleccionado

  const expresionesRegulares = {
    numero: /^(0[0-9]|[1-9][0-9]|00|99)$/,
    numeroRango: /^[1-9]$/,
    monto: /^([1-9]\d*00)$/,
  }

  const peticionGetTipoSorteoGeneral = async () => {
    try {
      const response = await axios.get(urlBase);
      setTipoSorteoGeneral(response.data);
    } catch (error) {
      alert("Error al obtener los sorteos");
    }
  };

  useEffect(() => {
    peticionGetTipoSorteoGeneral();
  }, []);

  useEffect(() => {
    if (tipoSorteoGeneralSeleccionado) {
      const interval = setInterval(() => {
        const ahora = new Date();
        const horaCierreDate = new Date();
        const [horas, minutos, segundos] = tipoSorteoGeneralSeleccionado.horaFin.split(":");
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
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tipoSorteoGeneralSeleccionado]);

  const agregarJugada = () => {
    if (numero.valido === 'true' && monto.valido === 'true' ) {
      const nuevaJugada = {
        id: jugadas.length + 1,
        numero : numero.campo,
        monto : parseFloat(monto.campo),
      };
      setJugadas([...jugadas, nuevaJugada]);
      setNumero({campo: '', valido: false});
      setMonto({campo: '', valido: false});
    } else {
      alert("Por favor completa los campos o verifica que sean validos");
    }
  };

  const calcularTotal = () => {
    return jugadas.reduce((total, jugada) => total + jugada.monto, 0).toFixed(2);
  };

  const agregarJugadaRango = () => {
    if ((rangoSeleccionado ==="empieza" || rangoSeleccionado ==="termina") && (numeroRango.valido === 'true' && montoRango.valido === 'true')) {
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

      // Agregar las jugadas generadas con el monto
      const nuevasJugadas = numerosGenerados.map(num => ({
        id: jugadas.length + 1,
        numero: num,
        monto: parseFloat(montoRango.campo),
      }));

      setJugadas([...jugadas, ...nuevasJugadas]);
      setNumeroRango({ campo: '', valido: false });
      setMontoRango({ campo: '', valido: false });
      setRangoSeleccionado(""); // Reiniciar el estado del rango seleccionado
      setModalRango(false);  // Cerrar el modal después de agregar las jugadas
    } else {
      console.log("modal deberia quedarse abierto ");
      alert("Por favor completa los campos o verifica que sean validos");
    }
  };

  const jugarGalloTapado = () => {
    const numeroAleatorio = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    setNumero({ campo: numeroAleatorio, valido: "true" }); // Respetando la estructura del estado
  };

  const handleTipoSorteoGeneralSeleccionado = (selected) => {
    setTipoSorteoGeneralSeleccionado(selected);
    setHoraCierre(selected.horaFin);
  };

  const reseteaCampos = () => {
    setNumero({campo:'', valido: false});
    setMonto({campo:'', valido: false});
    setJugadas([]);
  }

  const realizarSorteo = async() => {
    const options = {
      id: tipoSorteoGeneralSeleccionado.id,
      nombre: "",
      fondo: 0,
      porcetajePago: 0,
      horaFin: "00:00:00"
    }

    try{
      const idSorteoFromParametro = await axios.get();
      const response = await axios.post(urlRecIdTipoSorteo, options);

      const options1 = {

        idUsuario: 11,
        idTipoSorteo: response.data
        //jugadas: jugadas,
      };
      try {
        const response1 = await axios.post(urlPostSorteo, options1);

        const options2 = {

        }

      }catch (error){
        console.error("Error al insertar el sorteo: ", error);
      }
    }catch(error){
      console.error("Error al ontener el id del tipo sorteo: ", error);
    }
  }

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
    setModalRango(prevState => !prevState);
  }

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
                  <input type="radio" name="rango" value="empieza" onChange={(e) => setRangoSeleccionado(e.target.value)}/>
                  Empieza con
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" name="rango" value="termina" onChange={(e) => setRangoSeleccionado(e.target.value)}/>
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
                placeholder = "Introduzca el numero"
                name= "numero"
                leyendaError= "El numero debe estar en el rango de 00-99"
                expresionRegular={expresionesRegulares.numero}
              />            
            </Grid>
            <Grid item xs={6}>
              <InputGeneral
                estado={monto}
                cambiarEstado={setMonto}
                tipo="text"
                label="Monto a comprar"
                placeholder = "Introduzca el monto"
                name= "Monto"
                leyendaError= "El monto debe numerico, mayor y multiplo de 100"
                expresionRegular={expresionesRegulares.monto}
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={jugarGalloTapado} fullWidth>
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
            onClick={() => setModalCopiarOpen(true)}
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
                { title: `Total: ${calcularTotal()}`}
              ]}
              data={jugadas}
              title="Jugadas"
              options={{
                search: false,
                paging: true,
                pageSize: 5,
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
          <Button variant="contained" color="primary" onClick={realizarSorteo} fullWidth>
            Guardar e Imprimir Tiquete
          </Button>
        </Columna>
        <Modal open ={modalRango} onClose={abrirCerrarModalRango}>
          <>{ventanaRango}</>
        </Modal>
      </Formulario3>  
    </div>
  );
};
export default Principal;