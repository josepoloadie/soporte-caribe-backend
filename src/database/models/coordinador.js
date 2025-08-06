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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "coordinadores",
    timestamps: false,
  }
);

module.exports = Coordinador;
