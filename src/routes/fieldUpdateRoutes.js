const express = require('express');
const { requireFieldAgent, requireAdmin } = require('../middleware/roleMiddleware');
const { createFieldUpdateController, getFieldUpdatesController } = require('../controllers/fieldUpdateController');

const router = express.Router({ mergeParams: true });

// POST /api/fields/:id/updates - Field Agent only
router.post('/', requireFieldAgent, createFieldUpdateController);

// GET /api/fields/:id/updates - Admin only
router.get('/', requireAdmin, getFieldUpdatesController);

module.exports = router;
