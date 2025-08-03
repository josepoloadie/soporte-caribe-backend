const Modulo = require("../../database/models/modulo");

const getModuloByName = async (nombre) => {
  return await Modulo.findOne({
    where: { nombre },
  });
};

module.exports = { getModuloByName };
