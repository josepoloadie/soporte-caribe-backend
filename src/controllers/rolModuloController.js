const getModulosByRolService = require("../services/roles/getModulosByRol");
const createModulosToRolService = require("../services/roles/createModulosToRol");
const deleteModuloDeRolService = require("../services/roles/deleteModuloDeRol");

const getModulosPorRol = async (req, res) => {
  try {
    const rol = await getModulosByRolService.getModulosByRol(req.params.id);
    res.status(rol.codigo).json(rol.datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno", error });
  }
};

const createModulosToRol = async (req, res) => {
  try {
    const resultado = await createModulosToRolService.createModulosToRol(
      req.params.id,
      req.body.moduloIds
    );
    res.status(resultado.codigo).json(resultado.datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno", error });
  }
};

const deleteModuloDeRol = async (req, res) => {
  try {
    const resultado = await deleteModuloDeRolService.deleteModuloDeRol(
      req.params.id,
      req.params.moduloId
    );
    res.status(resultado.codigo).json(resultado.datos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno", error });
  }
};

module.exports = {
  getModulosPorRol,
  createModulosToRol,
  deleteModuloDeRol,
};
