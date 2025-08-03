const Modulo = require("../../database/models/modulo");
const updateModulo = async (id, datos) => {
  try {
    const modulo = await Modulo.findByPk(id);
    if (!modulo) return null;

    return modulo.update(datos);
  } catch (error) {
    console.error("Error actualizando el modulo:", error);
    throw error;
  }
};

module.exports = {
  updateModulo,
};
