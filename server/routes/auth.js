// Importa Express (framework para crear el servidor y las rutas)
const express = require("express");

// Importa bcrypt (verifica contraseñas encriptadas)
const bcrypt = require("bcryptjs");

// Importa JWT (crea y verifica tokens de acceso)
const jwt = require("jsonwebtoken");

// Importa la conexión a PostgreSQL
const pool = require("../config/db");

// Crea un router para agrupar las rutas de autenticación
const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  // async: función que puede tardar (consulta BD)
  // req: petición (datos del frontend)
  // res: respuesta (lo que devolvemos)

  // Extrae email, password y rol del CUERPO de la petición
  const { email, password, rol } = req.body;

  try {
    // 1. Buscar al usuario en la BD por email y rol
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND rol = $2 AND activo = TRUE",
      [email, rol]
    );
    // await: espera a que la BD responda
    // pool.query: ejecuta el SQL en la BD
    // result: guarda la respuesta de la BD

    // Si no se encontró ningún usuario
    if (result.rows.length === 0) {
      // result.rows: lista de filas
      // .length: cuántas filas hay
      // return: sale de la función inmediatamente
      // res.status(401): código HTTP 401 (no autorizado)
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Guarda el primer usuario del resultado (posición 0 del array)
    const usuario = result.rows[0];

    // 2. Compara la contraseña escrita con la encriptada en la BD
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    // Si la contraseña NO coincide (el ! significa "no")
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 3. Genera un token JWT firmado
    const token = jwt.sign(
      // Datos que van DENTRO del token (payload)
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      // Clave secreta para firmar (viene del .env)
      process.env.JWT_SECRET,
      // Tiempo de expiración (7 días por ejemplo)
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Devuelve el token y los datos del usuario
    res.json({
      token, // El pase de acceso generado
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    // catch: red de seguridad. Si algo falla en el try, cae aquí.
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Exporta el router para que index.js lo use
module.exports = router;