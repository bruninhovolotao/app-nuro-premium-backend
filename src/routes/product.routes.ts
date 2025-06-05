import { Router } from 'express';
import { productController } from '../controller/product.controller';

export class productRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new productController();

        router.post("/product", controller.create);

        return router
    }
}