const { Op } = require("sequelize");
const Usuario = require("../../database/models/usuario");
const Rol = require("../../database/models/rol");

const getPaginado = async ({ page, limit, identificacion, nombre }) => {
  const offset = (page - 1) * limit;

  const filtros = [];

  if (identificacion) {
    filtros.push({
      identificacion: {
        [Op.like]: `%${identificacion}%`,
      },
    });
  }

  if (nombre) {
    filtros.push({
      nombre: {
        [Op.like]: `%${nombre}%`,
      },
    });
  }

  const where = filtros.length > 0 ? { [Op.or]: filtros } : {};

  const { rows, count } = await Usuario.findAndCountAll({
    where,
    include: {
      model: Rol,
      as: "rol",
      attributes: ["id", "nombre"],
    },
    offset: parseInt(offset),
    limit: parseInt(limit),
    order: [["nombre", "ASC"]],
  });

  return {
    total: count,
    paginaActual: parseInt(page),
    totalPaginas: Math.ceil(count / limit),
    usuarios: rows.map((u) => ({
      id: u.id,
      identificacion: u.identificacion,
      nombre: u.nombre,
      rol: u.rol || "Sin rol",
    })),
  };
};

module.exports = {
  getPaginado,
};
