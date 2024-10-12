import React from 'react';
import { Input, Label, GrupoInput, LeyendaError, IconoValidacion } from './Formularios';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const InputGeneral = ({ estado, cambiarEstado, tipo, label, placeholder, name, leyendaError, expresionRegular, funcion, onBlur }) => {

	const onChange = (e) => {
		cambiarEstado({ ...estado, campo: e.target.value });
	};

	const validacion = () => {
		if (expresionRegular) {
			if (expresionRegular.test(estado.campo)) {
				cambiarEstado({ ...estado, valido: 'true' });
			} else {
				cambiarEstado({ ...estado, valido: 'false' });
			}
		}

		if (funcion) {
			funcion();
		}
	};

	const validacionOnBlur = () => {
		if (onBlur) {
			onBlur();
		}
	};

	const EstiloLabell = {
		fontSize: '80%'
	};

	const EstiloInput = {
		height: '25px'
	};

	return (
		<div>
			<Label htmlFor={name} $valido={estado.valido} style={EstiloLabell}>{label}</Label>
			<GrupoInput>
				<Input
					type={tipo}
					placeholder={placeholder}
					id={name}
					value={estado.campo}
					onChange={onChange}
					onKeyUp={validacion}
					onBlur={validacionOnBlur}
					$valido={estado.valido}
					style={EstiloInput}
				/>
				<IconoValidacion
					icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle}
					$valido={estado.valido}
				/>
			</GrupoInput>
			<LeyendaError $valido={estado.valido}>{leyendaError}</LeyendaError>
		</div>
	);
};

export default InputGeneral;