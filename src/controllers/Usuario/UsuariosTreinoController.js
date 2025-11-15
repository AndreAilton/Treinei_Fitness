import UsuariosTreino from "../../models/UsuariosTreino.js";

class UsuariosTreinoController {
   async store(req, res) {
    try {
      const { id_treinador, id_treino = null } = req.body;

      // verificar se usuário já tem uma relação
      let relacao = await UsuariosTreino.findOne({
        where: { id_usuario: req.userId },
      });

      // Se NÃO existe -> cria
      if (!relacao) {
        relacao = await UsuariosTreino.create({
          id_usuario: req.userId,
          id_treinador,
          id_treino,
          ativo: false,
        });

        return res.status(200).json({
          success: true,
          created: true,
          usuariosTreino: relacao,
        });
      }

      // Se JÁ existe -> atualiza treinador e treino
      relacao.id_treinador = id_treinador;
      relacao.id_treino = id_treino;
      await relacao.save();

      return res.status(200).json({
        success: true,
        created: false,
        usuariosTreino: relacao,
      });

    } catch (e) {

      return res.status(400).json({
        success: false,
        message: "Erro ao vincular treinador ao usuário",
        error: e.message,
      });
    }
  }

  async index(req, res) {
    if (req.tipo !== "treinador") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a treinadores." });
    }

    try {
      const usuariosTreinos = await UsuariosTreino.findAll({
        where: { id_Treinador: req.treinadorId },
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

export default new UsuariosTreinoController();
