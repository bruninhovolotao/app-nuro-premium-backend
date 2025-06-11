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
}