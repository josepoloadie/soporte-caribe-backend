const Rol = require("../../database/models/rol");
const Modulo = require("../../database/models/modulo");

const deleteModuloDeRol = async (rolId, moduloId) => {
  const rol = await Rol.findByPk(rolId);
  if (!rol) return { codigo: 404, datos: { mensaje: "Rol no encontrado" } };

  await rol.removeModulo(moduloId);
  return { codigo: 200, datos: { mensaje: "Módulo eliminado del rol" } };
};

module.exports = {
  deleteModuloDeRol,
};
