## Supabase setup

This project uses Supabase as the backend for:

- auth and profile lifecycle
- track metadata in `public.beats`
- audio files in the `beats` storage bucket
- avatar/profile files in the `profile-assets` storage bucket
- chat messages in `order_messages` and `booking_messages`

Apply migrations from `supabase/migrations` to a Supabase project before running the full production flow.

Recommended order:

1. Link the project with the Supabase CLI.
2. Run the SQL migration from `supabase/migrations`.
3. Verify that the `beats` and `profile-assets` storage buckets exist.
4. Ensure email/password auth is enabled in the Supabase dashboard.
