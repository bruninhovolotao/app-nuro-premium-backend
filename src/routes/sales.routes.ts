import { Router } from 'express';
import { autenticarToken } from '../middleware/auth.middleware';
import { salesController } from '../controller/sales.controller';

export class salesRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new salesController();

        router.get("/sales", controller.list);
        router.post("/sales", autenticarToken, controller.create);

        return router
    }
}