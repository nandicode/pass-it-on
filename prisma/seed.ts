import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seedData";

const prisma = new PrismaClient();

runSeed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
