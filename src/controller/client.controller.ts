import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { clientService } from '../service/client.service';
import { prismaClient } from '../database/prisma.client';

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

    public async list(req: Request, res: Response): Promise<void>{
      try {
        const service = new clientService();

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

    public async ClientSearch(req: Request, res: Response){
      const { name } = req.query;

      try {
        const results = await prismaClient.client.findMany({
          where: {
            name: {
              contains: String(name),
              mode: 'insensitive', // ignora maiúsculas/minúsculas
            },
          },
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc',
          },
        });

        res.status(200).json({
          sucess: true,
          message: 'Cliente encontrado com sucesso',
          data: results
        })
      } catch (error) {
        onError(error, res)
      }
    }

    public async ClientReport(req: Request, res: Response): Promise<void>{

      const clientId = Number(req.params.id);
      const { startDate, endDate } = req.query;

      try {
        const service = new clientService();

        const report = await service.ClientReport(clientId, startDate as string, endDate as string);

        if (report.length === 0) {
           res.status(404).json({
            success: false,
            message: 'Este cliente ainda não possui transações registradas.',
            data: [],
          });
        }
        
        res.status(200).json({
          sucess: true,
          message: 'Dados do Cliente carregados com sucesso',
          data: report
        })
        
      } catch (error) {
        onError(error, res)
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