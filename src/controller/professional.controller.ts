import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { professionalService } from '../service/professional.service';
import { prismaClient } from '../database/prisma.client';

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
    public async list(req: Request, res: Response): Promise<void>{
            try {
            const service = new professionalService();
    
            const list = await service.list();
    
            res.status(200).json({
                sucess: true,
                message: 'Lista de Profissionais carregada com sucesso',
                data: list
            })
            
            } catch (error) {
            onError(error, res)
            }
    }
    public async professionalSearch( req: Request, res: Response): Promise<void>{
        const { name } = req.query;
        
        try {
        const results = await prismaClient.professional.findMany({
            where: {
            name: {
                contains: String(name || ""),
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

        if (results.length === 0) {
            res.status(404).json({
                success: false,
                message: "Nenhum profissional encontrado com esse nome.",
                data: [],
            });
        }

        res.status(200).json({
            sucess: true,
            message: 'Profissional encontrado com sucesso!',
            data: results
        })
        } catch (error) {
        onError(error, res)
        }    
    }
    public async professionalReport(req: Request, res: Response): Promise<void>{
    
          const professionalId = Number(req.params.id);
          const { startDate, endDate } = req.query;
    
          try {
            const service = new professionalService();
    
            const report = await service.professionalReport(professionalId, startDate as string, endDate as string);
            
            res.status(200).json({
              sucess: true,
              message: 'Dados do Profissional carregados com sucesso',
              data: report
            })
            
          } catch (error) {
            onError(error, res)
          }
    }
    public async professionalInvoicing(req: Request, res: Response): Promise<void>{
    
          const professionalId = Number(req.params.id);
          const { startDate, endDate } = req.query;
    
          try {
            const service = new professionalService();
    
            const report = await service.professionalInvoicing(professionalId, startDate as string, endDate as string);
            
            res.status(200).json({
              sucess: true,
              message: 'Dados do Profissional carregados com sucesso',
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
        
        const service = new professionalService();
        const updatedClient = await service.update(id, data);
  
        res.status(201).json({
          sucess: true,
          message: 'Profissional atualizado com sucesso',
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

        const service = new professionalService();
        const deletedClient = await service.delete(id);

        res.status(200).json({
          sucess: true,
          message: 'Profissional deletado com sucesso',
        })
        
      } catch (error) {
        return onError(error, res);
        
      }
    }
}