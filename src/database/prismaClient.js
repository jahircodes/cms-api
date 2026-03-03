/**
 * Prisma Client
 * -------------
 * Provides singleton Prisma client for database access.
 * Supports dependency injection with isolated clients for testing.
 */

const { PrismaClient } = require('@prisma/client');

const createPrismaClient = () => {
  return new PrismaClient({});
};

// Single shared instance for the app; tests can create isolated clients via createPrismaClient.
const prisma = createPrismaClient();

const getPrismaClient = () => prisma;

module.exports = { createPrismaClient, getPrismaClient, prisma };
