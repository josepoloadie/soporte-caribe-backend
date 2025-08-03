const getAllRolsService = require("../services/roles/getAllRoles");
const getRolByIdService = require("../services/roles/getRolById");
const createRolService = require("../services/roles/createRol");
const updateRolService = require("../services/roles/updateRol");
const deleteRolService = require("../services/roles/deleteRol");
const getRolByNombreService = require("../services/roles/getRolByNombre");

const getAllRols = async (req, res) => {
  try {
    const roles = await getAllRolsService.getAllRoles(req, res);
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los roles", error });
  }
};
const getRolById = async (req, res) => {
  try {
    const rol = await getRolByIdService.getRolById(req.params.id);
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el rol", error });
  }
};
const createRol = async (req, res) => {
  try {
    const nuevoRol = await createRolService.createRol(req.body);
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el rol", error });
  }
};
const createRolMasivo = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.roles)) {
      return res.status(400).json({ mensaje: "Formato de datos incorrecto" });
    }

    const data = req.body.roles;
    const resultados = {
      creados: [],
      errores: [],
      duplicados: [],
    };

    for (const rol of data) {
      const { nombre } = rol;

      try {
        const existente = await getRolByNombreService.getRolByNombre(nombre);

        if (existente) {
          resultados.duplicados.push({ nombre });
          continue;
        }

        const id = await createRolService.createRol({ nombre });
        resultados.creados.push({ nombre, id });
      } catch (error) {
        resultados.errores.push({ rol, error: error.message });
      }
    }
    res.status(200).json({
      mensaje: "Carga Completada",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear usuarios masivos",
      error: error.message,
    });
  }
};
const updateRol = async (req, res) => {
  try {
    console.log(req.params.id);

    const rolActualizado = await updateRolService.updateRol(
      req.params.id,
      req.body
    );

    if (!rolActualizado) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.status(200).json(rolActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
  }
};
const deleteRol = async (req, res) => {
  try {
    const resultado = await deleteRolService.deleteRol(req.params.id);
    if (!resultado) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }

    res.status(200).json({
      mensaje: "Rol eliminado",
      rol: resultado.dataValues || null,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el rol", error });
  }
};

module.exports = {
  getAllRols,
  getRolById,
  createRol,
  createRolMasivo,
  updateRol,
  deleteRol,
};
