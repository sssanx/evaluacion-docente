-- =========================================================
-- ESQUEMA DE BASE DE DATOS - EVALUACIÓN DOCENTE
-- =========================================================

-- Usuarios (estudiantes, docentes, admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('estudiante', 'docente', 'admin')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Periodos académicos
CREATE TABLE IF NOT EXISTS periodos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carreras
CREATE TABLE IF NOT EXISTS carreras (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  clave VARCHAR(20) UNIQUE
);

-- Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nombre_completo VARCHAR(150) NOT NULL,
  carrera_id INTEGER REFERENCES carreras(id),
  grupo VARCHAR(20)
);

-- Docentes
CREATE TABLE IF NOT EXISTS docentes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_completo VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  activo BOOLEAN DEFAULT TRUE
);

-- Asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  clave VARCHAR(20)
);

-- Grupos
CREATE TABLE IF NOT EXISTS grupos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL,
  carrera_id INTEGER REFERENCES carreras(id),
  periodo_id INTEGER REFERENCES periodos(id)
);

-- Asignaciones: qué estudiante evalúa a qué docente
CREATE TABLE IF NOT EXISTS asignaciones (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
  docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
  asignatura_id INTEGER REFERENCES asignaturas(id),
  grupo_id INTEGER REFERENCES grupos(id),
  periodo_id INTEGER REFERENCES periodos(id),
  UNIQUE(estudiante_id, docente_id, asignatura_id, periodo_id)
);

-- Secciones de la encuesta
CREATE TABLE IF NOT EXISTS secciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  orden INTEGER DEFAULT 0
);

-- Preguntas
CREATE TABLE IF NOT EXISTS preguntas (
  id SERIAL PRIMARY KEY,
  seccion_id INTEGER REFERENCES secciones(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE
);

-- Escala de evaluación
CREATE TABLE IF NOT EXISTS escala (
  id SERIAL PRIMARY KEY,
  valor INTEGER NOT NULL UNIQUE,
  etiqueta VARCHAR(50) NOT NULL
);

-- Evaluaciones
CREATE TABLE IF NOT EXISTS evaluaciones (
  id SERIAL PRIMARY KEY,
  asignacion_id INTEGER REFERENCES asignaciones(id) ON DELETE CASCADE,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  promedio_general DECIMAL(4,2),
  comentario TEXT,
  UNIQUE(asignacion_id)
);

-- Respuestas por pregunta
CREATE TABLE IF NOT EXISTS respuestas (
  id SERIAL PRIMARY KEY,
  evaluacion_id INTEGER REFERENCES evaluaciones(id) ON DELETE CASCADE,
  pregunta_id INTEGER REFERENCES preguntas(id),
  valor INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5)
);

-- Retroalimentación
CREATE TABLE IF NOT EXISTS retroalimentacion (
  id SERIAL PRIMARY KEY,
  docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
  periodo_id INTEGER REFERENCES periodos(id),
  texto TEXT NOT NULL,
  autor VARCHAR(150) DEFAULT 'Dirección Académica',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan de acción
CREATE TABLE IF NOT EXISTS plan_accion (
  id SERIAL PRIMARY KEY,
  docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
  periodo_id INTEGER REFERENCES periodos(id),
  area_oportunidad VARCHAR(255) NOT NULL,
  accion_mejora TEXT NOT NULL,
  responsable VARCHAR(150),
  fecha_implementacion DATE,
  fecha_seguimiento DATE,
  evidencia_esperada TEXT,
  estatus VARCHAR(30) DEFAULT 'Pendiente' CHECK (estatus IN ('Pendiente', 'En proceso', 'Completado')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuración de rangos
CREATE TABLE IF NOT EXISTS config_rangos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('fortaleza', 'satisfactorio', 'oportunidad')),
  min_valor DECIMAL(4,2) NOT NULL,
  max_valor DECIMAL(4,2) NOT NULL,
  etiqueta VARCHAR(50) NOT NULL
);

-- =========================================================
-- DATOS INICIALES
-- =========================================================

INSERT INTO escala (valor, etiqueta) VALUES
(1, 'Muy deficiente'),
(2, 'Deficiente'),
(3, 'Regular'),
(4, 'Bueno'),
(5, 'Excelente')
ON CONFLICT (valor) DO NOTHING;

INSERT INTO secciones (nombre, orden) VALUES
('Desempeño docente', 1),
('Metodología y desarrollo de la clase', 2),
('Atención, comunicación y ambiente de aprendizaje', 3);

INSERT INTO preguntas (seccion_id, texto, orden) VALUES
(1, 'El docente domina los temas de la asignatura.', 1),
(1, 'Cumple con el horario establecido de clases.', 2),
(1, 'Presenta el programa de la asignatura al inicio del curso.', 3),
(1, 'Evalúa de forma justa y coherente con lo visto en clase.', 4),
(2, 'Explica los temas con claridad.', 1),
(2, 'Utiliza ejemplos prácticos para reforzar el aprendizaje.', 2),
(2, 'Fomenta la participación de los estudiantes.', 3),
(2, 'Relaciona la teoría con la práctica profesional.', 4),
(2, 'Los materiales y recursos didácticos son adecuados.', 5),
(3, 'Muestra disposición para resolver dudas.', 1),
(3, 'Trata a los estudiantes con respeto.', 2),
(3, 'Genera un ambiente de confianza en el aula.', 3),
(3, 'Da retroalimentación oportuna de las actividades.', 4);

INSERT INTO config_rangos (tipo, min_valor, max_valor, etiqueta) VALUES
('oportunidad', 1.00, 3.49, 'Área de oportunidad'),
('satisfactorio', 3.50, 4.19, 'Satisfactorio'),
('fortaleza', 4.20, 5.00, 'Fortaleza');