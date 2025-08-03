const Rol = require("../../database/models/rol");

const updateRol = async (id, datos) => {
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) return null;
    return rol.update(datos);
  } catch (error) {
    console.error("Error actualizando el rol:", error);
    throw error;
  }
};

module.exports = {
  updateRol,
};
