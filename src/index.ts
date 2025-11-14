import express from 'express';
import cors from 'cors';
import { loginRoutes } from './routes/login.routes';
import { clientRoutes } from './routes/client.routes';
import { serviceRoutes } from './routes/service.routes';
import { productRoutes } from './routes/product.routes';
import { professionalRoutes } from './routes/professional.routes';
import { transactionRoutes } from './routes/transaction.routes';
import { salesRoutes } from './routes/sales.routes';

const app = express();

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({ message: 'Servidor conectado!' })
})

app.use(loginRoutes.bind())
app.use(clientRoutes.bind())
app.use(serviceRoutes.bind())
app.use(productRoutes.bind())
app.use(professionalRoutes.bind())
app.use(transactionRoutes.bind())
app.use(salesRoutes.bind())

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3000');
});