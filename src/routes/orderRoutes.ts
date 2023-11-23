import express from 'express';
import * as orderController from '../controllers/orderController';

const router = express.Router();

router.put('/api/users/:userId/orders', orderController.addOrder);
router.get('/api/users/:userId/orders', orderController.listOrders);
router.get('/api/users/:userId/orders/total-price', orderController.calculateTotalPrice);

export default router;
