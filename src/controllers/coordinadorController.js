const coordinadorService = require("../services/coordinador/coordinador");

const create = async (req, res) => {
  try {
    const coordinador = await coordinadorService.createCoordinador(req.body);
    res.status(201).json(coordinador);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ mensaje: "El nombre del coordinador ya existe" });
    }
    res
      .status(500)
      .json({ mensaje: "Error al crear coordinador", error: err.message });
  }
};

const createMasivo = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ mensaje: "Se espera un arreglo de coordinadores" });
    }
    const { coordinadores } = req.body;

    if (!Array.isArray(coordinadores)) {
      return res
        .status(400)
        .json({ mensaje: "Se espera un arreglo de coordinadores" });
    }

    const resultados = {
      exitosos: [],
      errores: [],
    };

    for (const coordinador of coordinadores) {
      try {
        const nuevo = await coordinadorService.createCoordinador(coordinador);
        resultados.exitosos.push(nuevo);
      } catch (error) {
        resultados.errores.push({
          coordinador,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      mensaje: "Carga masiva completada",
      resultados,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: "Error al crear coordinadores masivos",
      error: err.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const lista = await coordinadorService.getAllCoordinadores();
    res.json(lista);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener coordinadores", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const coordinador = await coordinadorService.getCoordinadorById(
      req.params.id
    );
    if (!coordinador) {
      return res.status(404).json({ mensaje: "Coordinador no encontrado" });
    }
    res.json(coordinador);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al buscar coordinador", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await coordinadorService.updateCoordinador(
      req.params.id,
      req.body
    );
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Coordinador no encontrado" });
    }
    res.json(actualizado);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar coordinador", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const eliminado = await coordinadorService.deleteCoordinador(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Coordinador no encontrado" });
    }
    res.json({ mensaje: "Coordinador eliminado", eliminado });
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar coordinador", error: err.message });
  }
};

module.exports = { create, createMasivo, getAll, getById, update, remove };
