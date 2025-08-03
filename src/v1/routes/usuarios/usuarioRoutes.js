const express = require("express");
const router = express.Router();
const usuarioController = require("../../../controllers/usuarioController");
const authMiddleware = require("../../../middleware/authMiddleware");

// Ruta pública
router.post("/login", usuarioController.login);
router.get("/paginado", usuarioController.getUsuariosPaginados);
// Aplica autenticación a todo lo que esté debajo
router.use(authMiddleware);

// Rutas protegidas
router.get("/", usuarioController.getAllUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/", usuarioController.createUsuario);
router.post("/masivo", usuarioController.createUsuarioMasivo);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
