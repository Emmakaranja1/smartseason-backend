const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createFieldUpdate = async (fieldId, agentId, updateData) => {
  const { stage, notes } = updateData;

  // Validate field exists
  const field = await prisma.field.findUnique({
    where: { id: fieldId }
  });

  if (!field) {
    throw { status: 404, message: 'Field not found' };
  }

  // Ensure agent is assigned to the field
  if (field.assignedAgentId !== agentId) {
    throw { status: 403, message: 'You can only update fields assigned to you' };
  }

  // Validate stage enum
  const validStages = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];
  if (!validStages.includes(stage)) {
    throw { status: 400, message: 'Invalid stage. Must be one of: PLANTED, GROWING, READY, HARVESTED' };
  }

  // Create FieldUpdate record
  const fieldUpdate = await prisma.fieldUpdate.create({
    data: {
      fieldId,
      agentId,
      stage,
      notes
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      field: {
        select: {
          id: true,
          name: true,
          currentStage: true
        }
      }
    }
  });

  // Update Field.currentStage
  await prisma.field.update({
    where: { id: fieldId },
    data: { currentStage: stage }
  });

  return fieldUpdate;
};

const getFieldUpdatesByField = async (fieldId) => {
  // Validate field exists
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    select: { id: true, name: true }
  });

  if (!field) {
    throw { status: 404, message: 'Field not found' };
  }

  // Get all updates for the field with agent info
  const updates = await prisma.fieldUpdate.findMany({
    where: { fieldId },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return updates;
};

module.exports = {
  createFieldUpdate,
  getFieldUpdatesByField
};
