/**
 * Database Seeding Script
 * -----------------------
 * Seeds the database with initial roles and admin user.
 * Run with: npm run seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../src/constants/roles');
require('dotenv/config');

const prisma = new PrismaClient();

const roles = [
  { name: 'Admin', roleKey: USER_ROLES.ADMIN },
  { name: 'Editor', roleKey: USER_ROLES.EDITOR },
  { name: 'Author', roleKey: USER_ROLES.AUTHOR },
  { name: 'Subscriber', roleKey: USER_ROLES.SUBSCRIBER },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed roles
  console.log('Creating roles...');
  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleKey: role.roleKey },
      update: {},
      create: role,
    });
  }
  console.log(`✅ Created ${roles.length} roles`);

  // Get ADMIN role
  const adminRole = await prisma.role.findUnique({
    where: { roleKey: USER_ROLES.ADMIN },
  });

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@3348';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      roleId: adminRole.id,
      emailVerified: true,
    },
  });

  console.log(`✅ Created admin user: ${adminEmail}`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
