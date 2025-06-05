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

    public async update(req: Request, res: Response): Promise<void> {
        try {
          const id = parseInt(req.params.id, 10);
          if (isNaN(id)) {
             res.status(400).json({ message: "ID inválido." });
          }
    
          const data = req.body;
          
          const service = new clientService();
          const updatedClient = await service.update(id, data);
    
          res.status(201).json({
            sucess: true,
            message: 'Cliente cadastrado com sucesso',
            data: updatedClient
        })

        } catch (error) {
          return onError(error, res);
        }
      }

    public async delete (req: Request, res: Response): Promise<void>{
      try {
        const id = parseInt(req.params.id, 10)

        if(isNaN(id)){
          res.status(400).json({
            message: 'ID inválido'
          })
        }

        const service = new clientService();
        const deletedClient = await service.delete(id);

        res.status(200).json({
          sucess: true,
          message: 'Cliente deletado com sucesso',
        })
        
      } catch (error) {
        return onError(error, res);
        
      }
    }
}