const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Coordinador = require("../models/coordinador");
const Proyecto = sequelize.define(
  "Proyecto",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    coordinadorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Coordinador,
        key: "id",
      },
    },
  },
  {
    tableName: "proyectos",
    timestamps: false,
  }
);

module.exports = Proyecto;
