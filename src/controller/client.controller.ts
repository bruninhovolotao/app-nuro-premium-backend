import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { clientService } from '../service/client.service';

export class clientController{
    public async create(req: Request, res: Response){
        try {
            const service = new clientService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Cliente cadastrado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }
}