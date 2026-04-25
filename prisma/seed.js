const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Generate new password hash
  const newPassword = 'smartseason2024';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  console.log('Generated password hash for admin:', newPassword);
  
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartseason.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@smartseason.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      createdAt: new Date('2026-04-20 11:17:45.99')
    }
  });

  console.log('Admin user created/updated:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
