// src/database/models/index.js
const Usuario = require("./usuario");
const Rol = require("./rol");
const Modulo = require("./modulo");
const RolModulo = require("./rolModulo");
const Tiempo = require("./tiempo");
const Proyecto = require("./proyecto");
const Coordinador = require("./coordinador");

// ===== Usuarios ↔ Roles (1:N)
// rolId en Usuario es obligatorio → impedimos borrar un Rol si tiene usuarios
Rol.hasMany(Usuario, {
  foreignKey: { name: "rolId", allowNull: false },
  as: "usuarios",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Usuario.belongsTo(Rol, {
  foreignKey: { name: "rolId", allowNull: false },
  as: "rol",
  onUpdate: "CASCADE",
});

// ===== Roles ↔ Módulos (N:M) vía RolModulo
// Asegúrate de que RolModulo tenga índice único (rolId, moduloId)
Rol.belongsToMany(Modulo, {
  through: RolModulo,
  foreignKey: "rolId",
  otherKey: "moduloId",
  as: "modulos",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Modulo.belongsToMany(Rol, {
  through: RolModulo,
  foreignKey: "moduloId",
  otherKey: "rolId",
  as: "roles",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// ===== Tiempo ↔ Usuario / Proyecto (N:1)
// tiempos dependen de usuario/proyecto → si se borra, cascada
Usuario.hasMany(Tiempo, {
  foreignKey: { name: "usuarioId", allowNull: false },
  as: "tiempos",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Tiempo.belongsTo(Usuario, {
  foreignKey: { name: "usuarioId", allowNull: false },
  as: "usuario",
  onUpdate: "CASCADE",
});

Proyecto.hasMany(Tiempo, {
  foreignKey: { name: "proyectoId", allowNull: false },
  as: "tiempos",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Tiempo.belongsTo(Proyecto, {
  foreignKey: { name: "proyectoId", allowNull: false },
  as: "proyecto",
  onUpdate: "CASCADE",
});

// ===== Coordinador ↔ Proyecto (1:N)
// Si coordinadorId es NOT NULL en Proyecto, bloquea el borrado del coordinador
Coordinador.hasMany(Proyecto, {
  foreignKey: { name: "coordinadorId", allowNull: false },
  as: "proyectos",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT", // o "SET NULL" si permites null en coordinadorId
});
Proyecto.belongsTo(Coordinador, {
  foreignKey: { name: "coordinadorId", allowNull: false },
  as: "coordinador",
  onUpdate: "CASCADE",
});

module.exports = {
  Usuario,
  Rol,
  Modulo,
  RolModulo,
  Tiempo,
  Proyecto,
  Coordinador,
};
