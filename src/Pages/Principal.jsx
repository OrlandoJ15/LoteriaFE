import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../Styles/Cliente.modal.css";
import { Formulario3, Columna, ColumnaMargin } from "../Components/Formularios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Principal = () => {
  const [numero, setNumero] = useState("");
  const [monto, setMonto] = useState("");
  const [jugadas, setJugadas] = useState([]);
  const [sorteos, setSorteos] = useState([]);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState(null);
  const [horaCierre, setHoraCierre] = useState("");
  const [contador, setContador] = useState("");
  const [nombreJugador, setNombreJugador] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCopiarOpen, setModalCopiarOpen] = useState(false);
  const [idSorteoCopiar, setIdSorteoCopiar] = useState("");

  const navigate = useNavigate();
  const cookies = new Cookies();
  

  useEffect(() => {
    setSorteos([
      { id: 1, nombre: "Sorteo 1", horaCierre: "18:00:00" },
      { id: 2, nombre: "Sorteo 2", horaCierre: "20:00:00" },
    ]);
  }, []);

  // useEffect(() => {
  //   // Validar si el usuario está autenticado a través de la cookie
  //   const token = cookies.get('Token');
  //   if (!token) {
  //     // Si no hay token, redirigir al login
  //     navigate('/');
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (sorteoSeleccionado) {
      const interval = setInterval(() => {
        const ahora = new Date();
        const horaCierreDate = new Date();
        const [horas, minutos, segundos] = sorteoSeleccionado.horaCierre.split(":");
        horaCierreDate.setHours(horas, minutos, segundos);

        const tiempoRestante = horaCierreDate - ahora;
        if (tiempoRestante > 0) {
          const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
          const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
          setContador(`Faltan ${dias} días ${horas} horas ${minutos} minutos ${segundos} segundos`);
        } else {
          setContador("El sorteo ha cerrado.");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sorteoSeleccionado]);

  const agregarJugada = () => {
    if (numero && monto) {
      const nuevaJugada = {
        id: jugadas.length + 1,
        numero,
        monto: parseFloat(monto),
      };
      setJugadas([...jugadas, nuevaJugada]);
      setNumero("");
      setMonto("");
    } else {
      alert("Por favor completa el número y el monto");
    }
  };

  const jugarGalloTapado = () => {
    const numeroAleatorio = Math.floor(Math.random() * 100);
    setNumero(numeroAleatorio.toString().padStart(2, "0"));
  };

  const handleSorteoSeleccionado = (sorteo) => {
    setSorteoSeleccionado(sorteo);
    setHoraCierre(sorteo.horaCierre);
  };

  const columns = [
    { field: "numero", headerName: "Número", width: 100 },
    { field: "monto", headerName: "Monto", width: 150 },
  ];

  return (

    <div className="principal-container">
      <Formulario3>
        {/* Primera columna: Lista de sorteos */}
        <Columna>
          <Typography variant="h5">Lista de Sorteos</Typography>
          <TextField
            label="Fecha Actual"
            variant="outlined"
            value={new Date().toLocaleDateString()}
            fullWidth
            disabled
            style={{ marginBottom: "1rem" }}
          />
          <RadioGroup
            value={sorteoSeleccionado?.id || ""}
            onChange={(e) => {
              const selected = sorteos.find((s) => s.id === parseInt(e.target.value));
              handleSorteoSeleccionado(selected);
            }}
          >
            {sorteos.map((sorteo) => (
              <FormControlLabel
                key={sorteo.id}
                value={sorteo.id}
                control={<Radio />}
                label={sorteo.nombre}
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
              <TextField
                label="Número a Comprar"
                variant="outlined"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Monto a Apostar"
                variant="outlined"
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                fullWidth
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
          <div style={{ height: 400, width: "100%", marginBottom: "1rem" }}>
            <DataGrid
              rows={jugadas}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
            />
          </div>
          <TextField
            label="Nombre del Jugador (Opcional)"
            variant="outlined"
            value={nombreJugador}
            onChange={(e) => setNombreJugador(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" fullWidth>
            Guardar e Imprimir Tiquete
          </Button>
        </Columna>
      </Formulario3>

      {/* Modal para seleccionar rango */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="modal-content">
          <Typography variant="h6">Seleccionar Rango de Números</Typography>
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </Box>
      </Modal>

      {/* Modal para copiar sorteo */}
      <Modal open={modalCopiarOpen} onClose={() => setModalCopiarOpen(false)}>
        <Box className="modal-content">
          <Typography variant="h6">Copiar Sorteo</Typography>
          <TextField
            label="ID del Sorteo"
            variant="outlined"
            value={idSorteoCopiar}
            onChange={(e) => setIdSorteoCopiar(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Lógica para copiar el tiquete
              alert(`Copiar tiquete para el sorteo ID: ${idSorteoCopiar}`);
              setModalCopiarOpen(false);
            }}
          >
            Copiar Tiquete
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Principal;
