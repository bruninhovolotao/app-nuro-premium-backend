import { Router } from 'express';
import { loginController } from '../controller/login.controller';

export class loginRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new loginController();

        router.post("/signup", controller.signup);
        router.post("/login", controller.login);

        return router
    }
}