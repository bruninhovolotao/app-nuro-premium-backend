import { Request, Response} from 'express';
import { onError } from '../utils/on-error';
import { transactionService } from '../service/transaction.service';
import { prismaClient } from '../database/prisma.client';

export class transitionsController{
    public async create(req: Request, res: Response){
        try {
            const service = new transactionService();
            const user = req.user as {id: number, name: string, email: string, username: string, tipo: string}
            const createdByUser = user?.name
            const results = await service.create(req.body, createdByUser);

             res.status(201).json({
                sucess: true,
                message: 'Lançamento gerado com sucesso',
                data: results
            })
            
        } catch (error) {
            return onError(error, res);
        }
    }
}