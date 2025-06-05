import { Router } from 'express';
import { clientController } from '../controller/client.controller';

export class clientRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new clientController();

        router.post("/client", controller.create);

        return router
    }
}