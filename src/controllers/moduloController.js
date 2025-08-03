// src/controllers/moduloController.js
const getAllModulosService = require("../services/modulo/getAllModulos");
const getModuloByIdService = require("../services/modulo/getModuloById");
const getModuloByNameService = require("../services/modulo/getModuloByName");
const createModuloService = require("../services/modulo/createModulo");
const updateModuloService = require("../services/modulo/updateModulo");
const deleteModuloService = require("../services/modulo/deleteModulo");

const getAllModulos = async (req, res) => {
  try {
    const modulo = await getAllModulosService.getAllModulos(req, res);
    res.status(200).json(modulo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los modulos", error });
  }
};

const getModuloById = async (req, res) => {
  try {
    const modulo = await getModuloByIdService.getModuloById(req.params.id);
    if (!modulo) {
      return res.status(404).json({ mensaje: "Modulo no encontrado" });
    }
    res.status(200).json(modulo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el Modulo", error });
  }
};

const createModulo = async (req, res) => {
  try {
    const nuevoModulo = await createModuloService.createModulo(req.body);
    res.status(201).json(nuevoModulo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el modulo", error });
  }
};

const createModuloMasivo = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.modulos)) {
      return res.status(400).json({ mensaje: "Formato de datos incorrecto" });
    }

    const data = req.body.modulos;
    const resultados = {
      creados: [],
      errores: [],
      duplicados: [],
    };

    for (const modulo of data) {
      const { nombre, ...resto } = modulo;

      try {
        // Evita sobrescribir la variable 'usuario'
        const existente = await getModuloByNameService.getModuloByName(nombre);
        console.log(existente);

        if (existente) {
          resultados.duplicados.push(modulo);
          continue;
        }

        const id = await createModuloService.createModulo({
          nombre,
          ...resto,
        });

        resultados.creados.push({ nombre, id });
      } catch (error) {
        resultados.errores.push({
          modulo, // aquí se refiere correctamente al usuario original del array
          error: error.message,
        });
      }
    }

    res.status(200).json({
      mensaje: "Carga Completada",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear modulos masivos",
      error: error.message,
    });
  }
};

const updateModulo = async (req, res) => {
  try {
    const moduloActualizado = await updateModuloService.updateModulo(
      req.params.id,
      req.body
    );
    if (!moduloActualizado) {
      return res.status(404).json({ mensaje: "Modulo no encontrado" });
    }
    res.status(200).json(moduloActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el modulo", error });
  }
};

const deleteModulo = async (req, res) => {
  try {
    const resultado = await deleteModuloService.deleteModulo(req.params.id);
    if (!resultado) {
      return res.status(404).json({ mensaje: "Modulo no encontrado" });
    }
    console.log(resultado.dataValues);

    res.status(200).json({
      mensaje: "Modulo eliminado",
      usuario: resultado.dataValues || null,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el modulo", error });
  }
};

module.exports = {
  getAllModulos,
  getModuloById,
  createModulo,
  createModuloMasivo,
  updateModulo,
  deleteModulo,
};
