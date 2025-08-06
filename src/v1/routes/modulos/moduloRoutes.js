const express = require("express");
const router = express.Router();
const moduloController = require("../../../controllers/moduloController");
const authMiddleware = require("../../../middleware/authMiddleware");

//Rutas Publicas
router.get("/", moduloController.getAllModulos);
router.get("/:id", moduloController.getModuloById);
router.post("/", moduloController.createModulo);
router.post("/masivo", moduloController.createModuloMasivo);
router.put("/:id", moduloController.updateModulo);
router.delete("/:id", moduloController.deleteModulo);
router.use(authMiddleware);
// Rutas protegidas con autenticación por token
// router.get("/", authMiddleware, moduloController.getAllModulos);
// router.get("/:id", authMiddleware, moduloController.getModuloById);
// router.post("/", authMiddleware, moduloController.createModulo);
// router.post("/masivo", authMiddleware, moduloController.createModuloMasivo);
// router.put("/:id", authMiddleware, moduloController.updateModulo);
// router.delete("/:id", authMiddleware, moduloController.deleteModulo);

module.exports = router;
