"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = void 0;
const express_1 = require("express");
const client_controller_1 = require("../controller/client.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class clientRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new client_controller_1.clientController();
        router.get("/client", controller.list);
        router.get("/client/search", controller.ClientSearch);
        router.get("/report/client/:id", controller.ClientReport);
        router.post("/client", auth_middleware_1.autenticarToken, controller.create);
        router.put("/client/:id", auth_middleware_1.autenticarToken, controller.update);
        router.delete("/client/:id", auth_middleware_1.autenticarToken, controller.delete);
        return router;
    }
}
exports.clientRoutes = clientRoutes;
