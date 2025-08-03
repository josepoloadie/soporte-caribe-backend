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

// En desarrollo
// app.use(
//   cors({
//     origin: "*", // Cambia según el frontend
//   })
// );

//En producción
app.use(
  cors({
    origin: "https://www.soportecaribe.com",
    credentials: true,
  })
);

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    sequelize
      .sync({ alter: false }) // Crea o modifica tabla según el modelo
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

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
