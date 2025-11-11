import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
export const createDatabaseClient = (connectionString: string) => {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};

// Export schema and types
export { schema };
export * from './schema';
