const Modulo = require("../../database/models/modulo");

const createModulo = async (datos) => {
  return Modulo.create(datos);
};

module.exports = { createModulo };
