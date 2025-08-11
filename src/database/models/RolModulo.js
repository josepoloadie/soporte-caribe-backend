// src/database/models/rolModulo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const RolModulo = sequelize.define(
  "RolModulo",
  {
    // (Opcional) Puedes omitir id y usar PK compuesta (rolId, moduloId).
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    moduloId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "rol_modulo",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["rolId", "moduloId"],
        name: "uq_rol_modulo_rolId_moduloId",
      },
      { fields: ["rolId"], name: "ix_rol_modulo_rolId" },
      { fields: ["moduloId"], name: "ix_rol_modulo_moduloId" },
    ],
  }
);

module.exports = RolModulo;
