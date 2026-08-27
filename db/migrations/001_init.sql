-- Rakhi Gift — Initial Schema
-- Run this against your PostgreSQL database (Supabase, Neon, or local)

CREATE TABLE IF NOT EXISTS gifts (
  id           TEXT PRIMARY KEY,
  sister_name  TEXT NOT NULL,
  brother_name TEXT NOT NULL,
  message      TEXT NOT NULL,
  theme        TEXT NOT NULL DEFAULT 'brown',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  view_count   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'flagged', 'removed'))
);

CREATE TABLE IF NOT EXISTS gift_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id     TEXT NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by gift_id (used every time a gift page loads)
CREATE INDEX IF NOT EXISTS idx_gift_images_gift_id ON gift_images(gift_id);

-- Index for status filtering (admin queries)
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
