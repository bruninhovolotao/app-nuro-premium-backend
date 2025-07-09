"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class productRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new product_controller_1.productController();
        router.get("/product", controller.list);
        router.post("/product", auth_middleware_1.autenticarToken, controller.create);
        return router;
    }
}
exports.productRoutes = productRoutes;
