-- ============================================================
-- Notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,  -- like | follow | booking_new | booking_update | order_new | order_update
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_unread
  ON notifications(user_id, read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_select" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "owner_update" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- service role (or authenticated via RPC) may insert
CREATE POLICY "auth_insert" ON notifications
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- Studio reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS studio_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id    UUID REFERENCES studios(id)   ON DELETE CASCADE NOT NULL,
  reviewer_id  UUID REFERENCES profiles(id)  ON DELETE CASCADE NOT NULL,
  booking_id   UUID REFERENCES bookings(id)  ON DELETE CASCADE NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(booking_id)  -- one review per booking
);

CREATE INDEX IF NOT EXISTS studio_reviews_studio
  ON studio_reviews(studio_id, created_at DESC);

ALTER TABLE studio_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON studio_reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviewer_insert" ON studio_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
