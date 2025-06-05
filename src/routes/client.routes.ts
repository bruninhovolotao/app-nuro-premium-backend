import { Router } from 'express';
import { clientController } from '../controller/client.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class clientRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new clientController();

        router.post("/client", autenticarToken, controller.create);
        router.put("/client/:id", autenticarToken, controller.update);
        router.delete("/client/:id", autenticarToken, controller.delete);

        return router
    }
}