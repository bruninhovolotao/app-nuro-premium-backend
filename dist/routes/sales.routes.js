"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const sales_controller_1 = require("../controller/sales.controller");
class salesRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new sales_controller_1.salesController();
        router.get("/sales", controller.list);
        router.post("/sales", auth_middleware_1.autenticarToken, controller.create);
        return router;
    }
}
exports.salesRoutes = salesRoutes;
