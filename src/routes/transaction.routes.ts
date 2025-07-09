import { Router } from 'express';
import { transitionsController } from '../controller/transaction.controller';
import { autenticarToken } from '../middleware/auth.middleware';
import { ensureTipo } from '../middleware/ensureRole'

export class transactionRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new transitionsController();

        router.post("/transactions", autenticarToken, ensureTipo, controller.create);

        return router
    }
}