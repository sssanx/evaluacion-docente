import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";

import Login from "./pages/Login";
import DashEstudiante from "./pages/estudiantes/DashEstudiante";
import DashDocente from "./pages/docente/DashDocente";
import DashDireccion from "./pages/direccion/DashDireccion";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/estudiante"
            element={
              <RutaProtegida rolRequerido="estudiante">
                <DashEstudiante />
              </RutaProtegida>
            }
          />
          <Route
            path="/docente"
            element={
              <RutaProtegida rolRequerido="docente">
                <DashDocente />
              </RutaProtegida>
            }
          />
          <Route
            path="/direccion"
            element={
              <RutaProtegida rolRequerido="admin">
                <DashDireccion />
              </RutaProtegida>
            }
          />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;