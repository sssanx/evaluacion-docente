import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 9l9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V16c2.8 2 7.2 2 10 0v-4.5" />
      <path d="M21 9v6" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c.7-4.2 3-6.5 7-6.5s6.3 2.3 7 6.5" />
      <path d="M17 4v4" />
      <path d="M15 6h4" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20 11a8 8 0 0 0-14.9-3" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 3" />
      <path d="M20 20v-5h-5" />
    </svg>
  );
}

function Login() {
  const [tipo, setTipo] = useState("estudiante");
  const [cambiando, setCambiando] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const roles = {
    estudiante: {
      titulo: "Acceso de estudiantes",
      descripcion:
        "Ingresa tus datos institucionales para consultar y realizar tus evaluaciones docentes.",
      usuario: "Número de estudiante",
      icono: <GraduationIcon />,
      siguiente: "docente",
      siguienteTexto: "docente",
    },

    docente: {
      titulo: "Acceso de docentes",
      descripcion:
        "Ingresa tus datos institucionales para consultar tu información y resultados autorizados.",
      usuario: "Usuario institucional",
      icono: <TeacherIcon />,
      siguiente: "admin",
      siguienteTexto: "administrador",
    },

    admin: {
      titulo: "Dirección Académica",
      descripcion:
        "Ingresa como administrador para gestionar evaluaciones, resultados, reportes y planes de acción.",
      usuario: "Usuario administrador",
      icono: <AdminIcon />,
      siguiente: "estudiante",
      siguienteTexto: "estudiante",
    },
  };

  const actual = roles[tipo];

  const cambiarAcceso = () => {
    setCambiando(true);
    setUsuarioInput("");
    setPasswordInput("");

    setTimeout(() => {
      setTipo(actual.siguiente);
      setCambiando(false);
    }, 300);
  };

  const iniciarSesion = (e) => {
    e.preventDefault();

    // 🔐 Login simulado (después se reemplaza por fetch al backend)
    login(usuarioInput, tipo);

    // Redirige según el rol
    if (tipo === "estudiante") navigate("/estudiante");
    else if (tipo === "docente") navigate("/docente");
    else if (tipo === "admin") navigate("/direccion");
  };

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-circle brand-circle-one"></div>
        <div className="brand-circle brand-circle-two"></div>

        <div className="brand-content">
          <div className="brand-logo">UTO</div>

          <span className="brand-label">
            UNIVERSIDAD TECNOLÓGICA DE ORIENTAL
          </span>

          <h1>
            Evaluación
            <br />
            Docente
          </h1>

          <p>
            Plataforma institucional para la aplicación, procesamiento y
            análisis de la evaluación docente.
          </p>

          <div className="brand-line"></div>

          <div className="brand-features">
            <div>
              <span>✓</span>
              Evaluación académica
            </div>
            <div>
              <span>✓</span>
              Resultados automáticos
            </div>
            <div>
              <span>✓</span>
              Información segura y confidencial
            </div>
          </div>
        </div>
      </section>

      <section className="login-area">
        <div className="login-card">
          <div className={`login-content ${cambiando ? "login-changing" : ""}`}>
            <div className="login-top">
              <div className="login-icon">{actual.icono}</div>
              <div>
                <span className="login-welcome">ACCESO INSTITUCIONAL</span>
                <h2>{actual.titulo}</h2>
              </div>
            </div>

            <p className="login-description">{actual.descripcion}</p>

            <form onSubmit={iniciarSesion}>
              <div className="field">
                <label htmlFor="usuario">Usuario</label>
                <div className="input-box">
                  <span className="input-icon">
                    <UserIcon />
                  </span>
                  <input
                    id="usuario"
                    type="text"
                    placeholder={actual.usuario}
                    value={usuarioInput}
                    onChange={(e) => setUsuarioInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Contraseña</label>
                <div className="input-box">
                  <span className="input-icon">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <button type="button" className="forgot">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button type="submit" className="login-button">
                <span>Iniciar sesión</span>
                <span className="button-arrow">
                  <ArrowIcon />
                </span>
              </button>
            </form>

            <div className="change-access">
              <div className="change-info">
                <span className="change-small">CAMBIAR TIPO DE ACCESO</span>
                <span className="change-text">
                  Entrar como
                  <strong>{actual.siguienteTexto}</strong>
                </span>
              </div>

              <button
                type="button"
                className="switch-button"
                onClick={cambiarAcceso}
              >
                <span className="switch-icon">
                  <RefreshIcon />
                </span>
                <span>Cambiar</span>
              </button>
            </div>
          </div>

          <div className="login-footer">
            Universidad Tecnológica de Oriental
            <span> • </span>
            Evaluación Docente
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;