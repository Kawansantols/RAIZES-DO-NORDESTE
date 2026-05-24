import { Router } from 'express';
import { authController } from '../controllers/authController';
import { autenticar } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLIENTE, ATENDENTE, COZINHA, GERENTE, ADMIN]
 *               consentimentoLGPD:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get('/perfil', autenticar, authController.perfil);

export default router;