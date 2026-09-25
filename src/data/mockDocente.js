// =========================================================
// MOCK DOCENTE — Datos simulados del reporte individual
// =========================================================

export const docenteMock = {
  id: 1,
  nombre: "Juan Pérez López",
  asignatura: "Programación Web",
  carrera: "TSU en Tecnologías de la Información",
  grupo: "A-301",
  periodo: "Septiembre - Diciembre 2026",
  evaluacionesRecibidas: 28,
  promedioGeneral: 4.32,
};

// Promedios por sección
export const seccionesMock = [
  {
    id: 1,
    nombre: "Desempeño docente",
    promedio: 4.45,
    estado: "Fortaleza",
  },
  {
    id: 2,
    nombre: "Metodología y desarrollo de la clase",
    promedio: 4.20,
    estado: "Satisfactorio",
  },
  {
    id: 3,
    nombre: "Atención, comunicación y ambiente",
    promedio: 4.31,
    estado: "Fortaleza",
  },
];

// Resultados por pregunta
export const preguntasMock = [
  // Sección 1
  { id: 101, seccion: 1, texto: "El docente domina los temas de la asignatura.", promedio: 4.75 },
  { id: 102, seccion: 1, texto: "Cumple con el horario establecido de clases.", promedio: 4.60 },
  { id: 103, seccion: 1, texto: "Presenta el programa de la asignatura al inicio del curso.", promedio: 4.30 },
  { id: 104, seccion: 1, texto: "Evalúa de forma justa y coherente con lo visto en clase.", promedio: 4.15 },

  // Sección 2
  { id: 201, seccion: 2, texto: "Explica los temas con claridad.", promedio: 4.05 },
  { id: 202, seccion: 2, texto: "Utiliza ejemplos prácticos para reforzar el aprendizaje.", promedio: 3.85 },
  { id: 203, seccion: 2, texto: "Fomenta la participación de los estudiantes.", promedio: 4.35 },
  { id: 204, seccion: 2, texto: "Relaciona la teoría con la práctica profesional.", promedio: 4.40 },
  { id: 205, seccion: 2, texto: "Los materiales y recursos didácticos son adecuados.", promedio: 4.35 },

  // Sección 3
  { id: 301, seccion: 3, texto: "Muestra disposición para resolver dudas.", promedio: 4.70 },
  { id: 302, seccion: 3, texto: "Trata a los estudiantes con respeto.", promedio: 4.85 },
  { id: 303, seccion: 3, texto: "Genera un ambiente de confianza en el aula.", promedio: 4.45 },
  { id: 304, seccion: 3, texto: "Da retroalimentación oportuna de las actividades.", promedio: 3.25 },
];

// Fortalezas detectadas automáticamente (top 3)
export const fortalezasMock = [
  "Dominio de los temas de la asignatura",
  "Trato respetuoso hacia los estudiantes",
  "Disposición para resolver dudas",
];

// Áreas de oportunidad detectadas (bottom 3)
export const areasOportunidadMock = [
  "Retroalimentación más oportuna de actividades",
  "Más ejemplos prácticos durante las clases",
  "Explicar los temas con mayor claridad",
];

// Comentarios anónimos
export const comentariosMock = [
  "Excelente docente, siempre dispuesto a resolver dudas.",
  "Domina muy bien la materia y las clases son dinámicas.",
  "Sería bueno que diera más ejemplos prácticos en clase.",
  "Le falta un poco más de retroalimentación en las tareas.",
  "Es muy respetuoso y genera un buen ambiente.",
  "Me gustaría que relacionara más los temas con casos reales.",
  "Muy buen profesor, explica con paciencia.",
  "A veces va muy rápido con los temas.",
];

// Análisis de IA (resumen)
export const analisisIAMock = {
  resumen:
    "Los estudiantes destacan el dominio del tema, la disposición para resolver dudas y el trato respetuoso del docente. Se identifican como principales oportunidades de mejora la retroalimentación más oportuna de actividades y la incorporación de más ejemplos prácticos durante las clases.",
  temasRecurrentes: [
    "Dominio del tema",
    "Disposición para ayudar",
    "Más ejemplos prácticos",
    "Retroalimentación de tareas",
  ],
};

// Retroalimentación de Dirección (opcional, puede venir vacía)
export const retroalimentacionMock = {
  texto:
    "Se reconoce el excelente desempeño del docente en cuanto al dominio de los temas y su relación con los estudiantes. Se sugiere trabajar en la retroalimentación más oportuna de las actividades para fortalecer el proceso de aprendizaje.",
  autor: "Dirección Académica",
  fecha: "20 de Septiembre, 2026",
};

// Plan de acción (opcional)
export const planAccionMock = [
  {
    id: 1,
    areaOportunidad: "Retroalimentación oportuna",
    accion: "Establecer fechas límite para retroalimentar actividades (máximo 5 días).",
    responsable: "Juan Pérez López",
    fechaImplementacion: "15 de Octubre, 2026",
    fechaSeguimiento: "15 de Noviembre, 2026",
    evidencia: "Registro de entrega de retroalimentaciones en plataforma.",
    estatus: "En proceso",
  },
  {
    id: 2,
    areaOportunidad: "Ejemplos prácticos",
    accion: "Incluir al menos 2 ejercicios prácticos por tema en el plan de clase.",
    responsable: "Juan Pérez López",
    fechaImplementacion: "1 de Octubre, 2026",
    fechaSeguimiento: "1 de Noviembre, 2026",
    evidencia: "Planeación didáctica actualizada con ejemplos prácticos.",
    estatus: "Completado",
  },
];