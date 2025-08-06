const proyectoService = require("../services/proyecto/proyectoService");
const create = async (req, res) => {
  try {
    const proyecto = await proyectoService.createProyecto(req.body);
    res.status(201).json(proyecto);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al crear proyecto", error: err.message });
  }
};

const createMasivo = async (req, res) => {
  try {
    const { proyectos } = req.body;

    if (!Array.isArray(proyectos)) {
      return res
        .status(400)
        .json({ mensaje: "Se espera un arreglo de proyectos" });
    }

    const resultados = {
      exitosos: [],
      errores: [],
    };

    for (const proyecto of proyectos) {
      try {
        const nuevo = await proyectoService.createProyecto(proyecto);
        resultados.exitosos.push(nuevo);
      } catch (error) {
        resultados.errores.push({
          proyecto,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      mensaje: "Carga masiva completada",
      resultados,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        mensaje: "Error al crear proyectos masivos",
        error: err.message,
      });
  }
};

const getAll = async (req, res) => {
  try {
    const lista = await proyectoService.getAllProyectos();
    res.json(lista);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener proyectos", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const proyecto = await proyectoService.getProyectoById(req.params.id);
    if (!proyecto)
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    res.json(proyecto);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al buscar proyecto", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await proyectoService.updateProyecto(
      req.params.id,
      req.body
    );
    if (!actualizado)
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    res.json(actualizado);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar proyecto", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const eliminado = await proyectoService.deleteProyecto(req.params.id);
    if (!eliminado)
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    res.json({ mensaje: "Proyecto eliminado", eliminado });
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar proyecto", error: err.message });
  }
};

module.exports = { create, createMasivo, getAll, getById, update, remove };
