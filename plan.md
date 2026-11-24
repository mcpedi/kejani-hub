# Kejani Hub — reference feature transfer

## Goal and scope

Review the user-supplied Nyumba360 archive and add compatible, genuinely functional features to Kejani Hub while preserving its current static HTML/CSS/JavaScript architecture, Supabase project, UUID property ownership, Auth, RLS, photo storage, profile controls, and Vercel/GitHub deployment. Do not transplant the reference application's Drizzle/Neon backend, run archive scripts, present its hardcoded sample data or simulated checkout as real, or expose admin/payment capabilities without a secured backend.

The reference and target audit confirms that Kejani already provides property discovery and filtering, an interactive map, listing detail galleries, local favorites, property comparison, owner-scoped listing management, account profiles, and direct seller contact. The user-facing gap selected for this implementation is saved property searches with authenticated, account-private, in-app new-listing match counts. The reference's standalone alert form only showed success locally; Kejani's version will persist alert criteria in Supabase with owner-only RLS, apply saved criteria, and count real new listing rows by `created_at`. It will not claim to send email/push notifications.

## Implementation approach and structure

- `index.html`: add compact Save Search / Saved Searches actions beside marketplace listing controls and an accessible saved-search dialog.
- `app.js`: snapshot/apply current filters, load and render saved searches, count newly-created matching Supabase listings, and handle pause/resume/delete actions. Preserve current filtering, map, favorites, compare, and demo fallback behavior.
- `supabase.js`: add a small authenticated repository for `property_alerts`; derive the owner from the active Supabase session and rely on RLS.
- `supabase-setup.sql`: include the additive, rerunnable table, index, grants, and owner-scoped RLS policies for fresh compatible installs.
- A separate SQL migration artifact documents the production schema extension; apply the additive migration to the existing `kejani-hub` Supabase project only after confirming current table state.
- Reuse the existing NyumbaHub/Keja Hub visual language: compact rounded controls, emerald brand color, responsive layout, explicit status copy, and no new framework or external service.

## Data and security constraints

`property_alerts` stores `id`, `user_id`, a bounded display name, JSON filter criteria, enabled state, and creation/update timestamps. Every read/write policy is restricted to `auth.uid() = user_id`; no public read policy or service key is added. The browser client uses only the existing Supabase publishable key. Matching is evaluated against public listings already returned by Kejani Hub and requires `created_at` newer than the saved alert. Delete/pause operations stay within the signed-in owner context.

## Project structure

This remains a single-page static application: root `index.html` contains marketplace and dialogs; root `app.js` owns listing/filter/map/dashboard interactions; `supabase.js` owns browser-side auth and data repositories; `profile.js` owns private user profile controls; `style.css` owns responsive custom styles; `supabase-setup.sql` documents compatible schema/RLS setup. No React, Node backend, Neon database, or new build system will be introduced.