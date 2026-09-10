# Backend Compatibility and Reliability Review

Reviewed on 2026-09-09 against the local sibling repository
`pesqueiro-arrudas-back-main`. Its working tree was clean before and after
inspection. No backend code, credentials, database records, or deployments
were changed. The deployed revision and any infrastructure access controls
were not verified.

## Compatibility with the frontend changes

- `PUT /commands/:id?updateTotal=true` accepts a numeric `total` increment and
  `paymentType`, returning `{ message, command }`. This matches PaymentModal.
- Partial payments update `command.totalPayed`; they do not create a Payment
  record. `POST /payments` creates the history record when closing the command.
  Therefore, a partial payment not appearing in history is existing behavior.
- `PaymentsRepository.create` supplies a Luxon DateTime in UTC-3. An offline
  Mongoose model check confirmed conversion to an ISO string compatible with
  the frontend date filter. Legacy records using other offsets still need
  boundary testing.
- `kitchen-order-created` carries one order; `kitchen-order-updated` carries an
  array; `kitchen-order-deleted` carries `{ commandId }`. The revised listeners
  match these contracts.
- The frontend declares `POST /kitchen/orders/reorder`, but the local backend
  has no such route or `kitchen-orders-reordered` emission. Server persistence
  and cross-device synchronization cannot rely on this contract.

## Confirmed findings

### P1: Operational HTTP routes and sockets have no application authentication

[routes.js](../../pesqueiro-arrudas-back-main/src/routes.js:28) registers stock,
command, payment, kitchen, and cashier operations without authentication
middleware. Only `/admin/payments` and `/admin/commands` use `assurePassword`.
Login returns authorization booleans without issuing a server session/token.
`src/index.js` also accepts socket connections without identity checks and
broadcasts business events to all connected clients.

Introduce backend-issued identity and role checks for operational routes and
socket subscriptions. Roll out the frontend session changes together with the
backend enforcement to avoid locking out current clients. Open CORS settings
are not a replacement for authorization.

### P1: Payment validation can be bypassed through direct API calls

[CommandController.js](../../pesqueiro-arrudas-back-main/src/app/controllers/CommandController.js:144)
checks only whether the new paid total exceeds the gross command total.
Offline controller simulations confirmed:

- A payment of `-10` decreases `totalPayed` from 50 to 40 with HTTP 200.
- A command with total 100, discount 20, and 80 already paid accepts another 10.

Validate numeric types, finite positive amounts, supported payment methods,
command status, and the outstanding balance after discount on the server.
Frontend validation improves usability but does not enforce API invariants.

### P1: Concurrent payments can overwrite each other

The controller reads the command, calculates a new total, then the repository
writes it using `$set`. Two requests can use the same starting value. An
in-memory simulation of this scheduling confirmed that payments of 30 and 40
can finish with `totalPayed = 40`, rather than 70.

Use a conditional atomic update or concurrency control that also checks the
remaining balance. An unconditional increment alone does not prevent
overpayment. Follow MongoDB's
[atomicity and transaction guidance](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/).

### P1: Command closing is neither idempotent nor atomic

[PaymentController.js](../../pesqueiro-arrudas-back-main/src/app/controllers/PaymentController.js:13)
does not reject an already closed or unpaid command before creating its
payment. Simulations confirmed two payment records after two closing calls,
and successful closing of an unpaid command through the controller.

It also closes the command before storing the payment. An injected persistence
failure left the simulated command closed without a payment record. Validate
the persisted balance, prevent duplicate completion, and commit related writes
consistently before emitting success events.

### P1: Cashier closing trusts client-supplied payment records

[CashierController.js](../../pesqueiro-arrudas-back-main/src/app/controllers/CashierController.js:14)
sums and stores the submitted payment list rather than retrieving authoritative
payments for the day. It deletes an existing cashier before saving its
replacement. A stale or modified request can produce incorrect totals, and a
failed replacement can lose the previous report. This finding is based on code
inspection; no cashier was created or deleted during validation.

### P2: Error propagation, dates, and inventory need follow-up

- The custom error middleware precedes routes in `src/index.js`. Several
  Express 4 async controllers do not forward rejections. Move error handling
  after routes and consistently forward asynchronous failures.
- `CashiersRepository.findAll(date)` calls `DateTime.fromJSDate` on a field
  declared as a string. Several repositories also use locale `pt-BR` as a zone.
- Stock updates use the same read/compute/write pattern as payments and do not
  consistently validate positive finite quantities. Checking stock and
  decrementing it are separate operations.
- `/webhook/ifood/order` only logs the body and acknowledges receipt; it does
  not persist orders or authenticate the webhook.

## Validation evidence and limits

- `node --check`: all 26 JavaScript source files passed.
- ESLint over `src`: 0 errors and 13 warnings. It also inherits parent ESLint
  configuration because the backend config does not declare `root: true`.
- Seven controller scenarios ran with mocked repositories: one normal partial
  payment and six invalid/concurrent/failure scenarios described above.
- One offline Mongoose casting check confirmed the payment date contract.
- No server was started and no MongoDB connection was opened. Simulations do
  not replace HTTP, real-database concurrency, or production deployment tests.
- The backend defines no dedicated test or build scripts in `package.json`.

Prioritize authorization, server-side payment invariants, atomic updates, and
idempotent closing before cosmetic refactoring.
