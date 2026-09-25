import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import {
  direccionMock,
  kpisMock,
  promediosPorSeccionMock,
  distribucionNivelesMock,
  docentesAdminMock,
} from "../../data/mockAdmin";
import "./DashDireccion.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// =========================================================
// ICONOS
// =========================================================

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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

// =========================================================
// HELPERS
// =========================================================

function formatearPromedio(valor) {
  return valor.toFixed(2);
}

function colorPromedio(promedio) {
  if (promedio >= 4.5) return "excelente";
  if (promedio >= 4.0) return "bueno";
  if (promedio >= 3.5) return "regular";
  return "bajo";
}

// =========================================================
// COMPONENTE
// =========================================================

function DashDireccion() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("todas");

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  // Filtra docentes
  const docentesFiltrados = useMemo(() => {
    return docentesAdminMock.filter((d) => {
      const coincideBusqueda =
        d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.asignatura.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCarrera =
        filtroCarrera === "todas" || d.carrera === filtroCarrera;
      return coincideBusqueda && coincideCarrera;
    });
  }, [busqueda, filtroCarrera]);

  // Top 5 docentes (mejores)
  const topDocentes = useMemo(() => {
    return [...docentesAdminMock]
      .sort((a, b) => b.promedioGeneral - a.promedioGeneral)
      .slice(0, 5);
  }, []);

  // Bottom 5 docentes (oportunidades)
  const bottomDocentes = useMemo(() => {
    return [...docentesAdminMock]
      .sort((a, b) => a.promedioGeneral - b.promedioGeneral)
      .slice(0, 5);
  }, []);

  // Cálculos para KPIs
  const porcentajeParticipacion = Math.round(
    (kpisMock.estudiantesParticiparon / kpisMock.totalEstudiantes) * 100
  );

  // ============ DATASETS PARA CHARTS ============

  // Gráfica de barras: promedio por sección
  const dataPromediosPorSeccion = {
    labels: promediosPorSeccionMock.map((s) => s.seccion),
    datasets: [
      {
        label: "Promedio",
        data: promediosPorSeccionMock.map((s) => s.promedio),
        backgroundColor: [
          "rgba(121, 27, 56, 0.85)",
          "rgba(139, 41, 71, 0.85)",
          "rgba(146, 43, 73, 0.85)",
        ],
        borderColor: [
          "rgba(121, 27, 56, 1)",
          "rgba(139, 41, 71, 1)",
          "rgba(146, 43, 73, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const opcionesPromediosPorSeccion = {
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

  // Doughnut: distribución de niveles
  const dataDistribucion = {
    labels: distribucionNivelesMock.map((n) => n.nivel),
    datasets: [
      {
        data: distribucionNivelesMock.map((n) => n.cantidad),
        backgroundColor: distribucionNivelesMock.map((n) => n.color),
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const opcionesDistribucion = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#3d3337",
          font: { size: 11, weight: "600" },
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#2c2226",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} docentes`,
        },
      },
    },
  };

  // Top 5 docentes (barras horizontales)
  const dataTopDocentes = {
    labels: topDocentes.map((d) => d.nombre.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Promedio",
        data: topDocentes.map((d) => d.promedioGeneral),
        backgroundColor: "rgba(45, 134, 89, 0.80)",
        borderColor: "rgba(45, 134, 89, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Bottom 5 docentes (barras horizontales)
  const dataBottomDocentes = {
    labels: bottomDocentes.map((d) =>
      d.nombre.split(" ").slice(0, 2).join(" ")
    ),
    datasets: [
      {
        label: "Promedio",
        data: bottomDocentes.map((d) => d.promedioGeneral),
        backgroundColor: "rgba(184, 52, 47, 0.80)",
        borderColor: "rgba(184, 52, 47, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const opcionesRanking = {
    indexAxis: "y",
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
          label: (ctx) => `Promedio: ${ctx.parsed.x.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        ticks: { color: "#786d72", font: { size: 10 } },
        grid: { color: "#eadfe3" },
      },
      y: {
        ticks: { color: "#3d3337", font: { size: 11, weight: "600" } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="dash-dir-page">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-logo">UTO</div>

        <div className="dash-sidebar-title">
          <span>PANEL ADMINISTRATIVO</span>
          <strong>Dirección Académica</strong>
        </div>

        <nav className="dash-nav">
          <a className="dash-nav-item active">
            <span className="dash-nav-icon">
              <ChartIcon />
            </span>
            <span>Dashboard</span>
          </a>
          <a className="dash-nav-item">
            <span className="dash-nav-icon">
              <UsersIcon />
            </span>
            <span>Docentes</span>
          </a>
          <a className="dash-nav-item">
            <span className="dash-nav-icon">
              <StarIcon />
            </span>
            <span>Evaluaciones</span>
          </a>
          <a className="dash-nav-item">
            <span className="dash-nav-icon">
              <ShieldIcon />
            </span>
            <span>Reportes</span>
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
            <span className="dash-hello">DIRECCIÓN ACADÉMICA</span>
            <h1>Panel de Resultados</h1>
            <p className="dash-subtitle">
              {direccionMock.periodo} · {direccionMock.carrera}
            </p>
          </div>

          <div className="dash-header-actions">
            <button className="btn-export">
              <DownloadIcon />
              Descargar Excel
            </button>
            <button className="btn-export btn-export-primary">
              <DownloadIcon />
              Descargar PDF
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section className="kpis-grid">
          <div className="kpi-card">
            <div className="kpi-icon kpi-icon-wine">
              <UsersIcon />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Docentes evaluados</span>
              <strong className="kpi-value">
                {kpisMock.docentesEvaluados}
                <span className="kpi-total">/ {kpisMock.totalDocentes}</span>
              </strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon kpi-icon-blue">
              <UsersIcon />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Estudiantes participantes</span>
              <strong className="kpi-value">
                {kpisMock.estudiantesParticiparon}
                <span className="kpi-total">/ {kpisMock.totalEstudiantes}</span>
              </strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon kpi-icon-green">
              <ChartIcon />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Participación</span>
              <strong className="kpi-value">{porcentajeParticipacion}%</strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon kpi-icon-amber">
              <StarIcon />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Promedio institucional</span>
              <strong className="kpi-value">
                {formatearPromedio(kpisMock.promedioInstitucional)}
                <span className="kpi-total">/ 5.00</span>
              </strong>
            </div>
          </div>
        </section>

        {/* GRÁFICAS — FILA 1 */}
        <section className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h2>Promedio por sección</h2>
              <span className="chart-card-sub">Institucional</span>
            </div>
            <div className="chart-container">
              <Bar
                data={dataPromediosPorSeccion}
                options={opcionesPromediosPorSeccion}
              />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h2>Distribución de docentes</h2>
              <span className="chart-card-sub">Por nivel de evaluación</span>
            </div>
            <div className="chart-container">
              <Doughnut
                data={dataDistribucion}
                options={opcionesDistribucion}
              />
            </div>
          </div>
        </section>

        {/* GRÁFICAS — FILA 2 */}
        <section className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h2>Top 5 docentes</h2>
              <span className="chart-card-sub">Mejores resultados</span>
            </div>
            <div className="chart-container">
              <Bar data={dataTopDocentes} options={opcionesRanking} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h2>Docentes con áreas de oportunidad</h2>
              <span className="chart-card-sub">Menores resultados</span>
            </div>
            <div className="chart-container">
              <Bar data={dataBottomDocentes} options={opcionesRanking} />
            </div>
          </div>
        </section>

        {/* TABLA DE DOCENTES */}
        <section className="tabla-section">
          <div className="tabla-header">
            <div>
              <h2>Resultados por docente</h2>
              <p className="tabla-sub">
                {docentesFiltrados.length} docentes · Haz clic en un docente
                para ver su reporte individual
              </p>
            </div>

            <div className="tabla-filtros">
              <div className="search-box">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar docente o asignatura..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <select
                className="filtro-select"
                value={filtroCarrera}
                onChange={(e) => setFiltroCarrera(e.target.value)}
              >
                <option value="todas">Todas las carreras</option>
                <option value="TSU en TI">TSU en TI</option>
              </select>
            </div>
          </div>

          <div className="tabla-wrapper">
            <table className="docentes-table">
              <thead>
                <tr>
                  <th>Docente</th>
                  <th>Asignatura</th>
                  <th>Grupo</th>
                  <th>Evaluaciones</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {docentesFiltrados.map((docente) => (
                  <tr key={docente.id}>
                    <td>
                      <div className="docente-cell">
                        <div className="docente-cell-avatar">
                          {docente.nombre
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <strong>{docente.nombre}</strong>
                      </div>
                    </td>
                    <td>{docente.asignatura}</td>
                    <td>{docente.grupo}</td>
                    <td>
                      <span className="badge-eval">
                        {docente.evaluaciones}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`promedio-cell ${colorPromedio(
                          docente.promedioGeneral
                        )}`}
                      >
                        {formatearPromedio(docente.promedioGeneral)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`estado-badge estado-${docente.estado.toLowerCase()}`}
                      >
                        {docente.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {docentesFiltrados.length === 0 && (
              <div className="tabla-vacia">
                No se encontraron docentes con esos filtros.
              </div>
            )}
          </div>
        </section>

        <footer className="dash-footer">
          🔒 Los resultados mostrados son consolidados y anónimos.
        </footer>
      </main>
    </div>
  );
}

export default DashDireccion;