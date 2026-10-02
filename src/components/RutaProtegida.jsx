import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaProtegida({ children, rolRequerido }) {
  // Obtiene el usuario y token del contexto
  const { usuario, token } = useAuth();

  // Si no hay usuario o token, regresa al login
  if (!usuario || !token) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no coincide con el requerido, regresa al login
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  // Todo bien, muestra el componente hijo
  return children;
}

export default RutaProtegida;