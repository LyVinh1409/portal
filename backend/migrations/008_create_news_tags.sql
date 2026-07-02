-- 008_create_news_tags.sql
CREATE TABLE IF NOT EXISTS news_tags (
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_news_tags_unique ON news_tags (news_id, tag_id);
