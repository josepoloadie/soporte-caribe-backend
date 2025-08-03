const Modulo = require("../../database/models/modulo");
const getModuloById = (id) => Modulo.findByPk(id);
module.exports = {
  getModuloById,
};
