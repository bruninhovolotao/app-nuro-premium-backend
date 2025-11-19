"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicingRoutes = void 0;
const express_1 = require("express");
const invoicing_controller_1 = require("../controller/invoicing.controller");
class InvoicingRoutes {
    static bind() {
        const router = (0, express_1.Router)();
        const controller = new invoicing_controller_1.invoicingController();
        router.get("/invoicing", controller.invoicing);
        return router;
    }
}
exports.InvoicingRoutes = InvoicingRoutes;
