-- 006_create_news.sql
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt VARCHAR(512),
  body TEXT NOT NULL,
  seo_title VARCHAR(255),
  seo_description VARCHAR(512),
  featured_image VARCHAR(1024),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_slug ON news (lower(slug));
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at);
