import { PrismaClient } from "@prisma/client";

declare global {
 var prisma: PrismaClient;
}

let prisma_: PrismaClient;

if (process.env.NODE_ENV === "production") {
 prisma_ = new PrismaClient();
} else {
 if (!global.prisma) {
  global.prisma = new PrismaClient();
 }

 prisma_ = global.prisma;
}

export default prisma_;
