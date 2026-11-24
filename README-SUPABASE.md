# Supabase setup for NyumbaHub

This version is connected to the `kejani-hub` Supabase project. Its browser configuration uses the project's public publishable key; the database is protected by row-level security. Never replace that key with a `service_role` or secret key.

## Database setup

The project already had `public.properties`, using UUID listing IDs and `user_id` ownership. The rejected SQL used incompatible `owner_id` and integer identity IDs. The corrected database and photo-storage migrations have now been applied to the connected project; you do not need to rerun the old SQL from SQL Editor.

The included `supabase-setup.sql` now matches the existing UUID/`user_id` schema, preserves listing data, and recreates owner-scoped RLS policies, and a public `property-images` bucket. It is safe to run again if setting up another compatible environment. Uploads are limited to five JPG, PNG, WEBP, or AVIF images per listing, 5 MB each; signed-in users upload only into their own user-ID folder.

## Included behavior

- Anyone can read property records; authenticated users can create listings, and only their owners can update or delete them.
- The landlord dashboard shows listings owned by the signed-in account.
- Sign-in and account creation use Supabase Auth email and password.
- Add/edit forms support multiple property photos; uploaded images appear in listing cards and a selectable detail gallery.
- Existing sample properties remain demo content and are not stored in Supabase.
- Without Supabase configuration, the site falls back to browser-local demo storage.

For production, configure Supabase Auth's site URL and allowed redirect URLs for the website origin, and review the project's email-confirmation and password policies.
