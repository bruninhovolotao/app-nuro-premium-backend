import { Router } from 'express';
import { clientController } from '../controller/client.controller';
import { autenticarToken } from '../middleware/auth.middleware';
import { ensureTipo } from '../middleware/ensureRole';

export class clientRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new clientController();

        router.get("/client", controller.list);
        router.get("/client/search", controller.ClientSearch);
        router.get("/report/client/:id", ensureTipo, controller.ClientReport);
        router.post("/client", autenticarToken, controller.create);
        router.put("/client/:id", autenticarToken, controller.update);
        router.delete("/client/:id", autenticarToken, controller.delete);

        return router
    }
}