const { 
  createFieldUpdate, 
  getFieldUpdatesByField 
} = require('../services/fieldUpdateService');

const validateFieldUpdateData = (data) => {
  const errors = [];

  if (!data.stage || typeof data.stage !== 'string' || data.stage.trim().length === 0) {
    errors.push('Stage is required and must be a non-empty string');
  } else {
    const validStages = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];
    if (!validStages.includes(data.stage)) {
      errors.push('Stage must be one of: PLANTED, GROWING, READY, HARVESTED');
    }
  }

  if (!data.notes || typeof data.notes !== 'string' || data.notes.trim().length === 0) {
    errors.push('Notes are required and must be a non-empty string');
  }

  return errors;
};

const createFieldUpdateController = async (req, res) => {
  try {
    const { id: fieldId } = req.params;
    const { id: agentId } = req.user;

    // Validate field ID
    if (!Number.isInteger(Number(fieldId)) || Number(fieldId) <= 0) {
      return res.status(400).json({ error: 'Invalid field ID' });
    }

    // Validate input data
    const validationErrors = validateFieldUpdateData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const fieldUpdate = await createFieldUpdate(Number(fieldId), agentId, req.body);
    
    // Return response in the expected format
    res.status(201).json({
      id: fieldUpdate.id,
      fieldId: fieldUpdate.fieldId,
      stage: fieldUpdate.stage,
      notes: fieldUpdate.notes,
      createdAt: fieldUpdate.createdAt
    });
  } catch (error) {
    console.error('Create field update error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFieldUpdatesController = async (req, res) => {
  try {
    const { id: fieldId } = req.params;

    // Validate field ID
    if (!Number.isInteger(Number(fieldId)) || Number(fieldId) <= 0) {
      return res.status(400).json({ error: 'Invalid field ID' });
    }

    const updates = await getFieldUpdatesByField(Number(fieldId));
    
    // Transform response to include agent info, timestamps, and notes
    const transformedUpdates = updates.map(update => ({
      id: update.id,
      fieldId: update.fieldId,
      stage: update.stage,
      notes: update.notes,
      createdAt: update.createdAt,
      agent: {
        id: update.agent.id,
        name: update.agent.name,
        email: update.agent.email
      }
    }));

    res.json(transformedUpdates);
  } catch (error) {
    console.error('Get field updates error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFieldUpdateController,
  getFieldUpdatesController
};
