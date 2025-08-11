// src/services/usuario/usuarioService.js
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Usuario, Rol } = require("../../database/models");

// (Opcional) Si quieres centralizar también esto aquí:
let getModulosByRolExternal = null;
try {
  // evita romper si no existe aún
  ({
    getModulosByRol: getModulosByRolExternal,
  } = require("../roles/getModulosByRol"));
} catch (_) {}

const createUsuario = async (datos) => {
  const rawPass = (datos.contraseña ?? datos.identificacion)?.toString();
  const hashed = await bcrypt.hash(rawPass, 10);

  const mustChange = rawPass === datos.identificacion?.toString();

  const creado = await Usuario.create({
    ...datos,
    contraseña: hashed,
    mustChangePassword: mustChange, // <- clave
    fecha_creacion: new Date(),
  });

  const obj = creado.get({ plain: true });
  delete obj.contraseña;
  return obj;
};

/** Elimina y devuelve el usuario eliminado (sin contraseña) */
const deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;

  const plain = usuario.get({ plain: true });
  delete plain.contraseña;

  await usuario.destroy();
  return plain; // ya sin contraseña
};

/** Lista todos los usuarios con su rol (sin contraseña) */
const getAllUsuarios = () =>
  Usuario.findAll({
    attributes: { exclude: ["contraseña"] },
    include: { model: Rol, as: "rol", attributes: ["id", "nombre"] },
    order: [["nombre", "ASC"]],
  });

/** Paginado con filtros (sin contraseña) */
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

/**
 * Trae usuario por documento.
 * withPassword=true: incluye 'contraseña' (para login).
 * withPassword=false: excluye 'contraseña' (para vistas).
 */
const getUsuarioByDocumento = async (id, { withPassword = false } = {}) => {
  const base = {
    where: { identificacion: id?.toString().trim() }, // por si llega numérico
    include: { model: Rol, as: "rol", attributes: ["id", "nombre"] },
  };

  return withPassword
    ? Usuario.unscoped().findOne(base) // asegura que incluya 'contraseña'
    : Usuario.findOne({ ...base, attributes: { exclude: ["contraseña"] } });
};

const getUsuarioById = (id, { withPassword = false } = {}) => {
  const base = {
    where: { id },
    include: { model: Rol, as: "rol", attributes: ["id", "nombre"] },
  };
  return withPassword
    ? Usuario.unscoped().findOne(base) // incluye 'contraseña'
    : Usuario.findOne({ ...base, attributes: { exclude: ["contraseña"] } });
};

/** Actualiza usuario; re-hashea si cambian contraseña */
const updateUsuario = async (id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;

  const payload = { ...datos };
  if (payload.contraseña) {
    payload.contraseña = await bcrypt.hash(String(payload.contraseña), 10);
  }

  const actualizado = await usuario.update(payload);
  const plain = actualizado.get({ plain: true });
  delete plain.contraseña;
  return plain;
};

// Re-export opcional del service de roles si lo usas en el controller
const getModulosByRol = async (rolId) => {
  if (!getModulosByRolExternal) {
    throw new Error("getModulosByRol no está disponible (no importado)");
  }
  return getModulosByRolExternal(rolId);
};

module.exports = {
  createUsuario,
  deleteUsuario,
  getAllUsuarios,
  getPaginado,
  getUsuarioByDocumento,
  getUsuarioById,
  updateUsuario,
  getModulosByRol, // opcional
};
