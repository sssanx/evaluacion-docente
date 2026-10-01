const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/auth");           // ← LÍNEA NUEVA #1

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(// usa el middleware par las peticiones
  cors({// configura el puerto y no las blooque los navegadores 
    origin: [//los dominios permitidos
      "http://localhost:5173",// app local
      "https://eval-docente-uto.vercel.app",//app en vercel
    ],
    credentials: true,// para enviar cookies o tokens
  })
);

app.use(express.json());                                // ← LÍNEA NUEVA #2
app.use("/api/auth", authRoutes);                       // ← LÍNEA NUEVA #3 (con / al inicio)

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: " API Evaluación Docente funcionando",
    version: "1.0.0",
  });
});

// Ruta para probar conexión a BD
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM usuarios");
    res.json({
      ok: true,
      usuarios: result.rows[0].count,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});