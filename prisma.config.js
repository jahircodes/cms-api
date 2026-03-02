const { defineConfig } = require('@prisma/config');
const { loadEnv } = require('./src/config/env');

const env = loadEnv();

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env.DATABASE_URL,
  },
});
