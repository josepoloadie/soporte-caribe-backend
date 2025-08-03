// src/database/models/usuario.js
const sequelize = require("../config");
const { DataTypes } = require("sequelize");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // genera UUID automático
      primaryKey: true,
    },
    identificacion: {
      type: DataTypes.INTEGER,
      unique: true, // Asegura que la identificación sea única
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles", // nombre de la tabla referenciada
        key: "id",
      },
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
  },
  {
    tableName: "usuarios",
    timestamps: false, // No uses createdAt/updatedAt automáticos
  }
);

module.exports = Usuario;
