import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './api/routes/authRoutes';
import unidadeRoutes from './api/routes/unidadeRoutes';
import produtoRoutes from './api/routes/produtoRoutes';
import estoqueRoutes from './api/routes/estoqueRoutes';
import pedidoRoutes from './api/routes/pedidoRoutes';
import pagamentoRoutes from './api/routes/pagamentoRoutes';
import fidelidadeRoutes from './api/routes/fidelidadeRoutes';
import { errorHandler } from './shared/errors/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Raízes do Nordeste API rodando!' });
});

app.use('/auth', authRoutes);
app.use('/unidades', unidadeRoutes);
app.use('/produtos', produtoRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/fidelidade', fidelidadeRoutes);

app.use(errorHandler);

export default app;