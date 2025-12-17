import Usuarios from "../../models/Usuario.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import transport from "../../config/mailer.js"; // Importe sua config de email

class PasswordController {
  // 1. O usuário informa o email e recebe o token
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await Usuarios.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Gera um token aleatório de 20 caracteres hexadecimais
      const token = crypto.randomBytes(20).toString("hex");

      // Define expiração para 1 hora a partir de agora
      const now = new Date();
      now.setHours(now.getHours() + 1);

      await user.update({
        password_reset_token: token,
        password_reset_expires: now,
      });

      // Envia o email

      const link = `http://localhost:5173/usuarios/reset-password/${token}?email=${email}`;

      // Template HTML Profissional
      const htmlEmail = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    /* Estilos para Mobile */
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif;">
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <table class="main-table" role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <tr>
            <td align="center" style="background-color: #2c3e50; padding: 30px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">FitnessApp</h1>
            </td>
          </tr>

          <tr>
            <td class="content-padding" style="padding: 40px;">
              <h2 style="color: #333333; margin-top: 0;">Recuperação de Senha</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                Olá, recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo:
              </p>

              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="border-radius: 4px;" bgcolor="#27ae60">
                    <a href="${link}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; border: 1px solid #27ae60; display: inline-block; font-weight: bold;">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #999999; font-size: 14px; margin-top: 30px;">
                Se você não solicitou essa alteração, ignore este e-mail. Sua senha permanecerá a mesma.<br>
                Este link expira em 1 hora.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #eeeeee; padding: 20px; text-align: center; color: #888888; font-size: 12px;">
              &copy; ${new Date().getFullYear()} FitnessApp. Todos os direitos reservados.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

      // IMPORTANTE: Altere o link para o endereço do seu Front-end
      await transport.sendMail({
        to: email,
        from: "suporte@fitnessapp.com",
        subject: "Recuperação de Senha - FitnessApp",
        html: htmlEmail,
      });

      return res
        .status(200)
        .json({ success: true, message: "Email de recuperação enviado!" });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "Erro ao tentar recuperar senha, tente novamente." });
    }
  }

  // 2. O usuário envia o token e a nova senha
  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const user = await Usuarios.findOne({
        where: { email },
        attributes: [
          "id",
          "password_reset_token",
          "password_reset_expires",
          "password_hash",
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verifica se o token bate
      if (token !== user.password_reset_token) {
        return res.status(400).json({ error: "Token inválido" });
      }

      // Verifica se o token expirou
      const now = new Date();
      if (now > user.password_reset_expires) {
        return res.status(400).json({ error: "Token expirado, gere um novo" });
      }

      // Criptografa a nova senha (assumindo que seu Model tem hooks, ou fazendo manual aqui)
      // Se o seu model Usuarios já tem um hook 'beforeSave' para hashear, basta user.update({ password }).
      // Caso contrário, faça manual:
      const newPasswordHash = await bcrypt.hash(password, 8);

      await user.update({
        password_hash: newPasswordHash, // ou apenas 'password' se seu model trata isso
        password_reset_token: null, // Limpa o token para não ser usado de novo
        password_reset_expires: null,
      });

      return res
        .status(200)
        .json({ success: true, message: "Senha alterada com sucesso!" });
    } catch (e) {
      return res
        .status(400)
        .json({ error: "Não foi possível resetar a senha" });
    }
  }
}

export default new PasswordController();
