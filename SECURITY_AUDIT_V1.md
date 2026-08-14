# Korean Speller Security Audit v1

This package keeps the existing UI and data intact and adds a security hardening migration.

Run `supabase_security_hardening_v1.sql` in Supabase SQL Editor AFTER the existing multi-user SQL.

Key fix: `claim_first_admin()` is now permanently closed once any admin profile exists, preventing a random authenticated user from self-promoting after an admin is disabled/deleted.

The migration also reasserts RLS and authenticated-only grants for vocabulary, mistakes, statistics, AI conversations/messages, profile reads, category helpers, and RPCs.

Next checks: test admin/user access, AI permission, logout/session behavior, then deploy the Edge Functions after the migration succeeds.
