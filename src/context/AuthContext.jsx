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
    const persistente = localStorage.getItem("usuario");
    const persistenteToken = localStorage.getItem("token");
    const temporal = sessionStorage.getItem("usuario");
    const temporalToken = sessionStorage.getItem("token");

    const usuarioGuardado = persistente || temporal;
    const tokenGuardado = persistenteToken || temporalToken;

    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  const login = (usuarioData, tokenJWT, persistir = true) => {
    const destino = persistir ? localStorage : sessionStorage;
    const otro = persistir ? sessionStorage : localStorage;

    otro.removeItem("usuario");
    otro.removeItem("token");
    destino.setItem("usuario", JSON.stringify(usuarioData));
    destino.setItem("token", tokenJWT);

    setUsuario(usuarioData);
    setToken(tokenJWT);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");

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