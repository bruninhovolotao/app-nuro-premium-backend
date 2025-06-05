import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { professionalService } from '../service/professional.service';

export class professionalController{
    public async create(req: Request, res: Response){
        try {
            const service = new professionalService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Profissional cadastrado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }
}