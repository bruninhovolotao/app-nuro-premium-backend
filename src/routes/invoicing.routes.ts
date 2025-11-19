import { Router } from "express";
import { autenticarToken } from "../middleware/auth.middleware";
import { invoicingController } from "../controller/invoicing.controller";

export class InvoicingRoutes{
    public static bind(): Router{
        const router = Router();
        const controller = new invoicingController();

        router.get("/invoicing", controller.invoicing);
    
        return router
    }
}