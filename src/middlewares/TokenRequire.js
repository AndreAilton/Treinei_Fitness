import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: ['Login Requerido']
        })
    }
    const [ text, token] = authorization.split(' ');

    try {
            return next();
        } catch (e) {
            try {
                const dados = jwt.verify(token, process.env.TOKEN_SECRET)
                const {id, email} = dados
        
                const user = await User.findOne({
                    where: {id,
                        email
                    }
                })

                if (user.status === false) {
                    return res.status(401).json({ message: 'Usuário desativado. Faça login novamente.' });
                }

                if (!user) {
                    return res.status(401).json({
                        errors: ['Usuario Invalido']
                    })
                }
                req.userId = id;
                req.useremail = email;
                req.isAdmin = false
                return next();
            } catch(e) {
                return res.status(401).json({sucess: false,
                    errors: ['Token expirado ou invalido']
                })
            }
 
        }
}