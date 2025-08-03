const Modulo = require("../../database/models/modulo");
const getAllModulos = () => Modulo.findAll();

module.exports = {
  getAllModulos,
};
