import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    const usuarioGuardado = localStorage.getItem("usuario");
    if (rolGuardado && usuarioGuardado) {
      setRol(rolGuardado);
      setUsuario(usuarioGuardado);
    }
  }, []);

  const login = (usuario, rol) => {
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("rol", rol);
    setUsuario(usuario);
    setRol(rol);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    setUsuario(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}