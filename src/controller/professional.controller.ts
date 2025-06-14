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
            message: 'Profissional encontrado com sucesso',
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
}