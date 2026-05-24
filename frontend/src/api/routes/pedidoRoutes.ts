import { Router } from 'express';
import { pedidoController } from '../controllers/pedidoController';
import { autenticar, autorizar } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadeId:
 *                 type: integer
 *               canalPedido:
 *                 type: string
 *                 enum: [APP, TOTEM, BALCAO, PICKUP, WEB]
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       404:
 *         description: Produto ou unidade não encontrado
 *       409:
 *         description: Estoque insuficiente
 */
router.post('/', autenticar, pedidoController.criar);

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: canalPedido
 *         schema:
 *           type: string
 *           enum: [APP, TOTEM, BALCAO, PICKUP, WEB]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/', autenticar, autorizar('ADMIN', 'GERENTE', 'COZINHA'), pedidoController.listar);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', autenticar, pedidoController.buscarPorId);

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AGUARDANDO_PAGAMENTO, PAGO, EM_PREPARO, PRONTO, ENTREGUE, CANCELADO]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/:id/status', autenticar, autorizar('ADMIN', 'GERENTE', 'COZINHA'), pedidoController.atualizarStatus);

export default router;