const express = require("express");
const router = express.Router();
const rolController = require("../../../controllers/rolController");
const rolModuloController = require("../../../controllers/rolModuloController");
const authMiddleware = require("../../../middleware/authMiddleware");

//Ruta Publica

// Rutas básicas del rol
router.get("/", rolController.getAllRols);
router.get("/:id", rolController.getRolById);
router.post("/", rolController.createRol);
router.post("/masivo", rolController.createRolMasivo);
router.put("/:id", rolController.updateRol);
router.delete("/:id", rolController.deleteRol);

// Rutas de relación Rol <-> Modulo
router.get("/:id/modulos", rolModuloController.getModulosPorRol);
router.post("/:id/modulos", rolModuloController.createModulosToRol);
router.delete("/:id/modulos/:moduloId", rolModuloController.deleteModuloDeRol);

router.use(authMiddleware);

module.exports = router;
