const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartseason.com' },
    update: {
      password: '$2b$10$gsr5fJ.qO/XxGQAnpVv4oOwRlswcyznF3i876WOUKRToExrwWUbcK'
    },
    create: {
      email: 'admin@smartseason.com',
      password: '$2b$10$gsr5fJ.qO/XxGQAnpVv4oOwRlswcyznF3i876WOUKRToExrwWUbcK',
      name: 'Admin User',
      role: 'ADMIN',
      createdAt: new Date('2026-04-20 11:17:45.99')
    }
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
