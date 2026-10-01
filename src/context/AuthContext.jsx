import { createContext, useContext, useState, useEffect } from "react";

// Crea un "contexto" global para compartir la sesión en toda la app
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Guarda los datos del usuario logueado (objeto: { id, email, rol })
  const [usuario, setUsuario] = useState(null);

  // Guarda el token JWT que se usará para autenticar peticiones al backend
  const [token, setToken] = useState(null);

  // Se ejecuta UNA vez al cargar la app: recupera la sesión guardada
  useEffect(() => {
    // Lee del localStorage lo que había guardado de una sesión anterior
    const usuarioGuardado = localStorage.getItem("usuario");
    const tokenGuardado = localStorage.getItem("token");

    // Si ambos existen, restaura la sesión
    if (usuarioGuardado && tokenGuardado) {
      try {
        // Convierte el string JSON de vuelta a objeto
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch {
        // Si el JSON está corrupto, limpia todo para evitar errores
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
      }
    }
  }, []); // [] significa que solo corre una vez al montar el componente

  // Guarda la sesión: se llama después de un login exitoso
  const login = (usuarioData, tokenJWT) => {
    // Convierte el objeto a texto para poder guardarlo en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    localStorage.setItem("token", tokenJWT);

    // Actualiza el estado para que la app sepa quién está logueado
    setUsuario(usuarioData);
    setToken(tokenJWT);
  };

  // Cierra sesión: borra todo lo guardado
  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    // Limpia el estado para que la app sepa que ya no hay usuario
    setUsuario(null);
    setToken(null);
  };

  // Comparte el usuario, token, login y logout con toda la app
  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto desde cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}