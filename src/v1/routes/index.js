// src/v1/routes/index.js
const express = require("express");
const router = express.Router();

// Healthcheck de la API v1
router.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v1" });
});

// Monta tus routers específicos
router.use("/usuarios", require("./usuarios/usuarioRoutes"));
router.use("/modulos", require("./modulos/moduloRoutes"));
router.use("/roles", require("./roles/rolesRoutes"));
router.use("/tiempos", require("./tiempo/tiempoRoutes"));
router.use("/coordinadores", require("./coordinador/coordinadorRoutes"));
router.use("/proyectos", require("./proyectos/proyectoRoutes"));

// 404 para cualquier ruta /v1/* no encontrada (debe ir al final)
router.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada en v1" });
});

module.exports = router;
