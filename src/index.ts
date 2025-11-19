import express from 'express';
import cors from 'cors';
import { loginRoutes } from './routes/login.routes';
import { clientRoutes } from './routes/client.routes';
import { professionalRoutes } from './routes/professional.routes';
import { transactionRoutes } from './routes/transaction.routes';
import { InvoicingRoutes } from './routes/invoicing.routes';

const app = express();

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({ message: 'Servidor conectado!' })
})

app.use(loginRoutes.bind())
app.use(clientRoutes.bind())
app.use(professionalRoutes.bind())
app.use(transactionRoutes.bind())
app.use(InvoicingRoutes.bind())

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});