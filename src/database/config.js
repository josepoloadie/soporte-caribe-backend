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
    dialect: process.env.DB_DIALECT,
    logging: NODE_ENV !== "production" ? console.log : false,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    timezone: "-05:00", // Hora Colombia
    dialectOptions: {
      // ssl: { require: true, rejectUnauthorized: false }, // si tu hosting lo exige
    },
  }
);

module.exports = sequelize;
