const { 
  createField, 
  getFields, 
  getFieldById, 
  updateField, 
  deleteField 
} = require('../services/fieldService');

const validateFieldData = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Field name is required and must be a non-empty string');
  }

  if (!data.cropType || typeof data.cropType !== 'string' || data.cropType.trim().length === 0) {
    errors.push('Crop type is required and must be a non-empty string');
  }

  if (!data.plantingDate) {
    errors.push('Planting date is required');
  } else {
    const plantingDate = new Date(data.plantingDate);
    if (isNaN(plantingDate.getTime())) {
      errors.push('Planting date must be a valid date');
    }
  }

  if (!data.currentStage) {
    errors.push('Current stage is required');
  } else {
    const validStages = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];
    if (!validStages.includes(data.currentStage)) {
      errors.push('Current stage must be one of: PLANTED, GROWING, READY, HARVESTED');
    }
  }

  if (data.assignedAgentId !== undefined && data.assignedAgentId !== null) {
    if (!Number.isInteger(data.assignedAgentId) || data.assignedAgentId <= 0) {
      errors.push('Assigned agent ID must be a positive integer');
    }
  }

  return errors;
};

const createFieldController = async (req, res) => {
  try {
    const validationErrors = validateFieldData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const field = await createField(req.body);
    res.status(201).json(field);
  } catch (error) {
    console.error('Create field error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFieldsController = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const fields = await getFields(role, userId);
    res.json(fields);
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFieldByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'Invalid field ID' });
    }

    const field = await getFieldById(Number(id), role, userId);
    res.json(field);
  } catch (error) {
    console.error('Get field by ID error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateFieldController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'Invalid field ID' });
    }

    // Validate updated data
    const validationErrors = validateFieldData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    const field = await updateField(Number(id), req.body);
    res.json(field);
  } catch (error) {
    console.error('Update field error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFieldController = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: 'Invalid field ID' });
    }

    const result = await deleteField(Number(id));
    res.json(result);
  } catch (error) {
    console.error('Delete field error:', error);
    
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFieldController,
  getFieldsController,
  getFieldByIdController,
  updateFieldController,
  deleteFieldController
};
