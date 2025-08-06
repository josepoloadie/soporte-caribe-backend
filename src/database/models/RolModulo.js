// src/database/models/rolModulo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const RolModulo = sequelize.define(
  "RolModulo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "rol", // 👈 nombre de la tabla real
        key: "id",
      },
      onDelete: "CASCADE",
    },
    moduloId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "modulo", // 👈 nombre de la tabla real
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "rol_modulo",
    timestamps: false,
  }
);

module.exports = RolModulo;
