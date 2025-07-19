import Exercicio from "../models/Exercicio.js";

class ExercicioController {
  async store(req, res) {
    try {
    //   console.log({...req.body, id_treinador: req.treinadorId })
    //   return res.status(200).json({ success: true, message: "Exercício criado com sucesso" });
      const novoExercicio = await Exercicio.create({...req.body, id_treinador: req.treinadorId });
      return res.status(200).json({ success: true, exercicio: novoExercicio });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao criar exercício",
          error: e.message,
        });
    }
  }

  async index(req, res) {
    try {
      const exercicios = await Exercicio.findAll();
      return res.status(200).json({ success: true, exercicios });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao listar exercícios",
          error: e.message,
        });
    }
  }

  async show(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      return res.status(200).json({ success: true, exercicio });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao buscar exercício",
          error: e.message,
        });
    }
  }

  async update(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      await exercicio.update(req.body);
      return res.status(200).json({ success: true, exercicio });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao atualizar exercício",
          error: e.message,
        });
    }
  }

  async destroy(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      await exercicio.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Exercício removido" });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao remover exercício",
          error: e.message,
        });
    }
  }
}

export default new ExercicioController();
