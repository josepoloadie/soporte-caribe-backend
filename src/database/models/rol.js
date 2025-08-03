// src/database/models/rol.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Rol = sequelize.define(
  "Rol",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "roles", // <- pluralizado aquí
    timestamps: false,
  }
);

module.exports = Rol;
