-- 011_create_banners.sql
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_key VARCHAR(1024) NOT NULL,
  image_url VARCHAR(2048) NOT NULL,
  link VARCHAR(1024),
  position VARCHAR(100) DEFAULT 'hero',
  is_active BOOLEAN DEFAULT true,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_position ON banners (position);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners (is_active);
