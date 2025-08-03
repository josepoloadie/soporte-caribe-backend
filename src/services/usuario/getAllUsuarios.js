const Usuario = require("../../database/models/usuario");
const Rol = require("../../database/models/rol");
const getAllUsuarios = () =>
  Usuario.findAll({
    include: {
      model: Rol,
      as: "rol",
      attributes: ["nombre"],
    },
  });

module.exports = {
  getAllUsuarios,
};
