# Supabase setup for NyumbaHub

This version is connected to the `kejani-hub` Supabase project. Its browser configuration uses the project's public publishable key; the database is protected by row-level security. Never replace that key with a `service_role` or secret key.

## Database setup

The project already had `public.properties`, using UUID listing IDs and `user_id` ownership. The rejected SQL used incompatible `owner_id` and integer identity IDs. The corrected database, photo-storage, and user-profile migrations have now been applied to the connected project; you do not need to rerun the old SQL from SQL Editor.

The included `supabase-setup.sql` now matches the existing UUID/`user_id` schema, preserves listing data, and configures authenticated-only listing reads, owner-scoped write policies, the public `property-images` bucket, and private `profiles`/`user-avatars` resources. Profile rows and avatar files are private to each signed-in user. The SQL is rerunnable for another compatible environment. Listing uploads allow five JPG, PNG, WEBP, or AVIF images per listing, 5 MB each; avatars allow one JPG, PNG, WEBP, or AVIF image up to 2 MB.

## Included behavior

- The first screen requires Supabase sign-in or account creation; signed-out visitors cannot use the site's listings and tools. Authenticated users can read property records and create listings, and only listing owners can update or delete them.
- The landlord dashboard shows listings owned by the signed-in account.
- Sign-in and account creation use Supabase Auth email and password.
- Add/edit forms support multiple property photos; uploaded images appear in listing cards and a selectable detail gallery.
- Signed-in users can manage a private profile and avatar, update account email/password, save listing defaults, choose an accent color, compact property cards, and reduce motion.
- Saved listing defaults prefill new listings only; they never rewrite existing listing contacts or settings.
- Signed-in users can save, apply, pause, resume, and delete private property-search alerts. New matching listing counts are calculated in-app from Supabase `created_at` values; there is no email, SMS, or push delivery.
- Existing sample properties remain demo content and are not stored in Supabase; they are not exposed to signed-out visitors.
- If Supabase is unavailable or unconfigured, the site fails closed and displays a sign-in setup message instead of opening guest demo mode. Listing photo objects remain in the existing public storage bucket; this login gate controls the site and property records, not direct access to a known photo URL.

The `property_alerts` table is an additive extension with owner-only row-level security. Its migration is in `migrations/20261124_property_alerts.sql`; the rerunnable `supabase-setup.sql` also includes it for compatible fresh setup. The alert feature uses the existing Supabase Auth session and browser-safe publishable key.

For production, configure Supabase Auth's site URL and allowed redirect URLs for the website origin, and review the project's email-confirmation and password policies.
