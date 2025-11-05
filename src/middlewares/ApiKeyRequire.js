export default (req, res, next) => {
  // aceita header x-api-key: <key> ou query ?api_key=<key>
  const headerKey = req.headers["x-api-key"] || req.headers["api_key"];
  const queryKey = req.query && req.query.api_key;
  const provided = headerKey || queryKey;

  if (!provided) {
    return res.status(401).json({
      success: false,
      errors: ["API key requerida"],
    });
  }

  const expected = process.env.API_KEY;
  if (!expected) {
    // Se por algum motivo a API_KEY não estiver configurada, bloqueia
    return res.status(500).json({
      success: false,
      message: "API key não configurada no servidor",
    });
  }

  if (provided !== expected) {
    return res.status(401).json({
      success: false,
      errors: ["API key inválida"],
    });
  }

  return next();
};
