const dotenv = require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("BD SOPORTE CARIBE");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

module.exports = sequelize;

// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.MYSQLDATABASE,
//   process.env.MYSQLUSER,
//   process.env.MYSQLPASSWORD,
//   {
//     host: process.env.MYSQLHOST,
//     port: process.env.MYSQLPORT,
//     dialect: "mysql",
//     logging: false, // cambia a true si quieres ver las queries
//   }
// );

// module.exports = sequelize;
