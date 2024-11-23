
import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import MaterialTable from "@material-table/core";
import "../Styles/Cliente.modal.css";
import InputGeneral from "../Components/InputGeneral";
import { Formulario, Formulario3, Columna, ColumnaMargin } from "../Components/Formularios";
import axios from "axios";

const urlRecIdTipoSorteo = "https://localhost:44366/TipoSorteo/RecIdTipoSorteoFromTipoSorteoGeneral";

const urlBase = "https://localhost:44366/TipoSorteoGeneral/RecTipoSorteoGeneral";
const urlPostSorteo = "https://localhost:44366/Sorteo/insSorteo";
const urlPostDetalleSorteo = "https://localhost:44366/Sorteo/insDetalleSorteo";
const urlRecIdSorteoFromParametro = "https://localhost:44366/Sorteo/RecIdSorteoFromParametro";



const Principal = () => {
  const [numero, setNumero] = useState({campo: "", valido: false});
  const [monto, setMonto] = useState({campo: "", valido: false});
  const [jugadas, setJugadas] = useState([]);
  const [tipoSorteoGeneral, setTipoSorteoGeneral] = useState([]);
  const [tipoSorteoGeneralSeleccionado, setTipoSorteoGeneralSeleccionado] = useState(null);
  const [horaCierre, setHoraCierre] = useState("");
  //const [idTipoSorteoGeneral, setIdTipoSorteoGeneral] = useState("");
  const [contador, setContador] = useState("");
  const [nombreJugador, setNombreJugador] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCopiarOpen, setModalCopiarOpen] = useState(false);
  const [idSorteoCopiar, setIdSorteoCopiar] = useState("");

  const [rangoSeleccionado, setRangoSeleccionado] = useState(""); // Nuevo estado para el rango seleccionado
  const [montoRango, setMontoRango] = useState(""); // Nuevo estado para el monto a apostar a cada número del rango


  const expresionesRegulares = {
    numero: /^(0[0-9]|[1-9][0-9]|00|99)$/,
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

  const jugarGalloTapado = () => {
    const numeroAleatorio = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    setNumero({ campo: numeroAleatorio, valido: "true" }); // Respetando la estructura del estado
  };

  const handleTipoSorteoGeneralSeleccionado = (selected) => {
    setTipoSorteoGeneralSeleccionado(selected);
    setHoraCierre(selected.horaFin);
    //setIdTipoSorteoGeneral(selected.id);

  };

  const reseteaCampos = () => {
    console.log("fuck");
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
              {/* <TextField
                label="Número a Comprar"
                variant="outlined"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                fullWidth
              /> */}
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
              {/* <TextField
                label="Monto a Apostar"
                variant="outlined"
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                fullWidth
              /> */}
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
                onClick={() => setModalOpen(true)}
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
          <Button variant="contained" color="primary" onClick={realizarSorteo} fullWidth>
            Guardar e Imprimir Tiquete
          </Button>
        </Columna>
      </Formulario3>
    </div>
  );
};

export default Principal;