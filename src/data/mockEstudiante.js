// =========================================================
// DATOS MOCK — Después se reemplazan por llamadas al backend
// =========================================================

export const estudianteMock = {
  id: 1,
  nombre: "Ana García Hernández",
  matricula: "2023030456",
  carrera: "TSU en Tecnologías de la Información",
  grupo: "A-301",
  periodo: "Septiembre - Diciembre 2026",
};

export const docentesBaseMock = [
  {
    id: 1,
    nombre: "Juan Pérez López",
    asignatura: "Programación Web",
    grupo: "A-301",
    carrera: "TSU en TI",
    avatar: "JP",
  },
  {
    id: 2,
    nombre: "María López Ramírez",
    asignatura: "Base de Datos",
    grupo: "A-301",
    carrera: "TSU en TI",
    avatar: "ML",
  },
  {
    id: 3,
    nombre: "Carlos Ramírez Sánchez",
    asignatura: "Redes de Computadoras",
    grupo: "A-301",
    carrera: "TSU en TI",
    avatar: "CR",
  },
  {
    id: 4,
    nombre: "Laura Fernández Cruz",
    asignatura: "Inglés Técnico",
    grupo: "A-301",
    carrera: "TSU en TI",
    avatar: "LF",
  },
  {
    id: 5,
    nombre: "Roberto Díaz Morales",
    asignatura: "Matemáticas Discretas",
    grupo: "A-301",
    carrera: "TSU en TI",
    avatar: "RD",
  },
];

// =========================================================
// ENCUESTA
// =========================================================

export const encuestaMock = {
  escala: [
    { valor: 1, etiqueta: "Muy deficiente" },
    { valor: 2, etiqueta: "Deficiente" },
    { valor: 3, etiqueta: "Regular" },
    { valor: 4, etiqueta: "Bueno" },
    { valor: 5, etiqueta: "Excelente" },
  ],
  secciones: [
    {
      id: 1,
      nombre: "Desempeño docente",
      preguntas: [
        { id: 101, texto: "El docente domina los temas de la asignatura." },
        { id: 102, texto: "Cumple con el horario establecido de clases." },
        { id: 103, texto: "Presenta el programa de la asignatura al inicio del curso." },
        { id: 104, texto: "Evalúa de forma justa y coherente con lo visto en clase." },
      ],
    },
    {
      id: 2,
      nombre: "Metodología y desarrollo de la clase",
      preguntas: [
        { id: 201, texto: "Explica los temas con claridad." },
        { id: 202, texto: "Utiliza ejemplos prácticos para reforzar el aprendizaje." },
        { id: 203, texto: "Fomenta la participación de los estudiantes." },
        { id: 204, texto: "Relaciona la teoría con la práctica profesional." },
        { id: 205, texto: "Los materiales y recursos didácticos son adecuados." },
      ],
    },
    {
      id: 3,
      nombre: "Atención, comunicación y ambiente de aprendizaje",
      preguntas: [
        { id: 301, texto: "Muestra disposición para resolver dudas." },
        { id: 302, texto: "Trata a los estudiantes con respeto." },
        { id: 303, texto: "Genera un ambiente de confianza en el aula." },
        { id: 304, texto: "Da retroalimentación oportuna de las actividades." },
      ],
    },
  ],
};

// =========================================================
// PERSISTENCIA EN LOCALSTORAGE (temporal — después va al backend)
// =========================================================

const STORAGE_KEY = "evaluaciones_docentes";

// Lee todas las evaluaciones guardadas
export function obtenerEvaluaciones() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Guarda la evaluación de un docente
export function guardarEvaluacion(docenteId, evaluacion) {
  const actuales = obtenerEvaluaciones();
  actuales[docenteId] = {
    ...evaluacion,
    fecha: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actuales));
}

// Verifica si un docente ya fue evaluado
export function estaEvaluado(docenteId) {
  const evaluaciones = obtenerEvaluaciones();
  return Boolean(evaluaciones[docenteId]);
}

// Devuelve los docentes con su estado real (evaluado o no)
export function obtenerDocentesConEstado() {
  const evaluaciones = obtenerEvaluaciones();
  return docentesBaseMock.map((docente) => ({
    ...docente,
    evaluado: Boolean(evaluaciones[docente.id]),
  }));
}

// Limpia todo (útil para pruebas)
export function limpiarEvaluaciones() {
  localStorage.removeItem(STORAGE_KEY);
}