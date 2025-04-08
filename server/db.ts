import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL as string;

// For migrations and other operations that need more control
export const migrationClient = postgres(connectionString, { max: 1 });

// For query execution
const queryClient = postgres(connectionString);

// Create the db instance with the schema
export const db = drizzle(queryClient, { schema });

// Utility function to run migrations
export async function runMigrations() {
  try {
    console.log("Running migrations...");
    await migrate(drizzle(migrationClient), { migrationsFolder: "migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}