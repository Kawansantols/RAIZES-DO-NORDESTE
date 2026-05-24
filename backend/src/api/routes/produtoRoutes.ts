import { Router } from 'express';
import { produtoController } from '../controllers/produtoController';
import { autenticar, autorizar } from '../middlewares/authMiddleware';

const router = Router();

router.get('/unidade/:unidadeId', autenticar, produtoController.listar);
router.get('/:id', autenticar, produtoController.buscarPorId);
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), produtoController.criar);
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), produtoController.atualizar);

export default router;