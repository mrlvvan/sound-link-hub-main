-- ============================================================
-- Beat license tiers
-- ============================================================
CREATE TABLE IF NOT EXISTS beat_licenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beat_id     UUID REFERENCES beats(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,  -- 'mp3' | 'wav' | 'exclusive'
  label       TEXT NOT NULL,  -- human display label
  price       INTEGER NOT NULL CHECK (price > 0),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(beat_id, name)
);

CREATE INDEX IF NOT EXISTS beat_licenses_beat
  ON beat_licenses(beat_id, price ASC);

ALTER TABLE beat_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON beat_licenses
  FOR SELECT USING (TRUE);

CREATE POLICY "owner_write" ON beat_licenses
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM beats WHERE id = beat_id)
  );

-- ============================================================
-- Extend orders with license info (nullable — not all orders are for beats)
-- ============================================================
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS license_id   UUID REFERENCES beat_licenses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS license_name TEXT;
