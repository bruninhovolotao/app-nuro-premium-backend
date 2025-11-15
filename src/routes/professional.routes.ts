import { Router } from 'express';
import { professionalController } from '../controller/professional.controller';
import { autenticarToken } from '../middleware/auth.middleware';
import { ensureTipo } from '../middleware/ensureRole';

export class professionalRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new professionalController();

        router.get("/professional", controller.list);
        router.get("/professional/search", controller.professionalSearch);
        router.get("/report/professional/:id", controller.professionalReport);
        router.post("/professional", autenticarToken, controller.create);

        return router
    }
}