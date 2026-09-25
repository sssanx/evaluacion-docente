// Datos de prueba — después se reemplazan por llamadas al backend

export const estudianteMock = {
  id: 1,
  nombre: "Ana García Hernández",
  matricula: "2023030456",
  carrera: "TSU en Tecnologías de la Información",
  grupo: "A-301",
  periodo: "Septiembre - Diciembre 2026",
};

export const docentesMock = [
  {
    id: 1,
    nombre: "Juan Pérez López",
    asignatura: "Programación Web",
    grupo: "A-301",
    carrera: "TSU en TI",
    evaluado: false,
    avatar: "JP",
  },
  {
    id: 2,
    nombre: "María López Ramírez",
    asignatura: "Base de Datos",
    grupo: "A-301",
    carrera: "TSU en TI",
    evaluado: true,
    avatar: "ML",
  },
  {
    id: 3,
    nombre: "Carlos Ramírez Sánchez",
    asignatura: "Redes de Computadoras",
    grupo: "A-301",
    carrera: "TSU en TI",
    evaluado: false,
    avatar: "CR",
  },
  {
    id: 4,
    nombre: "Laura Fernández Cruz",
    asignatura: "Inglés Técnico",
    grupo: "A-301",
    carrera: "TSU en TI",
    evaluado: false,
    avatar: "LF",
  },
  {
    id: 5,
    nombre: "Roberto Díaz Morales",
    asignatura: "Matemáticas Discretas",
    grupo: "A-301",
    carrera: "TSU en TI",
    evaluado: true,
    avatar: "RD",
  },
];

// Encuesta de evaluación docente
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