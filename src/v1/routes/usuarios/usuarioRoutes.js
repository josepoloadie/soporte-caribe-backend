// src/v1/routes/usuarios/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../../../controllers/usuarioController");
const authMiddleware = require("../../../middleware/authMiddleware");

// ====== Rutas públicas ======
router.post("/login", usuarioController.login);
router.get("/paginado", usuarioController.getUsuariosPaginados);

// ====== Aplica auth a lo demás ======
router.use(authMiddleware);
router.patch("/me/password", usuarioController.changePassword); // el propio usuario

// ====== Rutas protegidas (orden: estáticas -> dinámicas) ======
router.post("/masivo", usuarioController.createUsuarioMasivo);
router.get("/", usuarioController.getAllUsuarios);
router.post("/", usuarioController.createUsuario);

// Dinámicas al final
router.get("/:id", usuarioController.getUsuarioById);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
