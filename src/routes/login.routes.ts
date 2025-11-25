import { Router } from 'express';
import { loginController } from '../controller/login.controller';

export class loginRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new loginController();

        router.post("/signup", controller.signup);
        router.post("/login", controller.login);
        router.get("/usuario/:id", controller.list);
        router.put("/usuario/:id", controller.update);
        router.delete("/usuario/:id", controller.delete);

        return router
    }
}