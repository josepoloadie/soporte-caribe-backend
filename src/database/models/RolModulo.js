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
    },
    moduloId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "rol_modulo",
    timestamps: false,
  }
);

module.exports = RolModulo;
