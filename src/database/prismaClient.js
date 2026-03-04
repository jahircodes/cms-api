/**
 * Prisma Client
 * -------------
 * Provides singleton Prisma client for database access.
 * Supports dependency injection with isolated clients for testing.
 */

const { PrismaClient } = require('@prisma/client');

let prisma;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

module.exports = { getPrismaClient };
