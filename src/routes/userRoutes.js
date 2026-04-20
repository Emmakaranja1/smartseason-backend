const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin, requireAdminOrFieldAgent } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/users - Create user (Admin only)
router.post('/', requireAdmin, userController.createUser);

// GET /api/users - Get all users (Admin only)
router.get('/', requireAdmin, userController.getAllUsers);

// GET /api/users/:id - Get single user (Admin or owner)
router.get('/:id', requireAdminOrFieldAgent, userController.getUserById);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
