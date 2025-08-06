// In src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Import the database configuration and models
const sequelize = require("./database/config");
const { Usuario, Rol } = require("./database/models/index.js");

// Import the user routes
const v1UserRoutes = require("./v1/routes/usuarios/usuarioRoutes");
const v1ModuloRoutes = require("./v1/routes/modulos/moduloRoutes");
const v1RolRoutes = require("./v1/routes/roles/rolesRoutes");
const v1TiemposRoutes = require("./v1/routes/tiempo/tiempoRoutes.js");
const v1CoordinadorRoutes = require("./v1/routes/coordinador/coordinadorRoutes.js");
const v1ProyectoRoutes = require("./v1/routes/proyectos/proyectoRoutes.js");

const allowedOrigins = [
  "http://localhost:5173", // durante desarrollo
  "https://www.soportecaribe.com", // en producción
  "https://soportecaribe.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🚫 CORS no permitido para:", origin);
        callback(new Error("CORS no permitido para este origen"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    sequelize
      .sync({ alter: true }) // Crea o modifica tabla según el modelo
      .then(() => console.log("🛠️ Base de datos sincronizada"))
      .catch((err) => console.error("❌ Error al sincronizar DB:", err));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Use the v1 router for API versioning
app.get("/", (req, res) => {
  res.send("✅ API Soporte Caribe funcionando");
});

app.use("/v1/usuarios", v1UserRoutes);
app.use("/v1/modulos", v1ModuloRoutes);
app.use("/v1/roles", v1RolRoutes);
app.use("/v1/tiempos", v1TiemposRoutes);
app.use("/v1/coordinadores", v1CoordinadorRoutes);
app.use("/v1/proyectos", v1ProyectoRoutes);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
