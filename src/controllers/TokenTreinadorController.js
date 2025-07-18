import Treinador from "../models/Treinador.js";
import jwt from "jsonwebtoken";

class TokenTreinadorController {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Credenciais Inválidas" });
    }

    const treinador = await Treinador.findOne({ where: { email } });

    if (!treinador) {
      return res.status(401).json({ error: "Treinador não encontrado" });
    }

    if (!(await treinador.checkPassword(password))) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: treinador.id, email: treinador.email, tipo: "treinador" },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );
    res.status(200).json({ success: true, token });
  }
}

export default new TokenTreinadorController();
