# LOTUNIX Secure Launch Integration Plan
Status: staging only — NOT LIVE / NOT APPROVED FOR PAYMENTS
Owner: PathFinderGlobalAI
Last prepared: 2026-11-18

## Approved commercial offer
- Product: 13 LOTUNIX AI Revenue System — complete package
- Introductory price: USD 97.00
- Standard price: USD 197.00
- Launch window: 72 hours from a published Nassau-local start time, enforced by the payment backend (not a client-side timer).
- No recurring charge for the course; future subscriptions are separate.
- Do not activate enrollment before all advertised videos, workbooks and delivery terms are ready.

## Separation of responsibilities
1. GitHub Pages (public): home, digital-products.html, lotunix-checkout.html, policy pages, marketing copy, provider-hosted checkout redirect.
2. Authenticated member platform (not yet selected or provisioned): account registration/login, verified entitlement checks, protected course videos, workbook delivery, progress tracking, and the LOTUNIX S.I.G.N.A.L. prompt vault.
3. Approved payment processor (awaiting Commonwealth Bank merchant response): hosted card payment page, transaction records, refunds, secure server-to-server payment notifications.
4. Secure backend (not yet provisioned): payment webhook signature verification, idempotent order fulfillment, membership entitlement, email dispatch, audit trail, and subscription state.

## Required production integration
- Merchant account and settlement currency approved by the bank.
- Choose supported member platform and create owner-managed account; configure domain, MFA, least-privilege access and backups.
- Configure a backend that validates signed payment webhooks. Never grant access from browser success URLs alone.
- Store webhook secrets, API keys and SMTP credentials in managed server-side secrets; never commit them to GitHub.
- Use idempotency keys/order IDs; only one entitlement per successful transaction; handle retries, refunds, disputes and failed payments.
- Keep paid videos and downloadable files behind authenticated access rules. Do not commit paid content to public GitHub repositories.
- Verify provider's recurring-billing support before selling subscriptions. Give clear billing frequency and cancellation route.
- Publish approved refund, privacy and subscription policies; display full price, currency, applicable taxes and delivery terms before checkout.
- Verify HTTPS and custom domain certificate before sending buyers to checkout.
- Provide customer support contact info@pathfinderglobalai.com.

## Acceptance tests (all must pass before launch)
[ ] Guest cannot access dashboard, paid prompts, videos or workbook files.
[ ] Member A cannot access Member B's progress, records or orders.
[ ] Successful test payment produces one verified order, one entitlement and one receipt.
[ ] Replayed or forged webhook does not produce duplicate access.
[ ] Failed/cancelled payment does not grant access.
[ ] Refund/revoked order follows the published access policy.
[ ] Course access works on mobile and desktop after login.
[ ] Account recovery, logout and MFA function correctly.
[ ] No credentials, card data or private content appear in browser source or public repository.
[ ] Price is USD 97 during announced 72-hour window and USD 197 afterward; server enforces cutoff.
[ ] Subscription cancellation and renewal notices work before subscriptions are offered.
[ ] All website navigation, policy and support links work; HTTPS certificate valid.
[ ] Owner confirms actual course materials are complete and accurate.
[ ] Bank, business licensing and legal requirements have been satisfied.

## Blockers requiring owner/provider input
1. Commonwealth Bank confirmation of e-commerce gateway, accepted cards, supported USD transactions, hosted checkout URL/API, settlement account and merchant approval.
2. Choice of a private member platform and account provisioning. No third-party account has been created.
3. Final approved refund/privacy terms and course delivery/access duration.
4. Completion and protected upload of the 13 lessons and workbooks.
5. Final announced start date/time for the 72-hour offer.

## Customer email templates (send only after server-verified events)
### Purchase confirmed
Subject: Your LOTUNIX Members purchase is confirmed
Hello [FIRST NAME],
Your payment for the 13 LOTUNIX AI Revenue System has been confirmed.
Order reference: [ORDER ID]
Total paid: [AMOUNT] [CURRENCY]
Your private member access instructions will arrive separately.
Questions? info@pathfinderglobalai.com
PathFinderGlobalAI Support

### Access ready
Subject: Welcome to LOTUNIX Members — your access is ready
Hello [FIRST NAME],
Welcome to LOTUNIX Members. Your complete course is ready in your secure member dashboard.
Sign in using your account at [VERIFIED MEMBER PORTAL URL].
For security, do not share your login or access links.
Support: info@pathfinderglobalai.com
PathFinderGlobalAI Support

### Payment not completed
Subject: LOTUNIX checkout was not completed
Hello [FIRST NAME],
We have not confirmed a successful payment for your LOTUNIX course order. No course access has been activated.
You may return to the official PathFinderGlobalAI website and try again when checkout is available.
Support: info@pathfinderglobalai.com
PathFinderGlobalAI Support

### Refund processed
Subject: LOTUNIX refund update
Hello [FIRST NAME],
A refund of [AMOUNT] [CURRENCY] for order [ORDER ID] has been submitted to your original payment method.
Processing time depends on your card issuer. Your access will follow the refund terms shown at purchase.
Support: info@pathfinderglobalai.com
PathFinderGlobalAI Support
