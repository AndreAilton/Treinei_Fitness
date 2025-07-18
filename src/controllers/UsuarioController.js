import User from "../models/Usuario.js";

class UserController {
    async store(req, res) {
        try {
            const novoUser = await User.create(req.body);
            return res.status(200).json({success: true, user: novoUser});
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
            const user = await User.findByPk(req.userId, {
                attributes: ['id', 'name', 'email','status']});
            if (user.status === false){
                 return res.status(400).json({sucess: false, message:"usuario desativado"});
            }
            return res.status(200).json({sucess: true, user});
        } catch (e) {
            return res.status(400).json({sucess: false, message:"usuario nao encontrado"});}
    

        

    async update(req, res) {
        try {
            const user = await User.findByPk(req.userId);
            await user.update(req.body);
            const { id, name, email } = user;
            return res.status(200).json({ id, name, email });
        } catch (e) {
            return res.status(400).json(e);
        }
    }

    async destroy(req, res) {
        try {
            const user = await User.findByPk(req.userId);
            user.status = false;
            await user.save();
            return res.status(200).json({sucess: true, message:"usuario desativado"});
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}

export default new UserController();