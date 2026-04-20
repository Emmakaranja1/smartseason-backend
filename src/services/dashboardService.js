const { PrismaClient } = require('@prisma/client');
const { calculateFieldStatus } = require('./fieldStatusService');

const prisma = new PrismaClient();

const getAdminDashboard = async () => {
  try {
    // Get all fields
    const fields = await prisma.field.findMany({
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate total fields
    const totalFields = fields.length;

    // Calculate status breakdown
    let activeFields = 0;
    let atRiskFields = 0;
    let completedFields = 0;

    const fieldsWithStatus = await Promise.all(
      fields.map(async (field) => {
        const status = await calculateFieldStatus(field);
        
        if (status === 'ACTIVE') activeFields++;
        else if (status === 'AT_RISK') atRiskFields++;
        else if (status === 'COMPLETED') completedFields++;

        return {
          ...field,
          status
        };
      })
    );

    // Calculate fields per agent
    const fieldsPerAgent = [];
    const agentFieldMap = new Map();

    fieldsWithStatus.forEach(field => {
      if (field.assignedAgentId) {
        const currentCount = agentFieldMap.get(field.assignedAgentId) || 0;
        agentFieldMap.set(field.assignedAgentId, currentCount + 1);
      }
    });

    agentFieldMap.forEach((count, agentId) => {
      fieldsPerAgent.push({
        agentId,
        count
      });
    });

    // Sort by agentId 
    fieldsPerAgent.sort((a, b) => a.agentId - b.agentId);

    // Calculate agent activity (updates count per agent)
    const agentUpdates = await prisma.fieldUpdate.groupBy({
      by: ['agentId'],
      _count: {
        id: true
      }
    });

    const agentActivity = agentUpdates.map(update => ({
      agentId: update.agentId,
      updates: update._count.id
    }));

    // Sort by agentId 
    agentActivity.sort((a, b) => a.agentId - b.agentId);

    return {
      totalFields,
      activeFields,
      atRiskFields,
      completedFields,
      fieldsPerAgent,
      agentActivity
    };
  } catch (error) {
    console.error('Error in getAdminDashboard:', error);
    throw { status: 500, message: 'Failed to fetch dashboard data' };
  }
};

const getAgentDashboard = async (agentId) => {
  try {
    // Get fields assigned to the agent
    const assignedFields = await prisma.field.findMany({
      where: {
        assignedAgentId: agentId
      },
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate status breakdown for agent's fields
    let activeFields = 0;
    let atRiskFields = 0;
    let completedFields = 0;

    const fieldsWithStatus = await Promise.all(
      assignedFields.map(async (field) => {
        const status = await calculateFieldStatus(field);
        
        if (status === 'ACTIVE') activeFields++;
        else if (status === 'AT_RISK') atRiskFields++;
        else if (status === 'COMPLETED') completedFields++;

        return {
          ...field,
          status
        };
      })
    );

    // Filter at-risk fields
    const atRiskFieldsList = fieldsWithStatus.filter(field => field.status === 'AT_RISK');

    // Get recent updates for this agent
    const recentUpdates = await prisma.fieldUpdate.findMany({
      where: {
        agentId: agentId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    const statusBreakdown = {
      active: activeFields,
      atRisk: atRiskFields,
      completed: completedFields
    };

    return {
      assignedFields: fieldsWithStatus,
      statusBreakdown,
      atRiskFields: atRiskFieldsList,
      recentUpdates
    };
  } catch (error) {
    console.error('Error in getAgentDashboard:', error);
    throw { status: 500, message: 'Failed to fetch agent dashboard data' };
  }
};

module.exports = {
  getAdminDashboard,
  getAgentDashboard
};
