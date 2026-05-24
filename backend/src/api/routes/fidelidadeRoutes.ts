import { Router } from 'express';
import { fidelidadeController } from '../controllers/fidelidadeController';
import { autenticar, autorizar } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', autenticar, fidelidadeController.consultar);
router.post('/adicionar', autenticar, autorizar('ADMIN', 'GERENTE'), fidelidadeController.adicionarPontos);
router.post('/resgatar', autenticar, fidelidadeController.resgatar);

export default router;