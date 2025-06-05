import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { productService } from '../service/product.service';

export class productController{
    public async create(req: Request, res: Response){
        try {
            const service = new productService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Produto cadastrado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }
}