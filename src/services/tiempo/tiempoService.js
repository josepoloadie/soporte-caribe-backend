const Tiempo = require("../../database/models/tiempo");
const Proyecto = require("../../database/models/proyecto");
const Usuario = require("../../database/models/usuario");
const moment = require("moment");

const includeRelaciones = [
  {
    model: Usuario,
    as: "usuario",
    attributes: ["id", "nombre"],
  },
  {
    model: Proyecto,
    as: "proyecto",
    attributes: ["id", "nombre"],
  },
];
// ✅ Marcar tiempo
const marcarTiempo = async (usuarioId, proyectoId, tipo, latitud, longitud) => {
  const fechaHoy = moment().format("YYYY-MM-DD");
  const horaActual = moment().format("HH:mm:ss");

  const campoHora = tipo;
  const campoLat = `${tipo}Lat`;
  const campoLng = `${tipo}Lng`;

  const usuario = await Usuario.findByPk(usuarioId);
  const proyecto = await Proyecto.findByPk(proyectoId);
  if (!usuario || !proyecto) {
    throw new Error("Usuario o Proyecto no válido");
  }

  let tiempo = await Tiempo.findOne({
    where: { usuarioId, proyectoId, fecha: fechaHoy },
  });

  if (!tiempo) {
    tiempo = await Tiempo.create({
      usuarioId,
      proyectoId,
      fecha: fechaHoy,
      [campoHora]: horaActual,
      [campoLat]: latitud,
      [campoLng]: longitud,
    });
  } else {
    tiempo[campoHora] = horaActual;
    tiempo[campoLat] = latitud;
    tiempo[campoLng] = longitud;
    await tiempo.save();
  }

  return await Tiempo.findByPk(tiempo.id, {
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });
};

// ✅ Obtener todos
const getAll = () =>
  Tiempo.findAll({
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

// ✅ Obtener por ID
const getById = (id) =>
  Tiempo.findByPk(id, {
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

// ✅ Obtener por usuario
const getByUsuario = (usuarioId) =>
  Tiempo.findAll({
    where: { usuarioId },
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

// ✅ Obtener por usuario y fecha
const getByUsuarioAndFecha = (usuarioId, fecha) =>
  Tiempo.findOne({
    where: { usuarioId, fecha },
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

// ✅ Obtener por proyecto
const getByProyecto = (proyectoId) =>
  Tiempo.findAll({
    where: { proyectoId },
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

// ✅ Actualizar parcialmente (PATCH)
const updateParcial = async (id, data) => {
  const tiempo = await Tiempo.findByPk(id);
  if (!tiempo) return null;
  await tiempo.update(data);

  return await Tiempo.findByPk(tiempo.id, {
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });
};

// ✅ Eliminar por ID
const deleteById = async (id) => {
  const tiempo = await Tiempo.findByPk(id, {
    attributes: { exclude: ["usuarioId", "proyectoId"] },
    include: includeRelaciones,
  });

  if (!tiempo) return null;
  await tiempo.destroy();
  return tiempo;
};

module.exports = {
  marcarTiempo,
  getAll,
  getById,
  getByUsuario,
  getByUsuarioAndFecha,
  getByProyecto,
  updateParcial,
  deleteById,
};
