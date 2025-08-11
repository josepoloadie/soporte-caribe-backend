// src/database/models/tiempo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

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

    ingreso: { type: DataTypes.TIME, allowNull: true },
    ingresoLat: {
      type: DataTypes.DECIMAL(9, 6), // ±90.000000
      allowNull: true,
      validate: { min: -90, max: 90 },
    },
    ingresoLng: {
      type: DataTypes.DECIMAL(9, 6), // ±180.000000
      allowNull: true,
      validate: { min: -180, max: 180 },
    },

    salida: { type: DataTypes.TIME, allowNull: true },
    salidaLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -90, max: 90 },
    },
    salidaLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -180, max: 180 },
    },

    ingresoAlmuerzo: { type: DataTypes.TIME, allowNull: true },
    ingresoAlmuerzoLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -90, max: 90 },
    },
    ingresoAlmuerzoLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -180, max: 180 },
    },

    salidaAlmuerzo: { type: DataTypes.TIME, allowNull: true },
    salidaAlmuerzoLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -90, max: 90 },
    },
    salidaAlmuerzoLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: { min: -180, max: 180 },
    },
  },
  {
    tableName: "tiempos",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["usuarioId", "fecha"],
        name: "uq_tiempos_usuario_fecha",
      },
      { fields: ["proyectoId", "fecha"], name: "ix_tiempos_proyecto_fecha" },
      { fields: ["usuarioId"], name: "ix_tiempos_usuario" },
    ],
    defaultScope: { order: [["fecha", "DESC"]] },
  }
);

module.exports = Tiempo;
