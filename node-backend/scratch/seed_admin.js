const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@dreamdrive.com',
      password: 'adminpassword123',
      role: 'ADMIN',
      city: 'Mumbai'
    }
  });
  console.log('Admin user created:', admin);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
