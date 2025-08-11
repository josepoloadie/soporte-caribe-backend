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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
        len: { args: [2, 100], msg: "El nombre debe tener 2–100 caracteres" },
      },
      set(v) {
        if (typeof v === "string") {
          this.setDataValue("nombre", v.trim().replace(/\s+/g, " "));
        } else {
          this.setDataValue("nombre", v);
        }
      },
    },
  },
  {
    tableName: "roles", // O "rol", pero que sea el MISMO en todo lado
    timestamps: false,
    indexes: [{ unique: true, fields: ["nombre"], name: "uq_roles_nombre" }],
    defaultScope: { order: [["nombre", "ASC"]] },
  }
);

module.exports = Rol;
