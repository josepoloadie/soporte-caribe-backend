// src/controllers/usuariosController.js
const getAllUsuariosService = require("../services/usuario/getAllUsuarios");
const getUsuarioByIdService = require("../services/usuario/getUsuarioById");
const createUsuarioService = require("../services/usuario/createUsuario");
const updateUsuarioService = require("../services/usuario/updateUsuario");
const deleteUsuarioService = require("../services/usuario/deleteUsuario");
const getUsuarioByDocumentoService = require("../services/usuario/getUsuarioByDocumento");
const getModulosByRolService = require("../services/roles/getModulosByRol");
const getUsuariosPaginadosService = require("../services/usuario/getPaginado");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { identificacion, contraseña } = req.body;
  try {
    const usuario = await getUsuarioByDocumentoService.getUsuarioByDocumento(
      identificacion
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res
        .status(401)
        .json({ mensaje: "Identificacion o contraseña incorrecta" });
    }

    if (usuario.status == false) {
      return res.status(401).json({ mensaje: "Usuario deshabilitado" });
    }

    // ✅ Actualizar última conexión
    usuario.ultima_conexion = new Date();
    await usuario.save();

    const rol = await getModulosByRolService.getModulosByRol(usuario.rolId);
    const modulos = rol.datos.modulos.map((m) => m);

    const payload = {
      identificacion: usuario.identificacion,
      nombre: usuario.nombre,
      rol: { id: usuario.rol.id, nombre: usuario.rol.nombre },
      modulos: modulos,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        identificacion: usuario.identificacion,
        nombre: usuario.nombre,
        rol: { id: usuario.rol.id, nombre: usuario.rol.nombre },
        modulos: modulos,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesion", error });
  }
};

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuariosService.getAllUsuarios(req, res);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await getUsuarioByIdService.getUsuarioById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario", error });
  }
};

const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await createUsuarioService.createUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el usuario", error });
  }
};

const createUsuarioMasivo = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.usuarios)) {
      return res.status(400).json({ mensaje: "Formato de datos incorrecto" });
    }

    const data = req.body.usuarios;
    const resultados = {
      creados: [],
      errores: [],
      duplicados: [],
    };

    for (const usuario of data) {
      const { identificacion, ...resto } = usuario;

      try {
        // Evita sobrescribir la variable 'usuario'
        const existente =
          await getUsuarioByDocumentoService.getUsuarioByDocumento(
            identificacion
          );

        if (existente) {
          resultados.duplicados.push({ identificacion });
          continue;
        }

        const id = await createUsuarioService.createUsuario({
          identificacion,
          ...resto,
        });

        resultados.creados.push({ identificacion, id });
      } catch (error) {
        resultados.errores.push({
          usuario, // aquí se refiere correctamente al usuario original del array
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
      mensaje: "Error al crear usuarios masivos",
      error: error.message,
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await updateUsuarioService.updateUsuario(
      req.params.id,
      req.body
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const resultado = await deleteUsuarioService.deleteUsuario(req.params.id);
    if (!resultado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Usuario eliminado",
      usuario: resultado.dataValues || null,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
  }
};

const getUsuariosPaginados = async (req, res) => {
  try {
    const { page = 1, limit = 10, identificacion, nombre } = req.query;
    const resultado = await getUsuariosPaginadosService.getPaginado({
      page,
      limit,
      identificacion,
      nombre,
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuarios paginados",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  createUsuarioMasivo,
  getUsuariosPaginados,
};
