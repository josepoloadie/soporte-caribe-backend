// src/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// DB
const sequelize = require("./database/config");
// Importa los modelos para registrar asociaciones si tu "models/index.js" las define en el require.
// (Opcional) Si no es necesario, puedes quitar esta línea.
require("./database/models");

// CORS allowlist
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.soportecaribe.com",
  "https://soportecaribe.com",
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite origin null (Postman/Health checks) SOLO en desarrollo
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        (NODE_ENV !== "production" && origin === null);

      if (isAllowed) return callback(null, true);

      console.log("🚫 CORS no permitido para:", origin);
      return callback(new Error("CORS no permitido para este origen"));
    },
    credentials: true,
  })
);

// Seguridad / utilidades
app.use(helmet());
app.use(compression());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

// Healthcheck rápido
app.get("/", (req, res) => {
  res.send("✅ API Soporte Caribe funcionando");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: NODE_ENV,
    time: new Date().toISOString(),
  });
});

// Rutas v1 centralizadas
app.use("/v1", require("./v1/routes"));

// DB init
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Conexión a la base de datos establecida.");

    if (NODE_ENV !== "production") {
      try {
        await sequelize.sync({ alter: true });
        console.log("🛠️ Base de datos sincronizada (modo desarrollo).");
      } catch (err) {
        console.error("❌ Error al sincronizar DB:", err);
      }
    } else {
      console.log("⏭️ Modo producción: sin sync automático (usa migraciones).");
    }

    app.listen(PORT, () => {
      console.log(`🚀 API escuchando en el puerto ${PORT} (${NODE_ENV})`);
    });
  })
  .catch((err) => {
    console.error("❌ No se pudo conectar a la base de datos:", err);
    process.exit(1);
  });

// Manejador global de errores (al final)
app.use((err, req, res, next) => {
  console.error("💥 Error no manejado:", err.message);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});
