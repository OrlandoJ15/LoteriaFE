import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const colores = {
  borde: "#0075FF",
  error: "#bb2929",
  exito: "#1ed12d",
};

const ColumnaLeft = styled.ul`
  margin-top: 5%;
  text-align: left;
  width: 100%;
`;

const ColumnaCenter = styled.ul`
  width: 150%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const ColumnaRight = styled.ul`
  margin-top: 5%;
  text-align: right;
  width: 80%;
`;

const Columna = styled.ul`
  margin-bottom: 0;
  padding-left: 0;
`;

const Formulario = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Formulario2 = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Formulario3 = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const FormularioEncabezado = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    .tipo-documento {
      width: 100%;
    }
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    .tipo-documento {
      width: 80%;
    }
  }
`;

const FormularioTotales = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    text-align: right;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  padding: 10px;
  min-height: 40px;
  cursor: pointer;
  font-size: 80%;

  ${(props) =>
    props.$valido === "false" &&
    css`
      color: ${colores.error};
    `}
`;

const GrupoInput = styled.div`
  position: relative;
  z-index: 90;
`;

const Input = styled.input`
  width: 100%;
  background: #fff;
  border-radius: 3px;
  height: 45px;
  line-height: 45px;
  padding: 0 40px 0 10px;
  transition: 0.3s ease all;
  border: 3px solid transparent;
  height: 25px;

  &:focus {
    border: 3px solid ${colores.borde};
    outline: none;
    box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4);
  }

  ${(props) =>
    props.$valido === "true" &&
    css`
      border: 3px solid transparent;
    `}

  ${(props) =>
    props.$valido === "false" &&
    css`
      border: 3px solid ${colores.error} !important;
    `}
`;

const InputShapeTotales = styled.input`
  width: 100%;
  background: #fff;
  border-radius: 3px;
  height: 45px;
  line-height: 45px;
  padding: 0 40px 0 10px;
  transition: 0.3s ease all;
  border: 3px solid transparent;

  &:focus {
    border: 3px solid ${colores.borde};
    outline: none;
    box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4);
  }

  ${(props) =>
    props.$valido === "true" &&
    css`
      border: 3px solid transparent;
    `}

  ${(props) =>
    props.$valido === "false" &&
    css`
      border: 3px solid ${colores.error} !important;
    `}

  @media (max-width: 500px) {
    text-align: right;
  }
`;

const LeyendaError = styled.p`
  font-size: 12px;
  margin-bottom: 0;
  color: ${colores.error};
  display: none;

  ${(props) =>
    props.$valido === "true" &&
    css`
      display: none;
    `}

  ${(props) =>
    props.$valido === "false" &&
    css`
      display: block;
    `}
`;

const IconoValidacion = styled(FontAwesomeIcon)`
  position: absolute;
  right: 10px;
  top: 5px;
  z-index: 100;
  font-size: 16px;
  opacity: 0;

  ${(props) =>
    props.$valido === "false" &&
    css`
      opacity: 1;
      color: ${colores.error};
    `}

  ${(props) =>
    props.$valido === "true" &&
    css`
      opacity: 1;
      color: ${colores.exito};
    `}
`;

const ContenedorTerminos = styled.div`
  grid-column: span 2;

  input {
    margin-right: 10px;
  }

  @media (max-width: 800px) {
    grid-column: span 1;
  }
`;

const ContenedorBotonCentrado = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: span 2;

  @media (max-width: 800px) {
    grid-column: span 1;
  }
`;

const Boton = styled.button`
  height: 45px;
  line-height: 45px;
  width: 30%;
  background: #000;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.1s ease all;

  &:hover {
    box-shadow: 3px 0px 30px rgba(163, 163, 163, 1);
  }
`;

const MensajeExito = styled.p`
  font-size: 14px;
  color: ${colores.exito};
`;

const MensajeError = styled.div`
  height: 45px;
  line-height: 45px;
  background: #f66060;
  padding: 0px 15px;
  border-radius: 3px;
  grid-column: span 2;

  p {
    margin: 0;
  }

  b {
    margin-left: 10px;
  }
`;

export {
  Formulario,
  Formulario2,
  Formulario3,
  FormularioEncabezado,
  FormularioTotales,
  Label,
  GrupoInput,
  Input,
  InputShapeTotales,
  LeyendaError,
  IconoValidacion,
  ContenedorTerminos,
  ContenedorBotonCentrado,
  Boton,
  MensajeExito,
  MensajeError,
  Columna,
  ColumnaRight,
  ColumnaLeft,
  ColumnaCenter,
};
