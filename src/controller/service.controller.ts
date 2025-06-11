import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { serviceService } from '../service/service.service';

export class serviceController{
    public async create(req: Request, res: Response){
        try {
            const service = new serviceService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Serviço cadastrado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }

    public async list(req: Request, res: Response): Promise<void>{
          try {
            const service = new serviceService();
    
            const list = await service.list();
    
            res.status(200).json({
              sucess: true,
              message: 'Lista de clientes carregada com sucesso',
              data: list
            })
            
          } catch (error) {
            onError(error, res)
          }
    }
}