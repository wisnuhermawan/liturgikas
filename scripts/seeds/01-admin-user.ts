import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Scrypt } from 'oslo/password';
import * as schema from '../../packages/database/src/schema';

const seedAdminUser = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔄 Seeding admin user...');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'admin@catholic-platform.com'),
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, skipping...');
      await client.end();
      return;
    }

    // Hash password using Scrypt (from Oslo)
    const scrypt = new Scrypt();
    const passwordHash = await scrypt.hash('admin123'); // Change this in production!

    // Insert admin user
    const [adminUser] = await db
      .insert(schema.users)
      .values({
        username: 'admin',
        email: 'admin@catholic-platform.com',
        passwordHash,
        fullName: 'Admin Catholic Platform',
        role: 'admin',
        status: 'active',
        emailVerified: true,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@catholic-platform.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANT: Change password after first login!');
    console.log(`🆔 User ID: ${adminUser.id}`);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await client.end();
  }
};

seedAdminUser()
  .then(() => {
    console.log('✅ Admin user seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Admin user seed failed:', error);
    process.exit(1);
  });
