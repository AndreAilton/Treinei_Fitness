import User from "../../models/Usuario.js";
import jwt from "jsonwebtoken";

class TokenController {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Credenciais Invalidas" });
    }

    
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "usuario Não Encontrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Usuario ou Senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );
    res.status(200).json({ sucess: true, token });
  }
}

export default new TokenController();
