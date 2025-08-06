const tiempoService = require("../services/tiempo/tiempoService");

const marcarTiempo = async (req, res) => {
  const { usuarioId, proyectoId, tipo, latitud, longitud } = req.body;

  // 🔒 Validación de campos requeridos
  if (!usuarioId || !proyectoId || !tipo || !latitud || !longitud) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  // ✅ Validación de tipo permitido
  const tiposValidos = [
    "ingreso",
    "salida",
    "ingresoAlmuerzo",
    "salidaAlmuerzo",
  ];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      mensaje: `Tipo no válido. Los valores permitidos son: ${tiposValidos.join(
        ", "
      )}`,
    });
  }

  try {
    const tiempo = await tiempoService.marcarTiempo(
      usuarioId,
      proyectoId,
      tipo,
      latitud,
      longitud
    );
    res.status(200).json({ mensaje: "Marca registrada", tiempo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al registrar marca", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const tiempos = await tiempoService.getAll();
    res.json(tiempos);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar tiempos", error: err });
  }
};

const getById = async (req, res) => {
  try {
    const tiempo = await tiempoService.getById(req.params.id);
    if (!tiempo) return res.status(404).json({ mensaje: "No encontrado" });
    res.json(tiempo);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al buscar tiempo", error: err });
  }
};

const getByUsuario = async (req, res) => {
  try {
    const tiempos = await tiempoService.getByUsuario(req.params.usuarioId);
    res.json(tiempos);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al buscar por usuario", error: err });
  }
};

const getByUsuarioAndFecha = async (req, res) => {
  try {
    const { usuarioId, fecha } = req.params;
    const tiempo = await tiempoService.getByUsuarioAndFecha(usuarioId, fecha);
    if (!tiempo) return res.status(404).json({ mensaje: "No encontrado" });
    res.json(tiempo);
  } catch (err) {
    res.status(500).json({ mensaje: "Error", error: err });
  }
};

const getByProyecto = async (req, res) => {
  try {
    const tiempos = await tiempoService.getByProyecto(req.params.proyectoId);
    res.json(tiempos);
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al buscar por proyecto", error: err });
  }
};

const update = async (req, res) => {
  try {
    const tiempo = await tiempoService.updateParcial(req.params.id, req.body);
    if (!tiempo) return res.status(404).json({ mensaje: "No encontrado" });
    res.json({ mensaje: "Actualizado", tiempo });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar", error: err });
  }
};

const remove = async (req, res) => {
  try {
    const eliminado = await tiempoService.deleteById(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: "No encontrado" });
    res.json({ mensaje: "Eliminado", eliminado });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar", error: err });
  }
};

module.exports = {
  marcarTiempo,
  getAll,
  getById,
  getByUsuario,
  getByUsuarioAndFecha,
  getByProyecto,
  update,
  remove,
};
