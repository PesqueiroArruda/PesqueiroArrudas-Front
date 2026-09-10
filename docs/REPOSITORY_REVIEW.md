# Repository Review

Follow-up: the local backend was subsequently inspected. See
[Backend Review](BACKEND_REVIEW.md) for confirmed authorization and payment
findings, compatibility checks, and validation limits.

Reviewed on 2026-09-09. Scope: frontend source inspection, configuration,
dependency audit, and local automated checks. The backend and production
deployment were not inspected or exercised.

## Applied corrections

- **Socket lifecycle:** disabled connection during module evaluation; connect
  and disconnect through the application effect. Each subscription now removes
  its own callback. Command subscriptions follow route changes and clean up the
  previously leaked kitchen event handler.
- **Payments:** one calculation now validates both the form and submission,
  rejects invalid/nonpositive amounts, calculates change in cents, and
  revalidates when the balance or payment method changes. The full-payment
  checkbox resets when the modal closes. Corrected the mobile CSS grid typo.
- **Payment history:** removed duplicate initial queries, added loading/error
  cleanup, ignored obsolete responses after date changes, filtered incoming
  payments by date, and preserved events arriving during the HTTP request.
- **Monthly reports:** replaced state mutation during rendering with a shared,
  repeatable calculation. It sums totals, preserves payments, supports years
  beyond 2030, uses stable month IDs, and applies month/year filters.
- **Configuration and reliability:** shared the HTTP/socket backend setting,
  added `.env.example`, corrected unsafe error-response access, released
  download URLs, isolated ESLint from parent configuration, and enabled the
  Rules of Hooks check.
- **Regression coverage:** added Node tests and explicit test/typecheck scripts.

## Remaining priorities

### P1: Upgrade dependencies and assess deployment exposure

`yarn audit --summary` reported **149 occurrences across 560 audited packages**:
2 critical, 86 high, 53 moderate, and 8 low. These are dependency audit results,
not 149 confirmed exploitable application flaws. Development dependencies and
multiple dependency paths are included.

Installed Next.js is 13.5.11. Version 13 is
[unsupported](https://nextjs.org/support-policy). The critical audit entries are
[AVIF image optimization RCE](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4)
and [Windows server RCE](https://github.com/advisories/GHSA-p293-qw3h-jr36).
Assess their prerequisites against the actual hosting environment. The audit
lists `>=15.5.24` as a patched range for these entries; confirm the current
patched, supported release before upgrading.

Plan a tested Next.js migration and align `eslint-config-next` (currently
12.1.6). Update Axios and vulnerable transitive dependencies, regenerate
`yarn.lock`, and rerun the audit. No dependency versions were changed in this
review. Validate SSR, authentication redirects, images/audio, printing, and
socket behavior during the upgrade. App Router-only advisories must not be
assumed to apply to this Pages Router application.

### P1: Verify server-side authorization

`src/pages/*.tsx` and dynamic routes gate navigation using the presence of a
client-created `isAuthorized` cookie. Privileged UI uses editable `isAdmin`
localStorage. These checks do not establish a trusted identity. The shared
Axios client does not configure an authentication token or cross-origin
credentials. The subsequent backend review confirmed missing authentication on operational routes in the local backend checkout.

Implement/verify backend-issued sessions, server-side role checks on every
protected HTTP endpoint and socket event, session expiry/revocation, and
appropriate cookie/CSRF controls. Confirm that changing client storage cannot
grant API privileges. A frontend-only change cannot complete this work.

### Resolved: Report navigation persistence

Daily reports now load `/cashiers/:id` directly. Monthly URLs such as
`/customers/2026-09` and `/sold-items/2026-09` reconstruct the requested month
from `/cashiers` using the same grouping as the list. Report data no longer
uses the shared `cashierByMonthObject` localStorage slot. Legacy random IDs
produce an error with a retry action instead of displaying unrelated data.
Loading ignores obsolete responses after navigation, and the daily cashier
screen uses the same error recovery. Monthly loading currently retrieves all
cashiers because the backend has no monthly aggregation endpoint.

### Applied: Safer command closing in the frontend

Before closing, the modal fetches the latest command, rejects a closed command
or an invalid/outstanding balance, and sends the latest discount and payment
methods. A synchronous request lock prevents repeat clicks in the same mounted
modal; controls show loading and cannot cancel an in-flight submission. The
Cancel button now works while idle. Settlement uses cents instead of exact
floating-point equality, and tip calculation follows command total changes.

These checks add a GET before closing and depend on that request succeeding.
They do not solve cross-device races or replace backend atomicity and
idempotency. See the backend review for the remaining server defects.

### P2: Finish asynchronous and date consistency work

Several initial fetches still lack error recovery and stale-response handling.
Kitchen refetches can resolve out of order, and reconnecting sockets does not
consistently reload missed events. Add lifecycle-aware loading and reconnect
reconciliation, then test network failures and rapid navigation.

Several existing Luxon calls pass `zone: 'pt-BR'`, which is a locale rather than
a time zone. Agree on business-day semantics with the backend, then use a
consistent zone and test midnight/month boundaries. The new grouping utility
uses a valid zone while retaining explicit offsets from stored dates.

### P3: Continue maintainability work

Resolve remaining lint warnings, replace broad `any` types and blanket lint
disables incrementally, deduplicate authentication-storage migrations, and add
browser integration tests plus CI. Extend automated coverage to route changes,
socket reconnects, authentication, and payment submission failures.

## Validation

- Initial and subsequent TypeScript checks passed.
- Seventeen regression tests passed, including report route resolution and discounted balances.
- Production build passed, including TypeScript and lint checks.
- Lint still reports 25 warnings in existing code; no errors remain.
- No authenticated browser flows or production data mutations were performed.

The lifecycle changes follow the official
[React effect guidance](https://react.dev/reference/react/useEffect) and
[Socket.IO React integration guide](https://socket.io/how-to/use-with-react).
