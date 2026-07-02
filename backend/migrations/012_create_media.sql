-- 012_create_media.sql
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  key VARCHAR(1024) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  folder VARCHAR(255) DEFAULT 'root',
  media_type VARCHAR(50) NOT NULL,
  content_type VARCHAR(255),
  size BIGINT,
  thumb_key VARCHAR(1024),
  preview_url VARCHAR(2048),
  duration_seconds INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media (folder);
CREATE INDEX IF NOT EXISTS idx_media_key ON media (key);
