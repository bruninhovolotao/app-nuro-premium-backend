"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalRoutes = void 0;
const express_1 = require("express");
const professional_controller_1 = require("../controller/professional.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ensureRole_1 = require("../middleware/ensureRole");
class professionalRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new professional_controller_1.professionalController();
        router.get("/professional", controller.list);
        router.get("/professional/search", controller.professionalSearch);
        router.get("/report/professional/:id", ensureRole_1.ensureTipo, controller.professionalReport);
        router.post("/professional", auth_middleware_1.autenticarToken, controller.create);
        return router;
    }
}
exports.professionalRoutes = professionalRoutes;
