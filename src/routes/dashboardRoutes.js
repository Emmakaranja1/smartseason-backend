const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAdminDashboardData, getAgentDashboardData } = require('../controllers/dashboardController');
const { requireAdmin, requireFieldAgent } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/dashboard/admin - Admin only dashboard
router.get('/admin', authenticateToken, requireAdmin, getAdminDashboardData);

// GET /api/dashboard/agent - Field Agent only dashboard
router.get('/agent', authenticateToken, requireFieldAgent, getAgentDashboardData);

module.exports = router;
