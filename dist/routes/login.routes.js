"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = require("express");
const login_controller_1 = require("../controller/login.controller");
class loginRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new login_controller_1.loginController();
        router.post("/signup", controller.signup);
        router.post("/login", controller.login);
        router.get("/usuario/:id", controller.list);
        router.put("/usuario/:id", controller.update);
        router.delete("/usuario/:id", controller.delete);
        return router;
    }
}
exports.loginRoutes = loginRoutes;
