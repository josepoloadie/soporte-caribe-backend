const Rol = require("../../database/models/rol");
const RolModulo = require("../../database/models/rolModulo");
const Usuario = require("../../database/models/usuario");

const deleteRol = async (id) => {
  // Verifica si el rol existe
  const rol = await Rol.findByPk(id);
  if (!rol) {
    return { eliminado: false, razon: "Rol no encontrado" };
  }

  // Verifica si hay usuarios asignados a este rol

  const usuariosConRol = await Usuario.findOne({ where: { rolId: id } });

  if (usuariosConRol) {
    return {
      eliminado: false,
      razon: "No se puede eliminar: hay usuarios asignados a este rol",
    };
  }

  // Elimina registros de la tabla intermedia (si no usas onDelete: CASCADE en la DB)
  await RolModulo.destroy({ where: { rolId: id } });

  // Elimina el rol
  await rol.destroy();

  return { eliminado: true, rol };
};

module.exports = { deleteRol };
