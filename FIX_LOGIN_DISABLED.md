# Login Fix

This version fixes the first/only-account login issue.

## What was wrong

If the first account's `profiles` row already existed but had `role='admin'` and `status='disabled'`, the frontend would not call `claim_first_admin()` because it only checked the role. The account therefore remained disabled and the sign-in modal stayed open.

## What changed

`js/admin/auth.js` now attempts the first-admin claim when the profile is either:
- missing
- not an admin
- not active

After a successful active login, the sign-in modal closes before switching to the appropriate page.

## Important

If another active admin already exists, a disabled account will remain disabled by design. An admin must enable it from User Management.
