import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { transactionService } from '../service/transaction.service';
import { prismaClient } from '../database/prisma.client';

export class transitionsController{
    public async create(req: Request, res: Response){
        try {
            const service = new transactionService();
            const results = await service.create(req.body);

            res.status(201).json({
                sucess: true,
                message: 'Lançamento gerado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }
    public async TransactionsSearch(req: Request, res: Response){
          const { name } = req.query;
    
          try {
            const results = await prismaClient.client.findMany({
              where: {
                name: {
                  contains: String(name),
                  mode: 'insensitive',
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
                    message: "Nenhum cliente encontrado com esse nome.",
                    data: [],
                });
            }
    
            res.status(200).json({
              sucess: true,
              message: 'Atendimento encontrado com sucesso.',
              data: results
            })
          } catch (error) {
            onError(error, res)
          }
    }
    public async TransactionsReport(req: Request, res: Response): Promise<void>{
    
          const clientId = Number(req.params.id);
          const { startDate, endDate } = req.query;
    
          try {
            const service = new transactionService();
    
            const report = await service.TransactionsReport(clientId, startDate as string, endDate as string);
    
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

            const service = new transactionService();
            const updatedTransaction = await service.update(id, req.body);
    
            res.status(201).json({
            sucess: true,
            message: 'Atendimento atualizado com sucesso',
            data: updatedTransaction
        })

        } catch (error) {
            return onError(error, res);
        }
    }
}