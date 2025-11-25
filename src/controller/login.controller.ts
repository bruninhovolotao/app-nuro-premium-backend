import { Request, Response} from 'express';
import { loginService } from '../service/login.service';
import { onError } from '../utils/on-error';

export class loginController{
    public async signup(req: Request, res: Response){
        try {
            const service = new loginService();
            const resultado = await service.signup(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Usuário criado com sucesso',
                data: resultado
            })
            
        } catch (error) {
            onError(error, res)  
        }
    }
    public async login(req:Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            const service = new loginService();
            const results = await service.login( { username, password })

            res.status(201).json({
                sucess: true,
                message: "Usuário logado com sucesso",
                dados: results
            })
            
        } catch (error) {
            onError(error, res)            
        }
    }
    public async list(req:Request, res: Response): Promise<void> {
        const userId = Number(req.params.id)
        try {
            const service = new loginService();
            const list = await service.list(userId)

            res.status(200).json({
                sucess: true,
                message: "Dados do usuário carregado com sucesso",
                dados: list
            })
            
        } catch (error) {
            onError(error, res)            
        }
    }
    public async update(req:Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido." });
                return
            }
            const {name, email, username, password} = req.body;

            const service = new loginService();
            const updateUser = await service.update({id, name, email, username, password})

            res.status(200).json({
                sucess: true,
                message: "Usuário atualizado com sucesso",
                dados: updateUser
            })
            
        } catch (error) {
            onError(error, res)            
        }
    }
    public async delete(req:Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10)

            if(isNaN(id)){
            res.status(400).json({
                message: 'ID inválido'
            })
            }

            const service = new loginService();
            const results = await service.delete(id)

            res.status(201).json({
                sucess: true,
                message: "Usuário deletado com sucesso",
                dados: results
            })
            
        } catch (error) {
            onError(error, res)            
        }
    }
}