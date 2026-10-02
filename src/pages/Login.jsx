import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// Ícono de usuario (para el campo de email)
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6" />
    </svg>
  );
}

// Ícono de candado (para el campo de contraseña)
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

// Ícono de birrete (para el rol de estudiante)
function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 9l9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V16c2.8 2 7.2 2 10 0v-4.5" />
      <path d="M21 9v6" />
    </svg>
  );
}

// Ícono de docente (para el rol de docente)
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

// Ícono de escudo (para el rol de admin)
function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// Ícono de flecha (para el botón de iniciar sesión)
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

// Ícono de refrescar (para el botón de cambiar rol)
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
  // Rol actual seleccionado (estudiante, docente o admin)
  const [tipo, setTipo] = useState("estudiante");

  // Controla la animación cuando se cambia de rol
  const [cambiando, setCambiando] = useState(false);

  // Lo que el usuario escribe en el campo de email
  const [usuarioInput, setUsuarioInput] = useState("");

  // Lo que el usuario escribe en el campo de contraseña
  const [passwordInput, setPasswordInput] = useState("");

  // Mensaje de error si el login falla (ej: "Usuario no encontrado")
  const [error, setError] = useState("");

  // Se pone en true mientras esperamos la respuesta del backend
  const [cargando, setCargando] = useState(false);

  // Sirve para redirigir a otra ruta después del login
  const navigate = useNavigate();

  // Trae la función login del contexto para guardar la sesión
  const { login } = useAuth();

  // Configuración de cada rol: título, descripción, ícono, etc.
  const roles = {
    estudiante: {
      titulo: "Acceso de estudiantes",
      descripcion:
        "Ingresa tus datos institucionales para consultar y realizar tus evaluaciones docentes.",
      usuario: "Correo institucional",
      icono: <GraduationIcon />,
      siguiente: "docente",           // A qué rol se cambia al hacer clic en "Cambiar"
      siguienteTexto: "docente",
    },

    docente: {
      titulo: "Acceso de docentes",
      descripcion:
        "Ingresa tus datos institucionales para consultar tu información y resultados autorizados.",
      usuario: "Correo institucional",
      icono: <TeacherIcon />,
      siguiente: "admin",
      siguienteTexto: "administrador",
    },

    admin: {
      titulo: "Dirección Académica",
      descripcion:
        "Ingresa como administrador para gestionar evaluaciones, resultados, reportes y planes de acción.",
      usuario: "Correo institucional",
      icono: <AdminIcon />,
      siguiente: "estudiante",
      siguienteTexto: "estudiante",
    },
  };

  // Obtiene la configuración del rol actualmente seleccionado
  const actual = roles[tipo];

  // Cambia al siguiente rol (con una animación)
  const cambiarAcceso = () => {
    setCambiando(true);          // Activa la animación
    setUsuarioInput("");          // Limpia los campos
    setPasswordInput("");
    setError("");                 // Borra errores previos

    // Espera 300ms (para que la animación termine) y cambia el rol
    setTimeout(() => {
      setTipo(actual.siguiente);
      setCambiando(false);
    }, 300);
  };

  // Se ejecuta cuando el usuario envía el formulario
  const iniciarSesion = async (e) => {
    e.preventDefault();           // Evita que la página se recargue

    console.log(" SE EJECUTÓ iniciarSesion");
    console.log(" Email:", usuarioInput);
    console.log(" Password:", passwordInput);
    console.log(" Tipo (rol):", tipo);

    setError("");                 // Limpia errores previos
    setCargando(true);            // Activa el estado de carga

    try {
      console.log(" Haciendo fetch al backend...");

      // Llama al backend para verificar las credenciales
      const respuesta = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuarioInput,     // El email que escribió el usuario
          password: passwordInput, // La contraseña
          rol: tipo,               // El rol seleccionado
        }),
      });

      console.log(" Status HTTP:", respuesta.status);

      // Convierte la respuesta del backend a un objeto
      const datos = await respuesta.json();
      console.log(" Datos recibidos:", datos);

      // Si el backend respondió con error (401, 500, etc.)
      if (!respuesta.ok) {
        console.log(" Error del backend:", datos.error);
        setError(datos.error || "Error al iniciar sesión");
        setCargando(false);
        return;
      }

      // Guarda el usuario y el token en el contexto (y en localStorage)
      console.log(" Guardando usuario y token...");
      login(datos.usuario, datos.token);
      console.log(" login() ejecutado");

      // Redirige al dashboard según el rol
      console.log(" Navegando según tipo:", tipo);
      if (tipo === "estudiante") navigate("/estudiante");
      else if (tipo === "docente") navigate("/docente");
      else if (tipo === "admin") navigate("/direccion");
      console.log(" navigate() ejecutado");
    } catch (err) {
      // Error de red (backend apagado, sin internet, etc.)
      console.error(" ERROR en try/catch:", err);
      setError("No se pudo conectar con el servidor");
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      {/* ============ PANEL IZQUIERDO (BRANDING) ============ */}
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

      {/* ============ PANEL DERECHO (FORMULARIO) ============ */}
      <section className="login-area">
        <div className="login-card">
          <div className={`login-content ${cambiando ? "login-changing" : ""}`}>
            {/* Encabezado con ícono y título según el rol */}
            <div className="login-top">
              <div className="login-icon">{actual.icono}</div>
              <div>
                <span className="login-welcome">ACCESO INSTITUCIONAL</span>
                <h2>{actual.titulo}</h2>
              </div>
            </div>

            <p className="login-description">{actual.descripcion}</p>

            <form onSubmit={iniciarSesion}>
              {/* Campo de usuario (email) */}
              <div className="field">
                <label htmlFor="usuario">Usuario</label>
                <div className="input-box">
                  <span className="input-icon">
                    <UserIcon />
                  </span>
                  <input
                    id="usuario"
                    type="email"
                    placeholder={actual.usuario}
                    value={usuarioInput}
                    onChange={(e) => setUsuarioInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
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

              {/* Mensaje de error (solo aparece si hay uno) */}
              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* Opciones adicionales: recordarme y olvidé contraseña */}
              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <button type="button" className="forgot">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de iniciar sesión (se deshabilita mientras carga) */}
              <button
                type="submit"
                className="login-button"
                disabled={cargando}
              >
                <span>{cargando ? "Iniciando sesión..." : "Iniciar sesión"}</span>
                <span className="button-arrow">
                  <ArrowIcon />
                </span>
              </button>
            </form>

            {/* Sección para cambiar de rol */}
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