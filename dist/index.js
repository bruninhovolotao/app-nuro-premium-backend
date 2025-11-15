"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const login_routes_1 = require("./routes/login.routes");
const client_routes_1 = require("./routes/client.routes");
const professional_routes_1 = require("./routes/professional.routes");
const transaction_routes_1 = require("./routes/transaction.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send({ message: 'Servidor conectado!' });
});
app.use(login_routes_1.loginRoutes.bind());
app.use(client_routes_1.clientRoutes.bind());
app.use(professional_routes_1.professionalRoutes.bind());
app.use(transaction_routes_1.transactionRoutes.bind());
app.listen(3000, 'localhost', () => {
    console.log('Servidor rodando na porta 3000');
});
