import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import {
  docenteMock,
  seccionesMock,
  preguntasMock,
  fortalezasMock,
  areasOportunidadMock,
  comentariosMock,
  analisisIAMock,
  retroalimentacionMock,
  planAccionMock,
} from "../../data/mockDocente";
import "./DashDocente.css";

// Registrar Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// =========================================================
// ICONOS
// =========================================================

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
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

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 4 4 5-5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z" />
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

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

// =========================================================
// HELPERS
// =========================================================

function formatearPromedio(v) {
  return v.toFixed(2);
}

function colorPorPromedio(promedio) {
  if (promedio >= 4.5) return "excelente";
  if (promedio >= 4.0) return "bueno";
  if (promedio >= 3.5) return "regular";
  return "bajo";
}

// =========================================================
// COMPONENTE
// =========================================================

function DashDocente() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState("resultados");

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  // ========== RADAR: SECCIONES ==========
  const dataRadar = {
    labels: seccionesMock.map((s) => s.nombre),
    datasets: [
      {
        label: "Promedio",
        data: seccionesMock.map((s) => s.promedio),
        backgroundColor: "rgba(121, 27, 56, 0.20)",
        borderColor: "rgba(121, 27, 56, 0.9)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(121, 27, 56, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const opcionesRadar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2c2226",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => `Promedio: ${ctx.parsed.r.toFixed(2)} / 5.00`,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: "#786d72",
          font: { size: 10 },
          backdropColor: "transparent",
        },
        grid: { color: "#eadfe3" },
        angleLines: { color: "#eadfe3" },
        pointLabels: {
          color: "#3d3337",
          font: { size: 11, weight: "600" },
        },
      },
    },
  };

  // ========== BARRAS: PREGUNTAS ==========
  const dataPreguntas = {
    labels: preguntasMock.map((p, i) => `P${i + 1}`),
    datasets: [
      {
        label: "Promedio",
        data: preguntasMock.map((p) => p.promedio),
        backgroundColor: preguntasMock.map((p) =>
          p.promedio >= 4.5
            ? "rgba(45, 134, 89, 0.85)"
            : p.promedio >= 4.0
            ? "rgba(61, 139, 122, 0.85)"
            : p.promedio >= 3.5
            ? "rgba(196, 123, 0, 0.85)"
            : "rgba(184, 52, 47, 0.85)"
        ),
        borderColor: preguntasMock.map((p) =>
          p.promedio >= 4.5
            ? "rgba(45, 134, 89, 1)"
            : p.promedio >= 4.0
            ? "rgba(61, 139, 122, 1)"
            : p.promedio >= 3.5
            ? "rgba(196, 123, 0, 1)"
            : "rgba(184, 52, 47, 1)"
        ),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const opcionesPreguntas = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2c2226",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex;
            return preguntasMock[idx].texto;
          },
          label: (ctx) => `Promedio: ${ctx.parsed.y.toFixed(2)} / 5.00`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { color: "#786d72", font: { size: 11 } },
        grid: { color: "#eadfe3" },
      },
      x: {
        ticks: { color: "#3d3337", font: { size: 11, weight: "600" } },
        grid: { display: false },
      },
    },
  };

  // ========== RENDER ==========

  return (
    <div className="dash-doc-page">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-logo">UTO</div>

        <div className="dash-sidebar-title">
          <span>PORTAL DOCENTE</span>
          <strong>{docenteMock.nombre.split(" ").slice(0, 2).join(" ")}</strong>
        </div>

        <nav className="dash-nav">
          <a
            className={`dash-nav-item ${
              tabActiva === "resultados" ? "active" : ""
            }`}
            onClick={() => setTabActiva("resultados")}
          >
            <span className="dash-nav-icon">
              <ChartIcon />
            </span>
            <span>Resultados</span>
          </a>
          <a
            className={`dash-nav-item ${
              tabActiva === "comentarios" ? "active" : ""
            }`}
            onClick={() => setTabActiva("comentarios")}
          >
            <span className="dash-nav-icon">
              <MessageIcon />
            </span>
            <span>Comentarios</span>
          </a>
          <a
            className={`dash-nav-item ${
              tabActiva === "plan" ? "active" : ""
            }`}
            onClick={() => setTabActiva("plan")}
          >
            <span className="dash-nav-icon">
              <TargetIcon />
            </span>
            <span>Plan de acción</span>
          </a>
        </nav>

        <button className="dash-logout" onClick={cerrarSesion}>
          <span className="dash-nav-icon">
            <LogoutIcon />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {/* HEADER */}
        <header className="dash-header">
          <div>
            <span className="dash-hello">MI REPORTE DE EVALUACIÓN</span>
            <h1>{docenteMock.nombre}</h1>
            <p className="dash-subtitle">
              {docenteMock.asignatura} · {docenteMock.carrera} · Grupo{" "}
              {docenteMock.grupo}
            </p>
            <p className="dash-periodo-mini">
              Periodo: {docenteMock.periodo} · {docenteMock.evaluacionesRecibidas} evaluaciones recibidas
            </p>
          </div>

          <button className="btn-export">
            <DownloadIcon />
            Descargar PDF
          </button>
        </header>

        {/* TABS */}
        <div className="tabs-bar">
          <button
            className={`tab-btn ${tabActiva === "resultados" ? "active" : ""}`}
            onClick={() => setTabActiva("resultados")}
          >
            <ChartIcon />
            Resultados
          </button>
          <button
            className={`tab-btn ${tabActiva === "comentarios" ? "active" : ""}`}
            onClick={() => setTabActiva("comentarios")}
          >
            <MessageIcon />
            Comentarios
          </button>
          <button
            className={`tab-btn ${tabActiva === "plan" ? "active" : ""}`}
            onClick={() => setTabActiva("plan")}
          >
            <TargetIcon />
            Plan de acción
          </button>
        </div>

        {/* ======================= TAB RESULTADOS ======================= */}
        {tabActiva === "resultados" && (
          <>
            {/* PROMEDIO GENERAL */}
            <section className="promedio-hero">
              <div className="promedio-hero-icon">
                <StarIcon />
              </div>
              <div className="promedio-hero-content">
                <span className="promedio-hero-label">
                  Evaluación general
                </span>
                <div className="promedio-hero-valor">
                  <strong>{formatearPromedio(docenteMock.promedioGeneral)}</strong>
                  <span>/ 5.00</span>
                </div>
                <p className="promedio-hero-desc">
                  Basado en {docenteMock.evaluacionesRecibidas} evaluaciones
                  de estudiantes
                </p>
              </div>

              <div className="promedio-hero-badge">
                <CheckIcon />
                Buen desempeño
              </div>
            </section>

            {/* SECCIONES */}
            <section className="secciones-grid">
              {seccionesMock.map((seccion) => (
                <div key={seccion.id} className="seccion-card">
                  <div className="seccion-card-header">
                    <span className="seccion-num">{seccion.id}</span>
                    <span
                      className={`seccion-estado estado-${seccion.estado.toLowerCase()}`}
                    >
                      {seccion.estado}
                    </span>
                  </div>
                  <h3>{seccion.nombre}</h3>
                  <div
                    className={`seccion-promedio ${colorPorPromedio(
                      seccion.promedio
                    )}`}
                  >
                    {formatearPromedio(seccion.promedio)}
                  </div>
                  <div className="seccion-bar">
                    <div
                      className="seccion-bar-fill"
                      style={{
                        width: `${(seccion.promedio / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* GRÁFICAS */}
            <section className="charts-grid">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h2>Comparativo de secciones</h2>
                  <span className="chart-card-sub">Vista radar</span>
                </div>
                <div className="chart-container chart-container-radar">
                  <Radar data={dataRadar} options={opcionesRadar} />
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <h2>Resultados por pregunta</h2>
                  <span className="chart-card-sub">13 preguntas</span>
                </div>
                <div className="chart-container">
                  <Bar data={dataPreguntas} options={opcionesPreguntas} />
                </div>
              </div>
            </section>

            {/* FORTALEZAS Y OPORTUNIDADES */}
            <section className="fortalezas-grid">
              <div className="fortaleza-card fortaleza-card-green">
                <div className="fortaleza-header">
                  <div className="fortaleza-icon fortaleza-icon-green">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3>Fortalezas</h3>
                    <p>Aspectos mejor evaluados</p>
                  </div>
                </div>
                <ul className="fortaleza-list">
                  {fortalezasMock.map((f, i) => (
                    <li key={i}>
                      <span className="bullet bullet-green">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fortaleza-card fortaleza-card-red">
                <div className="fortaleza-header">
                  <div className="fortaleza-icon fortaleza-icon-red">
                    <AlertIcon />
                  </div>
                  <div>
                    <h3>Áreas de oportunidad</h3>
                    <p>Aspectos a mejorar</p>
                  </div>
                </div>
                <ul className="fortaleza-list">
                  {areasOportunidadMock.map((a, i) => (
                    <li key={i}>
                      <span className="bullet bullet-red">!</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ANÁLISIS IA */}
            <section className="ia-card">
              <div className="ia-header">
                <div className="ia-icon">
                  <SparklesIcon />
                </div>
                <div>
                  <h3>Análisis con Inteligencia Artificial</h3>
                  <p>Resumen automático de comentarios de estudiantes</p>
                </div>
              </div>

              <div className="ia-resumen">{analisisIAMock.resumen}</div>

              <div className="ia-temas">
                <span className="ia-temas-label">
                  Temas recurrentes detectados:
                </span>
                <div className="ia-temas-chips">
                  {analisisIAMock.temasRecurrentes.map((tema, i) => (
                    <span key={i} className="ia-chip">
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* RETROALIMENTACIÓN */}
            <section className="retro-card">
              <div className="retro-header">
                <h3>Retroalimentación de Dirección Académica</h3>
                <span className="retro-fecha">{retroalimentacionMock.fecha}</span>
              </div>
              <blockquote className="retro-texto">
                {retroalimentacionMock.texto}
              </blockquote>
              <div className="retro-autor">
                — {retroalimentacionMock.autor}
              </div>
            </section>
          </>
        )}

        {/* ======================= TAB COMENTARIOS ======================= */}
        {tabActiva === "comentarios" && (
          <section className="comentarios-section">
            <div className="comentarios-header">
              <h2>Comentarios de estudiantes</h2>
              <p className="comentarios-sub">
                {comentariosMock.length} comentarios anónimos · Los
                estudiantes no son identificables
              </p>
            </div>

            <div className="comentarios-grid">
              {comentariosMock.map((comentario, i) => (
                <div key={i} className="comentario-card">
                  <div className="comentario-avatar">
                    <MessageIcon />
                  </div>
                  <p className="comentario-texto">{comentario}</p>
                  <span className="comentario-label">Anónimo</span>
                </div>
              ))}
            </div>

            <div className="aviso-anonimato">
              🔒 Los comentarios se muestran sin identificar a los estudiantes
              para proteger su confidencialidad.
            </div>
          </section>
        )}

        {/* ======================= TAB PLAN DE ACCIÓN ======================= */}
        {tabActiva === "plan" && (
          <section className="plan-section">
            <div className="plan-header">
              <h2>Plan de acción</h2>
              <p className="plan-sub">
                Compromisos de mejora derivados de la evaluación docente
              </p>
            </div>

            {planAccionMock.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="plan-card-header">
                  <div className="plan-num">{plan.id}</div>
                  <div className="plan-area">
                    <span className="plan-label">Área de oportunidad</span>
                    <strong>{plan.areaOportunidad}</strong>
                  </div>
                  <span
                    className={`plan-estatus estatus-${plan.estatus
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {plan.estatus}
                  </span>
                </div>

                <div className="plan-accion">
                  <span className="plan-label">Acción de mejora</span>
                  <p>{plan.accion}</p>
                </div>

                <div className="plan-grid">
                  <div className="plan-item">
                    <span className="plan-label">Responsable</span>
                    <p>{plan.responsable}</p>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Implementación</span>
                    <p>{plan.fechaImplementacion}</p>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Seguimiento</span>
                    <p>{plan.fechaSeguimiento}</p>
                  </div>
                </div>

                <div className="plan-evidencia">
                  <span className="plan-label">Evidencia esperada</span>
                  <p>{plan.evidencia}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        <footer className="dash-footer">
          🔒 Reporte confidencial · Dirección Académica · UTO
        </footer>
      </main>
    </div>
  );
}

export default DashDocente;