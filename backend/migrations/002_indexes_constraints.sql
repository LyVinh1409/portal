-- 002_indexes_constraints.sql
-- Case-insensitive unique index on email and created_at index
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users ((lower(email)));
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);
