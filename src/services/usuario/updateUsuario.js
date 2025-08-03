const bcrypt = require("bcrypt");
const Usuario = require("../../database/models/usuario");
const updateUsuario = async (id, datos) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    if (datos.contraseña) {
      datos.contraseña = await bcrypt.hash(datos.contraseña, 10);
    }

    return usuario.update(datos);
  } catch (error) {
    console.error("Error actualizando el usuario:", error);
    throw error;
  }
};

module.exports = {
  updateUsuario,
};
