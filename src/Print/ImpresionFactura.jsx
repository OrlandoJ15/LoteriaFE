// import React, { useRef, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Table } from 'react-bootstrap';
// import { useReactToPrint } from 'react-to-print';

// function ImpresionFactura({ jugadas }) {
//   const impresionPV = useRef();
//   const printInitiated = useRef(false);

//   const handlePrint = useReactToPrint({
//     content: () => impresionPV.current,
//     documentTitle: 'Detalle De Sorteo',
//     onAfterPrint: () => alert('Impresión Exitosa'),
//   });

//   useEffect(() => {
//     if (!printInitiated.current) {
//       handlePrint();
//       printInitiated.current = true;
//     }
//   }, []);

//   console.log(jugadas);
//   console.log('Entro a la impresión');

//   return (
//     <div ref={impresionPV} style={{ width: '100%', height: window.innerHeight }}>
//       <h1 className="text-center my-3 border py-2">Detalle de Sorteo</h1>
//       <Table className="w-75 mx-auto" bordered>
//         <thead>
//           <tr>
//             <th>Numero</th>
//             <th>Monto</th>
//           </tr>
//         </thead>
//         <tbody>
//           {jugadas.map((jugada, index) => (
//             <tr key={index}>
//               <td>{jugada.numero}</td>
//               <td>{jugada.monto.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

// export default ImpresionFactura;

import React, { useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

function ImpresionFactura({ jugadas }) {
  const impresionPV = useRef();
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => impresionPV.current,
    documentTitle: 'Detalle De Sorteo',
    onAfterPrint: () => console.log('Impresión Exitosa'),
  });

  useEffect(() => {
    if (jugadas.length > 0) {
      // Retrasa la impresión hasta que el contenido esté listo
      setIsReadyToPrint(true);
    }
  }, [jugadas]);

  console.log("esto es lo que se va imprimir",impresionPV);
  useEffect(() => {
    if (isReadyToPrint && impresionPV.current) {
      handlePrint();
    }
  }, [isReadyToPrint, handlePrint]);

  console.log(jugadas);
  console.log('Entro a la impresión');

  return (
    <div ref={impresionPV} style={{ width: '100%', height: window.innerHeight }}>
      <h1 className="text-center my-3 border py-2">Detalle de Sorteo</h1>
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
              {console.log("este es el numero",jugada.numero)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ImpresionFactura;
