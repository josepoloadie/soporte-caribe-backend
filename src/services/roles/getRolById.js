const Rol = require("../../database/models/rol");

const getRolById = (id) => Rol.findByPk(id);
module.exports = { getRolById };
