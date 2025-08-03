const Rol = require("../../database/models/rol");

const createRol = async (datos) => {
  return Rol.create(datos);
};

module.exports = { createRol };
