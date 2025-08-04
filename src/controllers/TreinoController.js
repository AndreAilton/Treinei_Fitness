import Treino from "../models/Treino.js";

class TreinoController {
  async store(req, res) {
    try {
      const novoTreino = await Treino.create({
        ...req.body,
        id_treinador: req.treinadorId,
      });
      return res.status(200).json({ success: true, treino: novoTreino });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao criar treino",
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
      const treinos = await Treino.findAll(
        {
          where: { id_treinador: req.treinadorId }
        }
      );
      return res.status(200).json({ success: true, treinos });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar treinos",
        error: e.message,
      });
    }
  }

  async show(req, res) {
    try {
      const treino = await Treino.findByPk(req.params.id);
      if (!treino) {
        return res
          .status(404)
          .json({ success: false, message: "Treino não encontrado" });
      }
      return res.status(200).json({ success: true, treino });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar treino",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    try {
      const treino = await Treino.findByPk(req.params.id);
      if (!treino) {
        return res
          .status(404)
          .json({ success: false, message: "Treino não encontrado" });
      }
      await treino.update(req.body);
      return res.status(200).json({ success: true, treino });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar treino",
        error: e.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const treino = await Treino.findByPk(req.params.id);
      if (!treino) {
        return res
          .status(404)
          .json({ success: false, message: "Treino não encontrado" });
      }
      await treino.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Treino removido" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao remover treino",
        error: e.message,
      });
    }
  }
}

export default new TreinoController();
