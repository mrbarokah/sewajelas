// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const studio = sqliteTable('studio', { userId: text('user_id').primaryKey(), revision: integer('revision').notNull().default(0), state: text('state').notNull(), updatedAt: integer('updated_at').notNull() });
export const credentials = sqliteTable('credentials', { userId: text('user_id').primaryKey(), cipher: text('cipher').notNull(), updatedAt: integer('updated_at').notNull() });
export const quotas = sqliteTable('quotas', { id: text('id').primaryKey(), count: integer('count').notNull().default(0), inputTokens: integer('input_tokens').notNull().default(0), outputTokens: integer('output_tokens').notNull().default(0) });
