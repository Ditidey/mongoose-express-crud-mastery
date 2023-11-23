import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/api/users', userController.createUser);
router.get('/api/users', userController.listUsers);
router.get('/api/users/:userId', userController.getUserById);
router.put('/api/users/:userId', userController.updateUser);
router.delete('/api/users/:userId', userController.deleteUser);

export default router;
