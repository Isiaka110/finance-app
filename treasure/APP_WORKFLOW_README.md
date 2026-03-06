# FinTrack Application Workflow & Architecture

This document provides an extensive analysis of the application's core functionality, data flow, and user workflows. FinTrack is structured as a unified MERN-like stack (using Vite/React for the frontend, Express/Node.js for the backend, and MongoDB via Mongoose for data persistence).

---

## 1. User Authentication and Onboarding Workflow

**Data Flow:**
- The entry point checks for an active JWT session stored either in state or local storage via `AuthContext`.
- If unauthenticated, users are presented with the `LandingPage` (`/`) and directed to `AuthPage` (`/auth`) for Login/Registration.
- During registration, a localized `User` document is created in MongoDB with hashed credentials using `bcrypt` and an `isNew` flag is natively attached.
- Upon successful authentication, the server provisions a JSON Web Token (JWT) back to the client.

**Onboarding Check:**
- The frontend Router intercepts the login success. If the session yields `user.isNew === true`, the `ProtectedRoute` wrapper funnels the user specifically to the `/welcome` route (`OnboardingPage.jsx`).
- The user is walked through a friendly 3-step feature tour. Once completed, a PUT request effectively toggles `isNew` to false on the backend, ensuring they arrive strictly at the `/dashboard` on future visits.

---

## 2. Dashboard Analytics & Data Aggregation Workflow

**Data Flow:**
- Upon loading the `Dashboard` (`/dashboard`), the frontend parallelizes generic HTTP fetches utilizing `Axios` (`API.get('/transactions')` and `API.get('/goals')`).
- **Liquid Balance Calculation:** The dashboard performs a critical financial assessment to display "True Liquid Cash". It derives this by executing:
  `Total Income - Total Expenses - Total Unapproved Saved Goals`
- **Visualization Flow:** 
  - Pie charts evaluate transactions exclusively marked as `type: 'expense'`, grouping instances by `category`.
  - Bar charts chronologically map incomes versus expenses to construct a rolling 6-month historical graph.

---

## 3. Transaction Logging (Income & Expenses)

**Data Flow:**
- Users can utilize straightforward forms in `IncomePage.jsx` and `ExpensePage.jsx`.
- These UI layers push `POST /api/transactions` requests specifying `{ type: 'income' | 'expense', amount, category, date, ... }`.
- **Side Effect (Notifications):** When the `transactionController` processes the creation and saves it to MongoDB, it actively forks a process firing `createNotification()`. This provisions an immediate `success` or `info` alert into the user's database scope, mapping exactly to what type of entity they updated.

---

## 4. Savings Goals & Complex Approval Workflow

This represents the application's most advanced data synchronization pattern.

**Base Goal Lifecycle:**
- User creates a goal defining a `name` and `targetAmount`.
- Users make iterative deposits via the UI (`handleDeposit`). Extra modular shortcut buttons (`x10`, `x5`, `x3` multipliers) calculate rapid inputs.
- When `savedAmount` >= `targetAmount`, the server's `updateGoal` controller automatically toggles `goal.completed = true` and dispatches a celebratory completion notification. Excess funds are accurately evaluated and alerted if present.

**The Approval Engine:**
- Merely "completing" a goal is not enough; the user must explicitely "APPROVE" the completion for the app to treat the allocated money as officially spent.
- The UI reveals an "APPROVE" confirmation dialog. Once authorized by the user, the app calls `POST /api/goals/:id/approve`.
- The server subsequently:
  1. Validates the goal isn't actively approved already.
  2. Spawns an auto-generated `Expense` Transaction mapping exactly to the `savedAmount`. This ensures the money vanishes from "Liquid Balance" and correctly appears in "Total Expenses" across the app's charts.
  3. Tags the goal with `isApproved: true` and links it relationally via `expenseId: tx._id`.
  4. Returns the UI to a locked "✔️ Approved" static state.

**Failsafe Reversibility:**
- If the user realizes they made a mistake and navigates to `TransactionsPage` to delete the generated expense transaction, the `deleteTransaction` controller triggers a cleanup script:
  - It detects the `goalId` on the transaction.
  - Queries the target goal and resets `isApproved` back to `false`.
  - Clears matching approval notifications so the goal safely morphs back into its "Awaiting Approval" UI state.

---

## 5. Notification & Real-Time Alert Workflow

**Data Flow:**
- The global `Layout.jsx` or specialized context routinely fetches from `GET /api/notifications`.
- Any underlying system operations (Deleting goals, successfully authenticating new savings features, goal approvals) automatically hook into `Notification.create()`.
- Alerts are populated in the user's Notification Dropdown or `NotificationsPage`.
- A mark-as-read engine (`PUT /api/notifications/read`) flags the notifications as acknowledged, causing the visual unread badge to disappear seamlessly.

---

## Conclusion

This intricate flow ensures that the application doesn't simply function as a basic ledger, but as a reactive, cohesive ecosystem. Each system operation seamlessly informs underlying analytics charts, recalculations of user net-worth, and triggers direct engagement layers through the internal notification suite.
