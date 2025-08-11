// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function isPasswordChangeRoute(req) {
  // protegido: PATCH /v1/usuarios/me/password
  // Cuando este middleware se usa en routers anidados, suele venir:
  //   req.baseUrl = "/v1/usuarios"
  //   req.path    = "/me/password"
  // Usamos originalUrl por si cambia el montaje:
  return /\/usuarios\/me\/password(?:\/)?$/i.test(
    req.originalUrl.split("?")[0] || ""
  );
}

const authMiddleware = (req, res, next) => {
  // Permite preflight CORS
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Deja el payload disponible en ambos nombres (compatibilidad)
    req.user = decoded;
    req.usuario = decoded;

    // Si el token dice que debe cambiar contraseña,
    // solo permitimos la ruta de cambio de contraseña
    if (decoded.mustChangePassword && !isPasswordChangeRoute(req)) {
      return res
        .status(428) // Precondition Required
        .json({
          mensaje: "Debe cambiar la contraseña antes de continuar",
          requirePasswordChange: true,
        });
    }

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
