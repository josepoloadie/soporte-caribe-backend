// src/database/config.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("🔌 Conectando a BD Soporte Caribe...");

const requiredEnv = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_DIALECT",
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Falta variable de entorno: ${key}`);
    process.exit(1);
  }
});

const NODE_ENV = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT, // 'mysql'
    logging: NODE_ENV !== "production" ? console.log : false,
    benchmark: NODE_ENV !== "production", // mide duración de queries en dev
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      // freezeTableName: true, // si NO quieres pluralización automática
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: { max: 3 }, // reintentos autocontenidos ante errores transitorios
    timezone: "-05:00", // Hora Colombia (afecta sólo DATETIME, no TIMESTAMP)
    dialectOptions: {
      // dateStrings: true, typeCast: true, // si necesitas strings para fechas
      // ssl: { require: true, rejectUnauthorized: false }, // si tu hosting lo exige
    },
  }
);
module.exports = sequelize;
