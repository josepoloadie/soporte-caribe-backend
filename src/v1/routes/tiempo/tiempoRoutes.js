// src/routes/tiempoRoutes.js
const express = require("express");
const router = express.Router();
const tiempoController = require("../../../controllers/tiempoController");
const authMiddleware = require("../../../middleware/authMiddleware");

router.post("/marcar", tiempoController.marcarTiempo);
router.get("/", tiempoController.getAll);
router.get("/:id", tiempoController.getById);
router.get("/usuario/:usuarioId", tiempoController.getByUsuario);
router.get(
  "/usuario/:usuarioId/fecha/:fecha",
  tiempoController.getByUsuarioAndFecha
);
router.get("/proyecto/:proyectoId", tiempoController.getByProyecto);
router.patch("/:id", tiempoController.update);
router.delete("/:id", tiempoController.remove);

router.use(authMiddleware);

module.exports = router;
