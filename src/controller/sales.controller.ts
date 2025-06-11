import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { salesService } from '../service/sales.service';

export class salesController{
    public async create(req: Request, res: Response){
        try {
            const service = new salesService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Venda cadastrada com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }

    public async list(req: Request, res: Response): Promise<void>{
        try {
        const service = new salesService();

        const list = await service.list();

        res.status(200).json({
            sucess: true,
            message: 'Lista vendas carregada com sucesso',
            data: list
        })
        
        } catch (error) {
        onError(error, res)
        }
    }
}