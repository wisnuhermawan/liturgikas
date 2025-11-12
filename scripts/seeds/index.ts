import 'dotenv/config';

const runSeeds = async () => {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Run seeds in order
    console.log('📝 Running seed 1: Admin User');
    await import('./01-admin-user');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('\n📝 Running seed 2: Categories');
    await import('./02-categories');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('\n📝 Running seed 3: Settings');
    await import('./03-settings');

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeds();
