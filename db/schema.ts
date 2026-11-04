// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const studio = sqliteTable('studio', { userId: text('user_id').primaryKey(), revision: integer('revision').notNull().default(0), state: text('state').notNull(), updatedAt: integer('updated_at').notNull() });
export const credentials = sqliteTable('credentials', { userId: text('user_id').primaryKey(), cipher: text('cipher').notNull(), updatedAt: integer('updated_at').notNull() });
export const quotas = sqliteTable('quotas', { id: text('id').primaryKey(), count: integer('count').notNull().default(0), inputTokens: integer('input_tokens').notNull().default(0), outputTokens: integer('output_tokens').notNull().default(0) });

// Per-account operational event journal; message bodies and credentials are excluded.
export const auditEvents = sqliteTable('audit_events', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(),
 occurredAt: text('occurred_at').notNull(), action: text('action').notNull(),
 outcome: text('outcome').notNull(), correlationId: text('correlation_id').notNull(),
 appVersion: text('app_version').notNull()
}, t => [index('audit_user_time_idx').on(t.userId,t.occurredAt)]);
