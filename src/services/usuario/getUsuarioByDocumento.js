const Usuario = require("../../database/models/usuario");
const Rol = require("../../database/models/rol");
const getUsuarioByDocumento = async (id) => {
  return await Usuario.findOne({
    where: { identificacion: id },
    include: {
      model: Rol,
      as: "rol",
      attributes: ["id", "nombre"],
    },
  });
};

module.exports = { getUsuarioByDocumento };
