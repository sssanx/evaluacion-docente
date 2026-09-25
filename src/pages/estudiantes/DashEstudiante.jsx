import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  estudianteMock,
  obtenerDocentesConEstado,
} from "../../data/mockEstudiante";
import "./DashEstudiante.css";

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 9l9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V16c2.8 2 7.2 2 10 0v-4.5" />
      <path d="M21 9v6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
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

function DashEstudiante() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [docentes] = useState(() => obtenerDocentesConEstado());

  const total = docentes.length;
  const evaluados = docentes.filter((d) => d.evaluado).length;
  const pendientes = total - evaluados;
  const porcentaje = total > 0 ? Math.round((evaluados / total) * 100) : 0;

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const evaluarDocente = (docenteId) => {
    navigate(`/estudiante/evaluar/${docenteId}`);
  };

  return (
    <div className="dash-est-page">
      <aside className="dash-sidebar">
        <div className="dash-logo">UTO</div>

        <nav className="dash-nav">
          <a className="dash-nav-item active">
            <span className="dash-nav-icon">
              <GraduationIcon />
            </span>
            Mis evaluaciones
          </a>
        </nav>

        <button className="dash-logout" onClick={cerrarSesion}>
          <span className="dash-nav-icon">
            <LogoutIcon />
          </span>
          Cerrar sesión
        </button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <span className="dash-hello">BIENVENIDA</span>
            <h1>{estudianteMock.nombre}</h1>
            <p className="dash-subtitle">
              {estudianteMock.carrera} · Grupo {estudianteMock.grupo} ·{" "}
              {estudianteMock.matricula}
            </p>
          </div>

          <div className="dash-periodo">
            <span className="dash-periodo-label">Periodo actual</span>
            <strong>{estudianteMock.periodo}</strong>
          </div>
        </header>

        <section className="dash-progress-card">
          <div className="dash-progress-text">
            <span className="dash-progress-label">Tu progreso</span>
            <strong>
              {evaluados} de {total} evaluaciones completadas
            </strong>
          </div>

          <div className="dash-progress-bar">
            <div
              className="dash-progress-fill"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <div className="dash-progress-info">
            <span> {evaluados} evaluadas</span>
            <span> {pendientes} pendientes</span>
          </div>
        </section>

        <section className="dash-section">
          <div className="dash-section-header">
            <h2>Docentes por evaluar</h2>
            <span className="dash-count">{total} asignaturas</span>
          </div>

          <div className="dash-docentes-grid">
            {docentes.map((docente) => (
              <article
                key={docente.id}
                className={`docente-card ${docente.evaluado ? "evaluado" : ""}`}
              >
                <div className="docente-avatar">{docente.avatar}</div>

                <div className="docente-info">
                  <h3>{docente.nombre}</h3>
                  <p className="docente-asignatura">{docente.asignatura}</p>
                  <span className="docente-grupo">Grupo {docente.grupo}</span>
                </div>

                <div className="docente-accion">
                  {docente.evaluado ? (
                    <span className="badge-evaluado">
                      <CheckIcon />
                      Evaluado
                    </span>
                  ) : (
                    <button
                      className="btn-evaluar"
                      onClick={() => evaluarDocente(docente.id)}
                    >
                      Evaluar
                      <ArrowIcon />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="dash-footer">
           Tus respuestas son anónimas. El docente no sabrá quién lo evaluó.
        </footer>
      </main>
    </div>
  );
}

export default DashEstudiante;