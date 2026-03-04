/**
 * Database Seeding Script
 * -----------------------
 * Creates initial roles and super admin account for blog CMS.
 * Run once during initial setup: npm run seed
 * Safe to run multiple times (uses upsert/skipDuplicates).
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create roles
  console.log('📝 Creating roles...');
  const rolesData = [
    { name: 'Admin', roleKey: 'ADMIN', status: 'ACTIVE' },
    { name: 'Editor', roleKey: 'EDITOR', status: 'ACTIVE' },
    { name: 'Author', roleKey: 'AUTHOR', status: 'ACTIVE' },
    { name: 'Subscriber', roleKey: 'SUBSCRIBER', status: 'ACTIVE' },
  ];

  for (const roleData of rolesData) {
    await prisma.role.upsert({
      where: { roleKey: roleData.roleKey },
      update: {},
      create: roleData,
    });
  }

  console.log('✅ Roles created/verified\n');

  // Get super admin role
  const adminRole = await prisma.role.findUnique({
    where: { roleKey: 'ADMIN' },
  });

  if (!adminRole) {
    throw new Error('ADMIN role not found after creation');
  }

  // Create super admin user
  console.log('👤 Creating super admin account...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);

    await prisma.user.create({
      data: {
        roleId: adminRole.id,
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        emailVerified: true,
        status: 'ACTIVE',
      },
    });

    console.log('✅ Admin created successfully\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!\n');
  } else {
    console.log('ℹ️  Admin already exists\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', existingAdmin.email);
    console.log('👤 Name:', existingAdmin.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e.message);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
