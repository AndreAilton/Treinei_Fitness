import Treinador from "../models/Treinador.js";

class TreinadorController {
    async store(req, res) {
        try {
            const novoTreinador = await Treinador.create(req.body);
            return res.status(200).json({success: true, Treinador: novoTreinador});
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ errors: ['Este e-mail já está cadastrado.'] });
            }
            return res.status(400).json({sucess: false, errors: e.errors.map((err) => err.message)});      
        }
    }

    async index(req, res) {
        return null
    }

    async show(req, res) {
            const Treinador = await Treinador.findByPk(req.TreinadorId, {
                attributes: ['id', 'name', 'email','status']});
            if (Treinador.status === false){
                 return res.status(400).json({sucess: false, message:"usuario desativado"});
            }
            return res.status(200).json({sucess: true, Treinador});
        } catch (e) {
            return res.status(400).json({sucess: false, message:"usuario nao encontrado"});}
    

        

    async update(req, res) {
        try {
            const Treinador = await Treinador.findByPk(req.TreinadorId);
            await Treinador.update(req.body);
            const { id, name, email } = Treinador;
            return res.status(200).json({ id, name, email });
        } catch (e) {
            return res.status(400).json(e);
        }
    }

    async destroy(req, res) {
        try {
            const Treinador = await Treinador.findByPk(req.TreinadorId);
            Treinador.status = false;
            await Treinador.save();
            return res.status(200).json({sucess: true, message:"usuario desativado"});
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}

export default new TreinadorController();