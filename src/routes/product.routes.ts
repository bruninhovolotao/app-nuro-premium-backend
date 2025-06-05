import { Router } from 'express';
import { productController } from '../controller/product.controller';
import { autenticarToken } from '../middleware/auth.middleware';

export class productRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new productController();

        router.post("/product", autenticarToken, controller.create);

        return router
    }
}