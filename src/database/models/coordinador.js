// src/database/models/coordinador.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Coordinador = sequelize.define(
  "Coordinador",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
        len: { args: [2, 120], msg: "El nombre debe tener 2-120 caracteres" },
      },
      set(value) {
        if (typeof value === "string") {
          // trim + colapsar espacios internos
          const limpio = value.trim().replace(/\s+/g, " ");
          this.setDataValue("nombre", limpio);
        } else {
          this.setDataValue("nombre", value);
        }
      },
    },
  },
  {
    tableName: "coordinadores",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["nombre"], name: "uq_coordinadores_nombre" },
    ],
    defaultScope: {
      order: [["nombre", "ASC"]],
    },
  }
);

// (Opcional) Asociaciones, si aplica:
// Coordinador.hasMany(Proyectos, { foreignKey: "coordinadorId" });

module.exports = Coordinador;
