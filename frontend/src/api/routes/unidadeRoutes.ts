import { Router } from 'express';
import { unidadeController } from '../controllers/unidadeController';
import { autenticar, autorizar } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', autenticar, unidadeController.listar);
router.get('/:id', autenticar, unidadeController.buscarPorId);
router.post('/', autenticar, autorizar('ADMIN', 'GERENTE'), unidadeController.criar);
router.put('/:id', autenticar, autorizar('ADMIN', 'GERENTE'), unidadeController.atualizar);

export default router;