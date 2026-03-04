/**
 * Database Seeding Script
 * -----------------------
 * Seeds the database with initial roles and admin user.
 * Run with: npm run seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const prisma = new PrismaClient();

const roles = [
  { name: 'Super Admin', roleKey: 'SUPER_ADMIN' },
  { name: 'Admin', roleKey: 'ADMIN' },
  { name: 'Editor', roleKey: 'EDITOR' },
  { name: 'Author', roleKey: 'AUTHOR' },
  { name: 'Subscriber', roleKey: 'SUBSCRIBER' },
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

  // Get SUPER_ADMIN role
  const superAdminRole = await prisma.role.findUnique({
    where: { roleKey: 'SUPER_ADMIN' },
  });

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@3348';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      roleId: superAdminRole.id,
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
