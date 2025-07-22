import TreinoDia from "../models/TreinoDia.js";

class TreinoDiaController {
  async store(req, res) {
    try {
      const novoTreinoDia = await TreinoDia.create(req.body);
      return res.status(200).json({ success: true, treinoDia: novoTreinoDia });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao criar treino do dia",
          error: e.message,
        });
    }
  }

  async index(req, res) {
    try {
      const treinosDia = await TreinoDia.findAll();
      return res.status(200).json({ success: true, treinosDia });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao listar treinos do dia",
          error: e.message,
        });
    }
  }

  async show(req, res) {
    try {
      const treinoDia = await TreinoDia.findByPk(req.params.id);
      if (!treinoDia) {
        return res
          .status(404)
          .json({ success: false, message: "Treino do dia não encontrado" });
      }
      return res.status(200).json({ success: true, treinoDia });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao buscar treino do dia",
          error: e.message,
        });
    }
  }

  async update(req, res) {
    try {
      const treinoDia = await TreinoDia.findByPk(req.params.id);
      if (!treinoDia) {
        return res
          .status(404)
          .json({ success: false, message: "Treino do dia não encontrado" });
      }
      await treinoDia.update(req.body);
      return res.status(200).json({ success: true, treinoDia });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao atualizar treino do dia",
          error: e.message,
        });
    }
  }

  async destroy(req, res) {
    try {
      const treinoDia = await TreinoDia.findByPk(req.params.id);
      if (!treinoDia) {
        return res
          .status(404)
          .json({ success: false, message: "Treino do dia não encontrado" });
      }
      await treinoDia.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Treino do dia removido" });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao remover treino do dia",
          error: e.message,
        });
    }
  }
}

export default new TreinoDiaController();
