const Modulo = require("../../database/models/modulo");
const deleteModulo = async (id) => {
  const modulo = await Modulo.findByPk(id);
  if (!modulo) return null;
  await modulo.destroy();
  console.log(modulo.dataValues);

  return modulo;
};

module.exports = { deleteModulo };
