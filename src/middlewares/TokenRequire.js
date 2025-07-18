import jwt from "jsonwebtoken";
import User from "../models/Usuario.js";
import Treinador from "../models/Treinador.js";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ["Login Requerido"],
    });
  }

  const [bearer, token] = authorization.split(" ");
  if (!token) {
    return res.status(401).json({
      errors: ["Token não fornecido"],
    });
  }

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email, tipo } = dados;

    let usuario = null;
    if (tipo === "treinador") {
      usuario = await Treinador.findOne({ where: { id, email } });
    } else {
      usuario = await User.findOne({ where: { id, email } });
    }

    if (!usuario) {
      return res.status(401).json({
        errors: [
          tipo === "treinador" ? "Treinador inválido" : "Usuário inválido",
        ],
      });
    }

    if (usuario.status === false) {
      return res
        .status(401)
        .json({
          message:
            tipo === "treinador"
              ? "Treinador desativado. Faça login novamente."
              : "Usuário desativado. Faça login novamente.",
        });
    }

    req.userId = id;
    req.useremail = email;
    req.tipo = tipo || "usuario";
    req.isAdmin = false;
    return next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      errors: ["Token expirado ou inválido"],
    });
  }
};
