const Coordinador = require("../../database/models/coordinador");
const createCoordinador = async (data) => {
  return await Coordinador.create(data);
};

const getAllCoordinadores = async () => {
  return await Coordinador.findAll();
};

const getCoordinadorById = async (id) => {
  return await Coordinador.findByPk(id);
};

const updateCoordinador = async (id, data) => {
  const coordinador = await Coordinador.findByPk(id);
  if (!coordinador) return null;
  return await coordinador.update(data);
};

const deleteCoordinador = async (id) => {
  const coordinador = await Coordinador.findByPk(id);
  if (!coordinador) return null;
  await coordinador.destroy();
  return coordinador;
};

module.exports = {
  createCoordinador,
  getAllCoordinadores,
  getCoordinadorById,
  updateCoordinador,
  deleteCoordinador,
};
