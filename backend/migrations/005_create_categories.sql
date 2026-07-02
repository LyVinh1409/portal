-- 005_create_categories.sql
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  parent_id INTEGER NULL REFERENCES categories(id) ON DELETE SET NULL,
  path VARCHAR(1024) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_path ON categories (path);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_parent ON categories (lower(slug), parent_id);
