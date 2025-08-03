const Usuario = require("../../database/models/usuario");
const Rol = require("../../database/models/rol");
const getUsuarioById = (id) =>
  Usuario.findByPk(id, {
    include: {
      model: Rol,
      as: "rol",
      attributes: ["nombre"],
    },
  });
module.exports = {
  getUsuarioById,
};
