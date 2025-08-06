const Usuario = require("./usuario");
const Rol = require("./rol");
const Modulo = require("./modulo");
const RolModulo = require("./RolModulo");
const Tiempo = require("./tiempo");
const Proyecto = require("./proyecto");
const Coordinador = require("./coordinador");

// Asociaciones
Rol.hasMany(Usuario, { foreignKey: "rolId", as: "usuarios" });
Usuario.belongsTo(Rol, { foreignKey: "rolId", as: "rol" });
// Relación muchos a muchos: Rol <-> Modulo
Rol.belongsToMany(Modulo, {
  through: RolModulo,
  foreignKey: "rolId",
  otherKey: "moduloId",
  as: "modulos",
  onDelete: "CASCADE",
});

Modulo.belongsToMany(Rol, {
  through: RolModulo,
  foreignKey: "moduloId",
  otherKey: "rolId",
  as: "roles",
  onDelete: "CASCADE",
});

Tiempo.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Usuario.hasMany(Tiempo, { foreignKey: "usuarioId", as: "tiempos" });

Tiempo.belongsTo(Proyecto, { foreignKey: "proyectoId", as: "proyecto" });
Proyecto.hasMany(Tiempo, { foreignKey: "proyectoId", as: "tiempos" });

Proyecto.belongsTo(Coordinador, {
  foreignKey: "coordinadorId",
  as: "coordinador",
});
Coordinador.hasMany(Proyecto, { foreignKey: "coordinadorId", as: "proyectos" });

module.exports = {
  Usuario,
  Rol,
  Modulo,
  RolModulo,
  Tiempo,
  Proyecto,
  Coordinador,
};
