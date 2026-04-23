const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const reviews = await prisma.review.findMany();
  console.log(reviews);
}
main().catch(console.error).finally(() => prisma.$disconnect());
