const Rol = require("../../database/models/rol");
const Modulo = require("../../database/models/modulo");

const getModulosByRol = async (rolId) => {
  console.log(rolId);

  const rol = await Rol.findByPk(rolId, {
    include: {
      model: Modulo,
      as: "modulos",
      attributes: ["id", "nombre", "descripcion", "ruta"],
      through: { attributes: [] },
    },
  });

  if (!rol) return { codigo: 404, datos: { mensaje: "Rol no encontrado" } };

  return { codigo: 200, datos: { rol: rol.nombre, modulos: rol.modulos } };
};

module.exports = { getModulosByRol };
