import { Router } from 'express';
import { serviceController } from '../controller/service.controller';

export class serviceRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new serviceController();

        router.post("/service", controller.create);

        return router
    }
}