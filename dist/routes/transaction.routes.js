"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controller/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class transactionRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new transaction_controller_1.transitionsController();
        router.post("/transactions", auth_middleware_1.autenticarToken, controller.create);
        router.get("/transactions/search", controller.TransactionsSearch);
        router.get("/transactions/client/:id", controller.TransactionsReport);
        router.put("/transactions/:id", controller.update);
        return router;
    }
}
exports.transactionRoutes = transactionRoutes;
