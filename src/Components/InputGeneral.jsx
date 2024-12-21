/*import React from 'react';
import { Input, Label, GrupoInput, LeyendaError, IconoValidacion } from './Formularios';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const InputGeneral = ({ estado, cambiarEstado, tipo, label, placeholder, name, leyendaError, expresionRegular, funcion, onBlur }) => {

	const onChange = (e) => {
		cambiarEstado({ ...estado, campo: e.target.value });
	};

	const validacion = () => {
		
		if (tipo === "date" && expresionRegular) {
            const fechaFormato = estado.campo; // Obtenemos el valor en formato yyyy-mm-dd
            if (expresionRegular.test(fechaFormato)) {
                cambiarEstado({ ...estado, valido: 'true' });
            } else {
                cambiarEstado({ ...estado, valido: 'false' });
            }
        }else if (expresionRegular) {
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
*/




import React from 'react';
import { Input, Label, GrupoInput, LeyendaError, IconoValidacion } from './Formularios';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const InputGeneral = ({ estado, cambiarEstado, tipo, label, placeholder, name, leyendaError, expresionRegular, funcion, onBlur }) => {

	const onChange = (e) => {
		const nuevoValor = e.target.value;
		cambiarEstado((prev) => ({
            ...prev,
            campo: nuevoValor,
        }));
	};

	// const validacion = () => {
		
	// 	if (tipo === "date" && expresionRegular) {
    //         const fechaFormato = estado.campo; // Obtenemos el valor en formato yyyy-mm-dd
    //         if (expresionRegular.test(fechaFormato)) {
    //             cambiarEstado({ ...estado, valido: 'true' });
    //         } else {
    //             cambiarEstado({ ...estado, valido: 'false' });
    //         }
    //     }else if (expresionRegular) {
	// 		if (expresionRegular.test(estado.campo)) {
	// 			cambiarEstado({ ...estado, valido: 'true' });
	// 		} else {
	// 			cambiarEstado({ ...estado, valido: 'false' });
	// 		}
	// 	}
	
	// 	if (funcion) {
	// 		funcion();
	// 	}
	// };


	const validacion = () => {
		console.log("entrando al metodo validacion del input");
		const valor = estado.campo; // Utilizamos el valor actualizado del estado

		if (tipo === "date" && expresionRegular) {
			//const fechaFormato = estado.campo; // Obtenemos el valor en formato yyyy-mm-dd
			if (expresionRegular.test(valor)) {
				cambiarEstado((prev) => ({ ...prev, valido: 'true' }));
			} else {
				cambiarEstado((prev) => ({ ...prev, valido: 'false' }));
			}
		} else if (tipo === "time") {
			console.log("entro al valicadion de time del input");
			// Validar que el campo no esté vacío
			if (valor) { // `estado.campo` contiene el valor del timepicker
				cambiarEstado((prev) => ({ ...prev, valido: 'true' }));
			} else {
				cambiarEstado((prev) => ({ ...prev, valido: 'false' }));
			}
		} else if (expresionRegular) {
			if (expresionRegular.test(valor)) {
				cambiarEstado((prev) => ({ ...prev, valido: 'true' }));
			} else {
				cambiarEstado((prev) => ({ ...prev, valido: 'false' }));
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
        validacion(); // Validar el valor actual al perder el foco
    };
	// const validacionOnBlur = () => {
	// 	if (onBlur) {
	// 		onBlur();
	// 	}
	// };

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
					//onKeyUp={validacion}
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