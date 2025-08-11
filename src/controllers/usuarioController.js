// src/controllers/usuarioController.js  <-- renombra el archivo o ajusta el require en la ruta
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioService = require("../services/usuario/usuarioService");

const login = async (req, res) => {
  try {
    const { identificacion, contraseña } = req.body || {};
    if (!identificacion || !contraseña) {
      return res
        .status(400)
        .json({ mensaje: "identificacion y contraseña son obligatorios" });
    }

    const usuario = await usuarioService.getUsuarioByDocumento(identificacion, {
      withPassword: true,
    });
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const ok = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!ok)
      return res
        .status(401)
        .json({ mensaje: "Identificación o contraseña incorrecta" });
    if (usuario.status === false)
      return res.status(401).json({ mensaje: "Usuario deshabilitado" });

    // Si debe cambiar contraseña: token corto y bandera
    const basePayload = {
      sub: usuario.id,
      identificacion: usuario.identificacion,
      nombre: usuario.nombre,
      rol: { id: usuario.rol.id, nombre: usuario.rol.nombre },
    };

    if (usuario.mustChangePassword) {
      const token = jwt.sign(
        { ...basePayload, mustChangePassword: true },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );
      return res.status(200).json({
        mensaje: "Debe cambiar la contraseña",
        requirePasswordChange: true,
        token,
        usuario: basePayload,
      });
    }

    // Si NO debe cambiarla, carga módulos y procede normal
    const rolResp = await usuarioService.getModulosByRol(usuario.rolId);
    const modulos = (rolResp?.datos?.modulos || []).map((m) => ({
      id: m.id,
      nombre: m.nombre,
      ruta: m.ruta,
    }));

    const token = jwt.sign(
      { ...basePayload, modulos },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    // marca última conexión
    usuario.ultima_conexion = new Date();
    await usuario.save();

    return res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: { ...basePayload, modulos },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ mensaje: "Error al iniciar sesion" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirm } = req.body || {};
    const userIdFromToken = req.user?.sub; // lo pone el authMiddleware

    if (!oldPassword || !newPassword || !confirm) {
      return res.status(400).json({ mensaje: "Faltan campos" });
    }
    if (newPassword !== confirm) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        mensaje: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    const user = await usuarioService.getUsuarioById(userIdFromToken, {
      withPassword: true,
    });
    if (!user)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const ok = await bcrypt.compare(oldPassword, user.contraseña);
    if (!ok)
      return res.status(401).json({ mensaje: "Contraseña actual incorrecta" });

    const same = await bcrypt.compare(newPassword, user.contraseña);
    if (same)
      return res.status(400).json({
        mensaje: "La nueva contraseña debe ser diferente a la actual",
      });

    await usuarioService.updateUsuario(userIdFromToken, {
      contraseña: newPassword,
      mustChangePassword: false,
      password_changed_at: new Date(),
      ultima_conexion: new Date(),
    });

    return res.status(200).json({ mensaje: "Contraseña actualizada" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ mensaje: "Error al cambiar la contraseña" });
  }
};

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("getAllUsuarios error:", error);
    return res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    return res.status(200).json(usuario);
  } catch (error) {
    console.error("getUsuarioById error:", error);
    return res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};

const createUsuario = async (req, res) => {
  try {
    const creado = await usuarioService.createUsuario(req.body);
    return res.status(201).json(creado);
  } catch (error) {
    console.error("createUsuario error:", error);
    return res.status(500).json({ mensaje: "Error al crear el usuario" });
  }
};

const createUsuarioMasivo = async (req, res) => {
  try {
    const lista = req.body?.usuarios;
    if (!Array.isArray(lista)) {
      return res.status(400).json({ mensaje: "Formato de datos incorrecto" });
    }

    const resultados = { creados: [], errores: [], duplicados: [] };

    for (const item of lista) {
      try {
        const { identificacion, ...resto } = item;
        const existente = await usuarioService.getUsuarioByDocumento(
          identificacion
        );
        if (existente) {
          resultados.duplicados.push({ identificacion });
          continue;
        }

        const creado = await usuarioService.createUsuario({
          identificacion,
          ...resto,
        });
        resultados.creados.push({ identificacion, id: creado.id });
      } catch (err) {
        resultados.errores.push({ item, error: err.message });
      }
    }

    return res.status(200).json({ mensaje: "Carga Completada", resultados });
  } catch (error) {
    console.error("createUsuarioMasivo error:", error);
    return res.status(500).json({ mensaje: "Error al crear usuarios masivos" });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const actualizado = await usuarioService.updateUsuario(
      req.params.id,
      req.body
    );
    if (!actualizado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    return res.status(200).json(actualizado);
  } catch (error) {
    console.error("updateUsuario error:", error);
    return res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const eliminado = await usuarioService.deleteUsuario(req.params.id);
    if (!eliminado)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // si el service retorna instancia destruida, exponla sin contraseña
    const data = eliminado?.dataValues
      ? (() => {
          const o = { ...eliminado.dataValues };
          delete o.contraseña;
          return o;
        })()
      : null;

    return res
      .status(200)
      .json({ mensaje: "Usuario eliminado", usuario: data });
  } catch (error) {
    console.error("deleteUsuario error:", error);
    return res.status(500).json({ mensaje: "Error al eliminar el usuario" });
  }
};

const getUsuariosPaginados = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit ?? "10", 10), 1),
      100
    );
    const identificacion =
      req.query.identificacion?.toString().trim() || undefined;
    const nombre = req.query.nombre?.toString().trim() || undefined;

    const resultado = await usuarioService.getPaginado({
      page,
      limit,
      identificacion,
      nombre,
    });
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("getUsuariosPaginados error:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener usuarios paginados" });
  }
};

module.exports = {
  login,
  changePassword,
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  createUsuarioMasivo,
  getUsuariosPaginados,
};
