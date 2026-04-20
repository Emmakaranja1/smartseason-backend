const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin, requireAdminOrFieldAgent } = require('../middleware/roleMiddleware');
const {
  createFieldController,
  getFieldsController,
  getFieldByIdController,
  updateFieldController,
  deleteFieldController
} = require('../controllers/fieldController');
const fieldUpdateRoutes = require('./fieldUpdateRoutes');

const router = express.Router();

// POST /api/fields - Create a new field (Admin only)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  createFieldController
);

// GET /api/fields - Get fields (Admin: all, Field Agent: assigned only)
router.get('/', 
  authenticateToken, 
  requireAdminOrFieldAgent, 
  getFieldsController
);

// GET /api/fields/:id - Get field by ID (Admin: any, Field Agent: assigned only)
router.get('/:id', 
  authenticateToken, 
  requireAdminOrFieldAgent, 
  getFieldByIdController
);

// PUT /api/fields/:id - Update field (Admin only)
router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  updateFieldController
);

// DELETE /api/fields/:id - Delete field (Admin only)
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteFieldController
);

// Field update routes (nested under /api/fields/:id)
router.use('/:id/updates', authenticateToken, fieldUpdateRoutes);

module.exports = router;
