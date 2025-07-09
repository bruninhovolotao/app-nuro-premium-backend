import { Router } from 'express';
import { transitionsController } from '../controller/transaction.controller';
import { autenticarToken } from '../middleware/auth.middleware';
import { ensureRole } from '../middleware/ensureRole'

export class transactionRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new transitionsController();

        router.post("/transactions", autenticarToken, ensureRole, controller.create);

        return router
    }
}