const Rol = require("../../database/models/rol");

const getRolByNombre = async (nombre) => {
  return await Rol.findOne({
    where: { nombre },
  });
};

module.exports = { getRolByNombre };
