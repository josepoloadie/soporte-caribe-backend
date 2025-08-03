const Rol = require("../../database/models/rol");

const getAllRoles = () => Rol.findAll();

module.exports = { getAllRoles };
