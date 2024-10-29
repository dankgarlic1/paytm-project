// packages/db/index.ts
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
export { client };
