import UsuariosTreino from "../../models/UsuariosTreino.js";
import Usuarios from "../../models/Usuario.js";

class UsuariosTreinoController {
  async store(req, res) {
    try {
      const novoUsuariosTreino = await UsuariosTreino.create({
        ...req.body,
        id_Usuario: req.userId,
        treino_ativo: false,
      });

      return res
        .status(200)
        .json({ success: true, usuariosTreino: novoUsuariosTreino });
    } catch (e) {

      if (e.errors && e.errors[0].type === "unique violation") {
        return res.status(400).json({
          success: false,
          message: "Você já possui um treinador ativo.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Erro ao criar relação usuário-treino",
      });
    }
  }

  async index(req, res) {



    if (req.tipo == "usuario") {
       const usuariosTreinos = await UsuariosTreino.findAll({
        where: { id_Usuario: req.userId },
        include: [
          {
            model: Usuarios,
            as: "usuario",
          },
        ],
      })

      return res.status(200).json({ success: true, usuariosTreinos });
    } 

    try {
      const usuariosTreinos = await UsuariosTreino.findAll({
        where: { id_Treinador: req.treinadorId },
        include: [
          {
            model: Usuarios,
            as: "usuario",
          },
        ],
      });
      return res.status(200).json({ success: true, usuariosTreinos });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar relações usuário-treino",
        error: e.message,
      });
    }
  }

  async show(req, res) {
    try {
      const usuariosTreino = await UsuariosTreino.findByPk(req.params.id);
      if (!usuariosTreino) {
        return res.status(404).json({
          success: false,
          message: "Relação usuário-treino não encontrada",
        });
      }
      return res.status(200).json({ success: true, usuariosTreino });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar relação usuário-treino",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    try {
      const usuariosTreino = await UsuariosTreino.findByPk(req.params.id);
      if (!usuariosTreino) {
        return res.status(404).json({
          success: false,
          message: "Relação usuário-treino não encontrada",
        });
      }
      await usuariosTreino.update(req.body);
      return res.status(200).json({ success: true, usuariosTreino });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar relação usuário-treino",
        error: e.message,
      });
    }
  }

  async destroy(req, res) {

    if (req.params.id == req.userId) {
    try {
      const usuariosTreino = await UsuariosTreino.findAll({
        where: { id_Usuario: req.userId }
      });


      await Promise.all(usuariosTreino.map(ut => ut.destroy()));
      return res
        .status(200)
        .json({ success: true, message: "Relação usuário-treino removida" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao remover relação usuário-treino",
        error: e.message,
      });
    }
  }


  if (req.tipo == "treinador") {
    try {
      const usuariosTreino = await UsuariosTreino.findByPk(req.params.id); 
      if (!usuariosTreino) {
        return res.status(404).json({
          success: false,
          message: "Relação usuário-treino não encontrada",
        });
      }
      await usuariosTreino.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Relação usuário-treino removida" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao remover relação usuário-treino",
        error: e.message,
      });
    }
  }
}
}

export default new UsuariosTreinoController();