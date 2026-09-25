import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  docentesBaseMock,
  encuestaMock,
  estudianteMock,
  guardarEvaluacion,
  estaEvaluado,
} from "../../data/mockEstudiante";
import "./EvaluarDocente.css";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
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

function EvaluarDocente() {
  const { docenteId } = useParams();
  const navigate = useNavigate();

  // Busca el docente por id
  const docente = useMemo(
    () => docentesBaseMock.find((d) => d.id === parseInt(docenteId)),
    [docenteId]
  );

  // Estados (siempre se declaran, sin importar si el docente existe)
  const [respuestas, setRespuestas] = useState({});
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState([]);

  // Si el docente NO existe → volver al dashboard
  if (!docente) {
    navigate("/estudiante", { replace: true });
    return null;
  }

  // Si ya fue evaluado → mostrar aviso
  if (estaEvaluado(docente.id)) {
    return (
      <div className="eval-ya-evaluado">
        <div className="eval-ya-evaluado-card">
          <div className="eval-ya-icon">✓</div>
          <h2>Ya evaluaste a este docente</h2>
          <p>
            Solo se permite <strong>una evaluación por docente</strong>.
            Tu respuesta anterior ya fue registrada para{" "}
            <strong>{docente.nombre}</strong>.
          </p>
          <button
            className="btn-enviar"
            onClick={() => navigate("/estudiante")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Total de preguntas
  const totalPreguntas = encuestaMock.secciones.reduce(
    (acc, s) => acc + s.preguntas.length,
    0
  );

  const respondidas = Object.keys(respuestas).length;

  const seleccionar = (preguntaId, valor) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
    setErrores((prev) => prev.filter((id) => id !== preguntaId));
  };

  const enviar = () => {
    const faltantes = [];
    encuestaMock.secciones.forEach((seccion) => {
      seccion.preguntas.forEach((p) => {
        if (!respuestas[p.id]) faltantes.push(p.id);
      });
    });

    if (faltantes.length > 0) {
      setErrores(faltantes);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setEnviando(true);

    setTimeout(() => {
      // 💾 Guarda en localStorage
      guardarEvaluacion(docente.id, {
        docenteId: docente.id,
        docenteNombre: docente.nombre,
        asignatura: docente.asignatura,
        respuestas,
        comentario,
      });

      // Redirige al dashboard con alerta
      alert(`¡Gracias! Tu evaluación de ${docente.nombre} fue registrada.`);
      navigate("/estudiante");
    }, 800);
  };

  const cancelar = () => {
    if (respondidas > 0 || comentario) {
      if (
        !window.confirm("¿Seguro que quieres salir? Perderás tus respuestas.")
      ) {
        return;
      }
    }
    navigate("/estudiante");
  };

  return (
    <div className="eval-page">
      {/* HEADER */}
      <header className="eval-header">
        <button className="btn-back" onClick={cancelar}>
          <BackIcon />
          Volver
        </button>

        <div className="eval-header-info">
          <span className="eval-docente-tag">EVALUANDO A</span>
          <h1>{docente.nombre}</h1>
          <p>
            {docente.asignatura} · Grupo {docente.grupo} ·{" "}
            {estudianteMock.periodo}
          </p>
        </div>

        <div className="eval-progress-mini">
          <span>{respondidas}</span>
          <span>/ {totalPreguntas}</span>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="eval-main">
        {errores.length > 0 && (
          <div className="eval-error-box">
            <AlertIcon />
            <div>
              <strong>Faltan {errores.length} preguntas por responder</strong>
              <p>Marca una opción en cada pregunta antes de enviar.</p>
            </div>
          </div>
        )}

        <div className="eval-info-box">
          <h2>Evaluación Docente</h2>
          <p>
            Selecciona una opción del 1 al 5 en cada pregunta. Tu respuesta
            es <strong>anónima y confidencial</strong>: el docente no sabrá
            quién lo evaluó.
          </p>
        </div>

        {encuestaMock.secciones.map((seccion, idx) => (
          <section key={seccion.id} className="eval-seccion">
            <div className="eval-seccion-header">
              <span className="eval-seccion-num">{idx + 1}</span>
              <h2>{seccion.nombre}</h2>
            </div>

            <div className="eval-preguntas">
              {seccion.preguntas.map((pregunta, pIdx) => {
                const tieneError = errores.includes(pregunta.id);
                return (
                  <div
                    key={pregunta.id}
                    className={`eval-pregunta ${tieneError ? "error" : ""}`}
                  >
                    <p className="eval-pregunta-texto">
                      <span className="eval-pregunta-num">{pIdx + 1}.</span>
                      {pregunta.texto}
                    </p>

                    <div className="eval-escala">
                      {encuestaMock.escala.map((opcion) => {
                        const seleccionada =
                          respuestas[pregunta.id] === opcion.valor;
                        return (
                          <button
                            key={opcion.valor}
                            type="button"
                            className={`escala-btn ${
                              seleccionada ? "activo" : ""
                            }`}
                            onClick={() =>
                              seleccionar(pregunta.id, opcion.valor)
                            }
                          >
                            {opcion.valor}
                          </button>
                        );
                      })}
                    </div>

                    <div className="eval-escala-labels">
                      <span>Muy deficiente</span>
                      <span>Excelente</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* COMENTARIOS */}
        <section className="eval-comentarios">
          <div className="eval-seccion-header">
            <span className="eval-seccion-num">💬</span>
            <h2>Comentarios (opcional)</h2>
          </div>
          <p className="eval-comentarios-desc">
            Puedes escribir sugerencias o aspectos que consideres importantes.
            Tu comentario es <strong>anónimo</strong>.
          </p>

          <textarea
            className="eval-textarea"
            placeholder="Escribe aquí tus comentarios sobre el desempeño del docente..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={5}
            maxLength={1000}
          />

          <div className="eval-textarea-counter">
            {comentario.length} / 1000 caracteres
          </div>
        </section>

        {/* ACCIONES */}
        <div className="eval-acciones">
          <button
            type="button"
            className="btn-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn-enviar"
            onClick={enviar}
            disabled={enviando}
          >
            {enviando ? (
              "Enviando..."
            ) : (
              <>
                <CheckIcon />
                Enviar evaluación
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default EvaluarDocente;