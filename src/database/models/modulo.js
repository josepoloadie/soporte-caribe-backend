// src/database/models/modulo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Modulo = sequelize.define(
  "Modulo",
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
        len: { args: [2, 120], msg: "El nombre debe tener 2–120 caracteres" },
      },
      set(v) {
        if (typeof v === "string") {
          this.setDataValue("nombre", v.trim().replace(/\s+/g, " "));
        } else {
          this.setDataValue("nombre", v);
        }
      },
    },
    descripcion: {
      type: DataTypes.TEXT, // por si se extiende
      allowNull: true,
    },
    ruta: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // evita duplicar rutas en el menú
      validate: {
        notEmpty: { msg: "La ruta es obligatoria" },
        len: { args: [1, 255], msg: "La ruta debe tener 1–255 caracteres" },
        is: { args: [/^\/[A-Za-z0-9\-_/]*$/], msg: "Formato de ruta inválido" },
      },
      set(v) {
        if (typeof v === "string") {
          // normaliza: quita espacios, colapsa barras
          const limpio = v.trim().replace(/\/{2,}/g, "/");
          // garantiza que empiece con "/"
          this.setDataValue(
            "ruta",
            limpio.startsWith("/") ? limpio : `/${limpio}`
          );
        } else {
          this.setDataValue("ruta", v);
        }
      },
    },
  },
  {
    tableName: "modulos", // 👈 asegúrate de que coincida con tus asociaciones/pivote
    timestamps: false,
    indexes: [
      { unique: true, fields: ["nombre"], name: "uq_modulos_nombre" },
      { unique: true, fields: ["ruta"], name: "uq_modulos_ruta" },
    ],
    defaultScope: {
      order: [["nombre", "ASC"]],
    },
  }
);

module.exports = Modulo;
