const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createField = async (fieldData) => {
  const { name, cropType, plantingDate, currentStage, assignedAgentId } = fieldData;

  // Validate assigned agent exists 
  if (assignedAgentId) {
    const agent = await prisma.user.findUnique({
      where: { id: assignedAgentId },
      select: { id: true, role: true }
    });

    if (!agent) {
      throw { status: 404, message: 'Assigned agent not found' };
    }

    if (agent.role !== 'FIELD_AGENT') {
      throw { status: 400, message: 'Assigned user must be a FIELD_AGENT' };
    }
  }

  const field = await prisma.field.create({
    data: {
      name,
      cropType,
      plantingDate: new Date(plantingDate),
      currentStage,
      assignedAgentId
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

  return field;
};

const getFields = async (userRole, userId) => {
  let fields;

  if (userRole === 'ADMIN') {
    // Admin can see all fields
    fields = await prisma.field.findMany({
      include: {
        assignedAgent: {
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
  } else if (userRole === 'FIELD_AGENT') {
    // Field agents can only see their assigned fields
    fields = await prisma.field.findMany({
      where: {
        assignedAgentId: userId
      },
      include: {
        assignedAgent: {
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
  }

  return fields;
};

const getFieldById = async (fieldId, userRole, userId) => {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
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

  if (!field) {
    throw { status: 404, message: 'Field not found' };
  }

  // Check authorization
  if (userRole === 'FIELD_AGENT' && field.assignedAgentId !== userId) {
    throw { status: 403, message: 'Access denied - field not assigned to you' };
  }

  return field;
};

const updateField = async (fieldId, fieldData) => {
  const { name, cropType, plantingDate, currentStage, assignedAgentId } = fieldData;

  // Check if field exists
  const existingField = await prisma.field.findUnique({
    where: { id: fieldId }
  });

  if (!existingField) {
    throw { status: 404, message: 'Field not found' };
  }

  // Validate assigned agent exists 
  if (assignedAgentId !== undefined && assignedAgentId !== null) {
    const agent = await prisma.user.findUnique({
      where: { id: assignedAgentId },
      select: { id: true, role: true }
    });

    if (!agent) {
      throw { status: 404, message: 'Assigned agent not found' };
    }

    if (agent.role !== 'FIELD_AGENT') {
      throw { status: 400, message: 'Assigned user must be a FIELD_AGENT' };
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (cropType !== undefined) updateData.cropType = cropType;
  if (plantingDate !== undefined) updateData.plantingDate = new Date(plantingDate);
  if (currentStage !== undefined) updateData.currentStage = currentStage;
  if (assignedAgentId !== undefined) updateData.assignedAgentId = assignedAgentId;

  const field = await prisma.field.update({
    where: { id: fieldId },
    data: updateData,
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

  return field;
};

const deleteField = async (fieldId) => {
  const existingField = await prisma.field.findUnique({
    where: { id: fieldId }
  });

  if (!existingField) {
    throw { status: 404, message: 'Field not found' };
  }

  await prisma.field.delete({
    where: { id: fieldId }
  });

  return { message: 'Field deleted successfully' };
};

module.exports = {
  createField,
  getFields,
  getFieldById,
  updateField,
  deleteField
};
