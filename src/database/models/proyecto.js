// src/database/models/proyecto.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Proyecto = sequelize.define(
  "Proyecto",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
        len: { args: [2, 160], msg: "El nombre debe tener 2–160 caracteres" },
      },
      set(v) {
        if (typeof v === "string") {
          this.setDataValue("nombre", v.trim().replace(/\s+/g, " "));
        } else {
          this.setDataValue("nombre", v);
        }
      },
    },
    coordinadorId: {
      type: DataTypes.UUID,
      allowNull: false, // si prefieres permitir null, cámbialo y ajusta la asociación
    },
  },
  {
    tableName: "proyectos",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["nombre"], name: "uq_proyectos_nombre" },
      { fields: ["coordinadorId"], name: "ix_proyectos_coordinadorId" },
    ],
    defaultScope: {
      order: [["nombre", "ASC"]],
    },
  }
);

module.exports = Proyecto;
