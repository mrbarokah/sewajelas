CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`occurred_at` text NOT NULL,
	`action` text NOT NULL,
	`outcome` text NOT NULL,
	`correlation_id` text NOT NULL,
	`app_version` text NOT NULL
);
