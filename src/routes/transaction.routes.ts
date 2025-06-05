import { Router } from 'express';
import { transitionsController } from '../controller/transaction.controller';

export class transactionRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new transitionsController();

        router.post("/transactions", controller.create);

        return router
    }
}