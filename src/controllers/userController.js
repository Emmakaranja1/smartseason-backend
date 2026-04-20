const userService = require('../services/userService');

class UserController {
  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, email, password' 
        });
      }

      if (role && !['ADMIN', 'FIELD_AGENT'].includes(role)) {
        return res.status(400).json({ 
          error: 'Invalid role. Must be ADMIN or FIELD_AGENT' 
        });
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        role: role || 'FIELD_AGENT'
      });

      res.status(201).json(user);
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Get user by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ 
          error: 'Cannot delete your own account' 
        });
      }

      const result = await userService.deleteUser(id);
      res.json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new UserController();
