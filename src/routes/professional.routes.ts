import { Router } from 'express';
import { professionalController } from '../controller/professional.controller';

export class professionalRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new professionalController();

        router.post("/professional", controller.create);

        return router
    }
}