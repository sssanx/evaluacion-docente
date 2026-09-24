import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaProtegida({ children, rolRequerido }) {
  const { usuario, rol } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;