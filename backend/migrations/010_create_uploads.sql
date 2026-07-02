-- 010_create_uploads.sql
CREATE TABLE IF NOT EXISTS uploads (
  id SERIAL PRIMARY KEY,
  key VARCHAR(1024) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  content_type VARCHAR(255),
  size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uploads_key ON uploads (key);
