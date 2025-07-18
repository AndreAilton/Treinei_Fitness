import Usuarios from "../models/Usuario.js";

class UserController {
  async store(req, res) {
    try {
      const novoUser = await Usuarios.create(req.body);
      return res.status(200).json({ success: true, user: novoUser });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ errors: ["Este e-mail já está cadastrado."] });
      }
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ errors: e.errors.map((error) => error.message) });
      }
      return res.status(400).json({
        success: false,
        message: "Erro ao criar usuário",
        error: e.message,
      });
    }
  }

  async index(req, res) {
    try {
      const usuarios = await Usuarios.findAll({
        attributes: ["id", "nome", "email", "status"],
      });
      return res.status(200).json({ success: true, usuarios });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar usuários",
        error: e.message,
      });
    }
  }

  async show(req, res) {
    try {
      const user = await Usuarios.findByPk(req.userId, {
        attributes: ["id", "nome", "email", "status"],
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      if (user.status === false) {
        return res
          .status(400)
          .json({ success: false, message: "Usuário desativado" });
      }
      return res.status(200).json({ success: true, user });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar usuário",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    try {
      const user = await Usuarios.findByPk(req.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      await user.update(req.body);
      const { id, nome, email } = user;
      return res.status(200).json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar usuário",
        error: e.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const user = await Usuarios.findByPk(req.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      user.status = false;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Usuário desativado" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao desativar usuário",
        error: e.message,
      });
    }
  }
}

export default new UserController();
