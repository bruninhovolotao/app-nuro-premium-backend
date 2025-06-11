import { Router } from 'express';
import { professionalController } from '../controller/professional.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class professionalRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new professionalController();

        router.get("/professional", controller.list);
        router.post("/professional", autenticarToken, controller.create);

        return router
    }
}