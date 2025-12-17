import Usuarios from "../../models/Treinador.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import transport from '../../config/mailer.js'; // Importe sua config de email

class PasswordController {
  
  // 1. O usuário informa o email e recebe o token
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await Usuarios.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Gera um token aleatório de 20 caracteres hexadecimais
      const token = crypto.randomBytes(20).toString('hex');

      // Define expiração para 1 hora a partir de agora
      const now = new Date();
      now.setHours(now.getHours() + 1);

      await user.update({
        password_reset_token: token,
        password_reset_expires: now,
      });

      // Envia o email
      // IMPORTANTE: Altere o link para o endereço do seu Front-end
      await transport.sendMail({
        to: email,
        from: 'suporte@fitnessapp.com',
        subject: 'Recuperação de Senha - FitnessApp',
        html: `
          <p>Você solicitou a recuperação de senha.</p>
          <p>Utilize este token: <b>${token}</b></p>
          <p>Ou clique no link: <a href="http://localhost:3000/reset-password/${token}">Recuperar Senha</a></p>
        `,
      });

      return res.status(200).json({ success: true, message: 'Email de recuperação enviado!' });

    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Erro ao tentar recuperar senha, tente novamente.' });
    }
  }

  // 2. O usuário envia o token e a nova senha
  async resetPassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await Usuarios.findOne({ 
        where: { email },
        attributes: ['id', 'password_reset_token', 'password_reset_expires', 'password_hash'] 
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verifica se o token bate
      if (token !== user.password_reset_token) {
        return res.status(400).json({ error: 'Token inválido' });
      }

      // Verifica se o token expirou
      const now = new Date();
      if (now > user.password_reset_expires) {
        return res.status(400).json({ error: 'Token expirado, gere um novo' });
      }

      // Criptografa a nova senha (assumindo que seu Model tem hooks, ou fazendo manual aqui)
      // Se o seu model Usuarios já tem um hook 'beforeSave' para hashear, basta user.update({ password }).
      // Caso contrário, faça manual:
      const newPasswordHash = await bcrypt.hash(password, 8);

      await user.update({
        password_hash: newPasswordHash, // ou apenas 'password' se seu model trata isso
        password_reset_token: null,    // Limpa o token para não ser usado de novo
        password_reset_expires: null
      });

      return res.status(200).json({ success: true, message: 'Senha alterada com sucesso!' });

    } catch (e) {
      return res.status(400).json({ error: 'Não foi possível resetar a senha' });
    }
  }
}

export default new PasswordController();