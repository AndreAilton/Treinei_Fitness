import jwt from "jsonwebtoken";
import User from "../models/Usuario.js";

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
    const { id, email } = dados;

    const user = await User.findOne({
      where: { id, email },
    });

    if (!user) {
      return res.status(401).json({
        errors: ["Usuário inválido"],
      });
    }

    if (user.status === false) {
      return res
        .status(401)
        .json({ message: "Usuário desativado. Faça login novamente." });
    }

    req.userId = id;
    req.useremail = email;
    req.isAdmin = false;
    return next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      errors: ["Token expirado ou inválido"],
    });
  }
};
