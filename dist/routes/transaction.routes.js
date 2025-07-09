"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controller/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ensureRole_1 = require("../middleware/ensureRole");
class transactionRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new transaction_controller_1.transitionsController();
        router.post("/transactions", auth_middleware_1.autenticarToken, ensureRole_1.ensureTipo, controller.create);
        return router;
    }
}
exports.transactionRoutes = transactionRoutes;
