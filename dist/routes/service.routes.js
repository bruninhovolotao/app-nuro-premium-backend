"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = require("express");
const service_controller_1 = require("../controller/service.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class serviceRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new service_controller_1.serviceController();
        router.get("/service", controller.list);
        router.post("/service", auth_middleware_1.autenticarToken, controller.create);
        return router;
    }
}
exports.serviceRoutes = serviceRoutes;
