import Cookies from "universal-cookie";

const cookies = new Cookies();

const verificarToken = () => {
    const token = cookies.get("Token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      window.location.href = "/"; // Redirecciona si no hay token
      return false;
    }
    return token;
  };

export default verificarToken;