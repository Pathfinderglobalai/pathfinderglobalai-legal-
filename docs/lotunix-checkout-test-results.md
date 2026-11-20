# LOTUNIX staging checkout verification — 2026-11-19

## Implemented
- Staging checkout page `lotunix-checkout.html` now checks server availability through Supabase.
- Authenticated server endpoint `lotunix-checkout-initiate` is deployed ACTIVE version 1.
- Endpoint rejects non-POST requests, disallowed browser origins, missing/invalid auth, invalid course IDs, and intentionally returns CHECKOUT_NOT_CONFIGURED for valid authorized requests.
- No gateway credentials, card collection, purchase insertion or automatic enrollment implemented. Price remains published $97 introductory/$197 regular on staging; 72-hour offer not activated.
- Existing `lotunix-members.html` untouched.

## Checks performed
- Deployment status: ACTIVE.
- GitHub checkout file: checkout button and endpoint invocation confirmed.
- Database: 13 lessons, 13 prompts, 1 existing enrollment, 1 progress record, 0 orders.
- Database privileges: anon and authenticated roles have no INSERT rights on lotunix_orders or lotunix_enrollments.
- An end-to-end POST to the deployed endpoint could not be completed from the available execution environment (external DNS/network unavailable). Browser-based authenticated click test remains open.
- No payment transaction was attempted.

## Release blockers
1. Merchant processor supporting Bahamas business and payout account verified; obtain sandbox and later production credentials and API/webhook documentation.
2. Confirm $97 promotional price, $197 standard price, exact start time, tax and refund disclosures.
3. Build real server-side payment-session create API and verified webhook; charge only via provider-hosted checkout.
4. Test signed webhooks, replay/idempotency, refunds, login, accessibility and all 13 lessons.
5. Launch only after provider approval. Do not publish staging as a fully-functional payment service.
