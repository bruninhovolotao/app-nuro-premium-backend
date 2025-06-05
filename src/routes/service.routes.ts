import { Router } from 'express';
import { serviceController } from '../controller/service.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class serviceRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new serviceController();

        router.post("/service", autenticarToken, controller.create);

        return router
    }
}