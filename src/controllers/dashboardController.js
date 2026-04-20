const { getAdminDashboard, getAgentDashboard } = require('../services/dashboardService');

const getAdminDashboardData = async (req, res) => {
  try {
    const dashboardData = await getAdminDashboard();
    
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAgentDashboardData = async (req, res) => {
  try {
    const agentId = req.user.id;
    const dashboardData = await getAgentDashboard(agentId);
    
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching agent dashboard data:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAdminDashboardData,
  getAgentDashboardData
};
