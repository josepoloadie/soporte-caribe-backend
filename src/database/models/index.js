const Usuario = require("./usuario");
const Rol = require("./rol");
const Modulo = require("./modulo");
const RolModulo = require("./RolModulo");

// Asociaciones
Rol.hasMany(Usuario, { foreignKey: "rolId", as: "usuarios" });
Usuario.belongsTo(Rol, { foreignKey: "rolId", as: "rol" });
// Relación muchos a muchos: Rol <-> Modulo
Rol.belongsToMany(Modulo, {
  through: RolModulo,
  foreignKey: "rolId",
  otherKey: "moduloId",
  as: "modulos",
});

Modulo.belongsToMany(Rol, {
  through: RolModulo,
  foreignKey: "moduloId",
  otherKey: "rolId",
  as: "roles",
});

module.exports = {
  Usuario,
  Rol,
  Modulo,
  RolModulo,
};
