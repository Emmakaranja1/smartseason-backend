const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAdminDashboardData } = require('../controllers/dashboardController');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/dashboard/admin - Admin only dashboard
router.get('/admin', authenticateToken, requireAdmin, getAdminDashboardData);

module.exports = router;
