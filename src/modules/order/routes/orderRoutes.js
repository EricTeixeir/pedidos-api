import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticate } from "../../../middlewares/authenticate.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos (requer autenticação JWT)
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroPedido
 *               - valorTotal
 *               - dataCriacao
 *               - items
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: v10089015vdb-01
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 example: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       409:
 *         description: Pedido já existe
 */
router.post("/", authenticate, orderController.create);
router.get("/list", authenticate, orderController.findAll);
router.get("/:orderId", authenticate, orderController.findByOrderId);
router.put("/:orderId", authenticate, orderController.update);
router.delete("/:orderId", authenticate, orderController.delete);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos do usuário autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/list", authenticate, orderController.findAll);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Busca um pedido pelo número
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:orderId", authenticate, orderController.findByOrderId);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido pelo número
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: v10089015vdb-01
 *               valorTotal:
 *                 type: number
 *                 example: 20000
 *               dataCriacao:
 *                 type: string
 *                 example: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 2
 *                     valorItem:
 *                       type: number
 *                       example: 2000
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.put("/:orderId", authenticate, orderController.update);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido pelo número
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       204:
 *         description: Pedido deletado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:orderId", authenticate, orderController.delete);

export default router;