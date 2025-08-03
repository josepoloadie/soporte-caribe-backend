const bcrypt = require("bcrypt");
const Usuario = require("../../database/models/usuario");

const createUsuario = async (datos) => {
  const hashedPassword = await bcrypt.hash(datos.contraseña, 10);
  const date = new Date();
  // Crea un nuevo usuario con la contraseña hasheada
  return Usuario.create({
    ...datos,
    contraseña: hashedPassword,
    fecha_creacion: date,
  });
};

module.exports = { createUsuario };
