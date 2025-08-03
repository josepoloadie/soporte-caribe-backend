const Rol = require("../../database/models/rol");
const Modulo = require("../../database/models/modulo");

const createModulosToRol = async (rolId, moduloIds) => {
  if (!Array.isArray(moduloIds)) {
    return {
      codigo: 400,
      datos: { mensaje: "moduloIds debe ser un array de IDs" },
    };
  }

  const rol = await Rol.findByPk(rolId, {
    include: {
      model: Modulo,
      as: "modulos",
      attributes: ["id"],
      through: { attributes: [] },
    },
  });

  if (!rol) {
    return { codigo: 404, datos: { mensaje: "Rol no encontrado" } };
  }

  const modulos = await Modulo.findAll({ where: { id: moduloIds } });
  if (modulos.length !== moduloIds.length) {
    return { codigo: 400, datos: { mensaje: "Uno o más módulos no existen" } };
  }

  const modulosAsignados = rol.modulos.map((m) => m.id);

  if (modulosAsignados.length === 0) {
    // No tiene módulos → se asignan todos
    await rol.setModulos(moduloIds);
    return {
      codigo: 200,
      datos: { mensaje: "Módulos asignados correctamente (primera vez)" },
    };
  } else {
    // Tiene módulos → agregar solo los nuevos (sin duplicar)
    const nuevosModulos = moduloIds.filter(
      (id) => !modulosAsignados.includes(id)
    );

    if (nuevosModulos.length === 0) {
      return {
        codigo: 200,
        datos: { mensaje: "Todos los módulos ya estaban asignados al rol" },
      };
    }

    await rol.addModulos(nuevosModulos);

    return {
      codigo: 200,
      datos: {
        mensaje: "Módulos adicionales asignados correctamente",
        añadidos: nuevosModulos,
      },
    };
  }
};

module.exports = {
  createModulosToRol,
};
