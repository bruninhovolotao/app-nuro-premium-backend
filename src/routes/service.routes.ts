import { Router } from 'express';
import { serviceController } from '../controller/service.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class serviceRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new serviceController();

        router.get("/service", controller.list);
        router.post("/service", autenticarToken, controller.create);

        return router
    }
}