import { Router } from 'express';
import { pagamentoController } from '../controllers/pagamentoController';
import { autenticar } from '../middlewares/authMiddleware';

const router = Router();

router.post('/pedido/:pedidoId', autenticar, pagamentoController.processar);
router.get('/pedido/:pedidoId', autenticar, pagamentoController.consultar);

export default router;