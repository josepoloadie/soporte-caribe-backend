// src/database/models/modulo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Modulo = sequelize.define(
  "Modulo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // genera UUID automático
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "modulos",
    timestamps: false,
  }
);

module.exports = Modulo;
