/**
 * Prisma Client
 * -------------
 * Provides singleton Prisma client for database access.
 * Supports dependency injection with isolated clients for testing.
 */

const { PrismaClient } = require('@prisma/client');
const { loadEnv } = require('../config/env');

const createPrismaClient = () => {
  const env = loadEnv();
  return new PrismaClient({ datasourceUrl: env.DATABASE_URL });
};

// Single shared instance for the app; tests can create isolated clients via createPrismaClient.
const prisma = createPrismaClient();

const getPrismaClient = () => prisma;

module.exports = { createPrismaClient, getPrismaClient, prisma };
