const express = require("express");
const router = express.Router();

const coordinadorController = require("../../../controllers/coordinadorController");
router.post("/", coordinadorController.create);
router.post("/masivo", coordinadorController.createMasivo);
router.get("/", coordinadorController.getAll);
router.get("/:id", coordinadorController.getById);
router.put("/:id", coordinadorController.update);
router.delete("/:id", coordinadorController.remove);

module.exports = router;
