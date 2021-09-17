import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
//import { Aliveapp } from '../models/Aliveapp';
import Product from '../models/Products';
import User from '../models/User';
//import { Users } from '../models/Users';


export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const createProduct = async (req: Request, res: Response) => {
    let { name, ident, img, sizes, price, categ, description } = req.body;

    let newProduct = await Product.create({ name, ident, img, sizes, price, categ, description });

    res.json({ id: newProduct.id, name });
}

export const listProducts = async (req: Request, res: Response) => {
 
    let list = await Product.find({});
    res.json({ list });
}

export const getProdCateg = async (req: Request, res: Response) => {

    let { categ } = req.params;

    let list = await Product.find({
        categ
    });

    if (list) {
        res.json({ list });
    } else {
        res.json({ error: 'Categoria de produto não encontrado!' });
    }
}

export const register = async (req: Request, res: Response) => {
    if (req.body.email && req.body.pass) {
        let { name, email, pass } = req.body;
        let hasUser = await User.findOne({ email });

        if (!hasUser) {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(pass, salt);

            let newUser = await User.create({ name, email, password });

            const token = JWT.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET_TOKEN as string,
                { expiresIn: '2h' }
            );

            res.status(201);
            res.json({ id: newUser.id, token });
        } else {
            res.json({ error: 'Usuário já existe' });
        }
    } else {
        res.json({ error: 'Favor preencher todos os campos!' })
    }
}

export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.pass) {
        let email: string = req.body.email;
        let pass: string = req.body.pass;        

        let user = await User.findOne({ email });
        
        const password = bcrypt.compareSync(pass, user.password);
        
        if(password) {
              const token = JWT.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET_TOKEN as string,
                { expiresIn: '2h' }
            );

            res.json({ status: true, token });
            return;
        } 
    }
    res.json({ status: false, error: 'Usuário ou Senha Incorretos!'})
}