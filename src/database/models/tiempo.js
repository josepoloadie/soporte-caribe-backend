const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Usuario = require("./usuario");
const Proyecto = require("./proyecto");

const Tiempo = sequelize.define(
  "Tiempo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    proyectoId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ingreso: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    ingresoLat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingresoLng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salida: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    salidaLat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salidaLng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingresoAlmuerzo: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    ingresoAlmuerzoLat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingresoAlmuerzoLng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salidaAlmuerzo: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    salidaAlmuerzoLat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salidaAlmuerzoLng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "tiempos",
    timestamps: false,
  }
);

module.exports = Tiempo;
