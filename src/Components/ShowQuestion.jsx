

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

export default showQuestion();