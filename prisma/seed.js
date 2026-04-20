const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartseason.com',
      password: '$2b$10$kswShuZpZuuoLOa8/2T17e/zb048YSM7.SCAbvBvY9bsZvLCYmdA.',
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
