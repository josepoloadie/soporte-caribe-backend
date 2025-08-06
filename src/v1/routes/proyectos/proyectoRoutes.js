const express = require("express");
const router = express.Router();
const proyectoController = require("../../../controllers/proyectoController");

router.post("/", proyectoController.create);
router.post("/masivo", proyectoController.createMasivo);
router.get("/", proyectoController.getAll);
router.get("/:id", proyectoController.getById);
router.put("/:id", proyectoController.update);
router.delete("/:id", proyectoController.remove);

module.exports = router;
