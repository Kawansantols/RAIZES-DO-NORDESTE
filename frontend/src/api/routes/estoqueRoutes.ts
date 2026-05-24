import { Router } from 'express';
import { estoqueController } from '../controllers/estoqueController';
import { autenticar, autorizar } from '../middlewares/authMiddleware';

const router = Router();

router.get('/unidade/:unidadeId', autenticar, estoqueController.consultarPorUnidade);
router.get('/produto/:produtoId', autenticar, estoqueController.consultarPorProduto);
router.put('/produto/:produtoId', autenticar, autorizar('ADMIN', 'GERENTE'), estoqueController.atualizar);

export default router;