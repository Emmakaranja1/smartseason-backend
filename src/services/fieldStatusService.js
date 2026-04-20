const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const calculateFieldStatus = async (field) => {
  if (!field) {
    throw { status: 400, message: 'Field data is required' };
  }

  const { currentStage, plantingDate, id: fieldId } = field;

  // STATUS RULE: Completed
  if (currentStage === 'HARVESTED') {
    return 'COMPLETED';
  }

  // Get the latest field update to determine when it was last updated
  const latestUpdate = await prisma.fieldUpdate.findFirst({
    where: { fieldId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  const now = new Date();
  const lastUpdateDate = latestUpdate ? latestUpdate.createdAt : plantingDate;
  const daysSinceLastUpdate = Math.floor((now - lastUpdateDate) / (1000 * 60 * 60 * 24));

  // STATUS RULE: At Risk - No updates > 7 days
  if (daysSinceLastUpdate > 7) {
    return 'AT_RISK';
  }

  // STATUS RULE: At Risk - Stage duration exceeded
  const daysSincePlanting = Math.floor((now - plantingDate) / (1000 * 60 * 60 * 24));
  
  if (currentStage === 'PLANTED' && daysSincePlanting > 14) {
    return 'AT_RISK';
  }
  
  if (currentStage === 'GROWING' && daysSincePlanting > 30) {
    return 'AT_RISK';
  }

  // STATUS RULE: Active (default for non-harvested fields that pass the above checks)
  return 'ACTIVE';
};

module.exports = {
  calculateFieldStatus
};
