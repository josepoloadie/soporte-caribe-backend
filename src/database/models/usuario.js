// src/database/models/usuario.js
const sequelize = require("../config");
const { DataTypes } = require("sequelize");

const bcrypt = require("bcryptjs");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Mejor string con validación numérica
    identificacion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "La identificación es obligatoria" },
        isNumeric: { msg: "La identificación debe ser numérica" },
        len: {
          args: [4, 20],
          msg: "La identificación debe tener 4–20 dígitos",
        },
      },
      set(v) {
        this.setDataValue(
          "identificacion",
          typeof v === "string" ? v.trim() : String(v)
        );
      },
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
        len: { args: [2, 150], msg: "El nombre debe tener 2–150 caracteres" },
      },
      set(v) {
        this.setDataValue(
          "nombre",
          typeof v === "string" ? v.trim().replace(/\s+/g, " ") : v
        );
      },
    },

    correo: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El correo es obligatorio" },
        isEmail: { msg: "Correo inválido" },
      },
      set(v) {
        this.setDataValue(
          "correo",
          typeof v === "string" ? v.trim().toLowerCase() : v
        );
      },
    },

    // Teléfono como string para no perder ceros
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El teléfono es obligatorio" },
        is: { args: [/^[0-9+\-()\s]{6,20}$/], msg: "Teléfono inválido" },
      },
      set(v) {
        this.setDataValue(
          "telefono",
          typeof v === "string" ? v.trim() : String(v)
        );
      },
    },

    contraseña: {
      type: DataTypes.STRING, // hash
      allowNull: false,
    },

    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      // No declares references aquí; las FKs las crean las asociaciones
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    ultima_conexion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    password_changed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["contraseña"] },
      order: [["nombre", "ASC"]],
    },
    scopes: {
      withPassword: {}, // para login: Usuario.scope("withPassword").findOne(...)
    },
    indexes: [
      {
        unique: true,
        fields: ["identificacion"],
        name: "uq_usuarios_identificacion",
      },
      { unique: true, fields: ["correo"], name: "uq_usuarios_correo" },
      { fields: ["rolId"], name: "ix_usuarios_rolId" },
      { fields: ["status"], name: "ix_usuarios_status" },
    ],
    hooks: {
      async beforeCreate(user) {
        if (user.contraseña && !user.contraseña.startsWith("$2")) {
          user.contraseña = await bcrypt.hash(user.contraseña, 10);
        }
      },
      async beforeUpdate(user) {
        if (
          user.changed("contraseña") &&
          user.contraseña &&
          !user.contraseña.startsWith("$2")
        ) {
          user.contraseña = await bcrypt.hash(user.contraseña, 10);
        }
      },
    },
  }
);

// Evitar exponer la contraseña incluso si usan scope withPassword y luego serializan:
Usuario.prototype.toJSON = function () {
  const obj = { ...this.get() };
  delete obj.contraseña;
  return obj;
};

module.exports = Usuario;
