# LOTUNIX — Secure Checkout & Enrollment Implementation Plan

Status: preparation only · Updated 2026-11-19 · Branch: staging/lotunix-checkout-preparation

## Non-negotiable preservation
- Do not modify `lotunix-members.html` markup, typography, palette, layout, or existing lesson/notes/progress logic.
- Keep 13 lessons and S.I.G.N.A.L. prompt vault protected by authenticated active enrollment.
- One-time course purchase only; no subscription.
- This document activates no checkout, charges, or paid course access.

## Verified existing infrastructure
- Course `lotunix-13`, 13 lessons, 13 prompts.
- `lotunix_orders`: buyer_id, course_id, amount_minor, currency (currently USD), order_status, provider_name, provider_payment_id, provider_event_id, timestamps.
- Status check: pending/paid/failed/cancelled/refunded. Paid status requires provider_name, provider_payment_id and paid_at.
- Uniqueness: provider_event_id; (provider_name,provider_payment_id).
- `lotunix_enrollments`: unique (user_id,course_id), statuses active/revoked; grant_source verified_purchase/owner_test/manual_admin.
- RLS: members can SELECT own orders/enrollment; no authenticated INSERT/UPDATE policies for orders or enrollments; progress and vault gated by member access.
- Existing test enrollment must be preserved.

## Checkout provider decision gate
Before implementation: confirm a processor that supports the registered Bahamas business, supported settlement bank/account, one-time digital-product sales, chargeback/refund operations, webhook verification and supported currency. Confirm actual course price and purchase terms; do not invent these.

## Planned server-side transaction workflow
1. Authenticated member selects purchase from a separate checkout page; pricing determined server-side, not from browser input.
2. Trusted server creates a pending order and provider checkout session using server-only credentials. Never put provider secrets or Supabase service keys in GitHub Pages HTML.
3. Provider sends webhook to server endpoint. Verify raw-body signature and provider identifiers, amount/currency, outcome, buyer, and course, with replay protection. Browser success redirects cannot grant enrollment.
4. Record verified paid outcome and upsert one enrollment (grant_source=verified_purchase) in an atomic, idempotent server-side transaction. Never accept client-selected paid status.
5. A duplicate delivery must not duplicate orders or grants. Failed/cancelled payments do not grant access. Refund/reversal handling must have a documented policy and authorized server-side state change.
6. Redirect signed-in customer to existing `lotunix-members.html` after verification, or to a pending-confirmation state when webhook processing has not completed.
7. Log event identifiers and safe diagnostics, not card data, full webhook secrets, or customer notes.

## Acceptance tests before activation
- Unauthenticated cannot read private prompts or another member's notes/orders.
- No enrolled access after merely registering, opening checkout, cancelling, failing, or visiting success URL.
- A verified paid webhook unlocks only the correct buyer/course, once.
- Replayed webhooks are harmless.
- Wrong price, wrong currency, forged signature, wrong buyer, and mismatched provider payment ID do not unlock.
- Pending-to-paid race and refund paths are tested.
- All 13 lessons, private notes, and progress still work; visual regression of existing dashboard passes.
- Production secret storage and password security reviewed before live sales.

## Security review item
Supabase security advisor reported `auth_leaked_password_protection` WARN (disabled). Enable through Supabase Auth settings after checking login impact: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Current stop condition
Do not build or expose live checkout buttons, accept card details, or auto-enroll paid members until a verified provider, price and contractual settings are supplied.
