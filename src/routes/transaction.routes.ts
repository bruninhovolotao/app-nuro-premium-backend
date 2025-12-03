import { Router } from 'express';
import { transitionsController } from '../controller/transaction.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class transactionRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new transitionsController();

        router.post("/transactions", autenticarToken, controller.create);
        router.get("/transactions/search", controller.TransactionsSearch);
        router.get("/transactions/client/:id", controller.TransactionsReport);
        router.put("/transactions/:id", controller.update);

        return router
    }
}