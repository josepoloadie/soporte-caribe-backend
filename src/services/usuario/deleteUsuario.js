const Usuario = require("../../database/models/usuario");
const deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;
  await usuario.destroy();
  console.log(usuario.dataValues);

  return usuario;
};

module.exports = { deleteUsuario };
