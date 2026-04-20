const { prisma } = require('../utils/database');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'FIELD_AGENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async deleteUser(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'User deleted successfully' };
  }

  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true
      }
    });

    return user;
  }
}

module.exports = new UserService();
