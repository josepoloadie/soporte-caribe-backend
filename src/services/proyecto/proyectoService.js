const Proyecto = require("../../database/models/proyecto");

const createProyecto = async (data) => {
  return await Proyecto.create(data);
};

const getAllProyectos = async () => {
  return await Proyecto.findAll({ include: "coordinador" });
};

const getProyectoById = async (id) => {
  return await Proyecto.findByPk(id, { include: "coordinador" });
};

const updateProyecto = async (id, data) => {
  const proyecto = await Proyecto.findByPk(id);
  if (!proyecto) return null;
  return await proyecto.update(data);
};

const deleteProyecto = async (id) => {
  const proyecto = await Proyecto.findByPk(id);
  if (!proyecto) return null;
  await proyecto.destroy();
  return proyecto;
};

module.exports = {
  createProyecto,
  getAllProyectos,
  getProyectoById,
  updateProyecto,
  deleteProyecto,
};
