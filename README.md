# TSS DSA Checklist

A full-stack **DSA progress tracker** built for the TSS CS Club. Members can register, track which of the 150 curated DSA problems they've solved, and compete on a live leaderboard — all backed by a Google Sheet and Google Apps Script (no traditional server needed).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend Architecture](#frontend-architecture)
- [Backend — Google Apps Script](#backend--google-apps-script)
- [Google Sheets Schema](#google-sheets-schema)
- [Authentication & Security](#authentication--security)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)

---

## Overview

- Members **register** with their USN, email, and LeetCode username. Registration is OTP-verified via email.
- After login, they see a **dashboard** with 150 problems organised by week. Each problem can be toggled solved/unsolved.
- A **leaderboard** shows the top 20 members ranked by problems solved.
- Account management: **change password** and **forgot password** (rate-limited to 1 reset/day).

---

## Tech Stack

### Frontend

| Technology | Version | Why |
|---|---|---|
| **React** | 19 | UI library — component model, hooks, concurrent features |
| **TypeScript** | 6 | Type safety across the entire codebase |
| **Vite** | 8 | Extremely fast dev server and bundler for ES modules |
| **React Router v7** | 7 | Client-side routing with protected/guest route guards |
| **Tailwind CSS v4** | 4 | Utility-first CSS via the Vite plugin (zero config) |
| **react-hot-toast** | 2 | Non-intrusive toast notifications for API feedback |
| **Oxlint** | 1 | Fast Rust-based linter, replacement for ESLint |

### Backend

| Technology | Why |
|---|---|
| **Google Apps Script (GAS)** | Serverless backend — runs entirely inside Google's infra, free, no hosting cost |
| **Google Sheets** | Database — stores users, progress, and leaderboard data in a spreadsheet |
| **MailApp (GAS built-in)** | Sends OTP and password-reset emails (100/day quota) |

### Deployment

| Service | Purpose |
|---|---|
| **Vercel** | Hosts the React frontend; `vercel.json` rewrites all routes to `index.html` for SPA support |
| **GAS Web App** | Deployed as a public POST endpoint (Execute as: Me, Access: Anyone) |

---

## Project Structure

```
tss-dsa-checklist/
├── gas/
│   └── Code.gs              # Google Apps Script backend (paste into GAS editor)
├── public/
│   └── favicon.svg          # App favicon
├── src/
│   ├── components/
│   │   ├── LeaderboardTable.tsx   # Renders top-20 leaderboard rows
│   │   ├── Navbar.tsx             # Top nav with logout + change password
│   │   ├── ProblemCard.tsx        # Individual problem toggle card
│   │   ├── ProblemList.tsx        # Filtered list of ProblemCards
│   │   ├── StatsWidget.tsx        # Solved count + percentage display
│   │   ├── WeekFilter.tsx         # Week selector tabs (All / Week 1-N)
│   │   └── modals/
│   │       ├── ChangePasswordModal.tsx   # In-app password change
│   │       └── ForgotPasswordModal.tsx   # Reset password via email
│   ├── context/
│   │   └── UserContext.tsx        # Global auth state + localStorage persistence
│   ├── data/
│   │   └── problems.ts            # Static array of 150 problems (title, week, link)
│   ├── lib/
│   │   ├── api.ts                 # All GAS API calls (typed fetch wrappers)
│   │   ├── crypto.ts              # SHA-256 hash via Web Crypto API
│   │   └── demo.ts                # Mock credentials for offline demo login
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Main checklist view
│   │   ├── LeaderboardPage.tsx    # Leaderboard view
│   │   ├── LoginPage.tsx          # Login + demo login
│   │   └── RegisterPage.tsx       # Multi-step OTP registration
│   ├── App.tsx                    # Route definitions + ProtectedRoute / GuestRoute
│   ├── index.css                  # Global styles and design tokens
│   └── main.tsx                   # React root, BrowserRouter, Toaster setup
├── .env                           # VITE_GAS_URL (local dev, never commit)
├── vercel.json                    # SPA rewrite rule for Vercel
├── vite.config.ts                 # Vite + React + Tailwind plugins
├── tsconfig.json                  # TypeScript project references root
├── tsconfig.app.json              # TS config for src/
└── tsconfig.node.json             # TS config for vite.config.ts
```

---

## Frontend Architecture

### Routing (`App.tsx`)

Two route guard wrappers are defined:

- **`ProtectedRoute`** — redirects to `/login` if `isAuthenticated` is false. Wraps `/dashboard` and `/leaderboard`.
- **`GuestRoute`** — redirects to `/dashboard` if already logged in. Wraps `/login` and `/register`.

### Global State (`UserContext.tsx`)

A single React Context holds the entire session:

```ts
{
  user: UserMeta | null        // profile fields from the sheet
  solvedArray: boolean[150]    // which of the 150 problems are solved
  passwordHash: string         // SHA-256 hash kept in memory for progress updates
  isAuthenticated: boolean
}
```

- **Persisted to `localStorage`** under key `dsa_tracker_session` so the session survives page refreshes.
- Cleared on logout.
- `setSolved(qIndex, solved)` updates the array locally and recalculates `totalSolved` and `percentage` optimistically — no refetch needed.

### API Layer (`lib/api.ts`)

All backend communication goes through a single typed `post<T>()` helper that:
- Sends `Content-Type: text/plain` (required to avoid CORS preflight with GAS)
- Checks `response.ok` and `data.success`
- Throws descriptive errors that bubble up to toast notifications

Exported functions:

| Function | Action |
|---|---|
| `apiRegister` | Legacy direct registration |
| `apiSendOtp` | Step 1 of OTP registration |
| `apiVerifyOtp` | Step 2 — verifies OTP, creates account |
| `apiLogin` | Returns user profile + solved array |
| `apiUpdateProgress` | Toggles a single problem (auth-gated) |
| `apiGetLeaderboard` | Fetches top 20 |
| `apiResetPassword` | Sends temp password email (1/day rate limit) |
| `apiChangePassword` | Changes password with old-password verification |

### Password Hashing (`lib/crypto.ts`)

Passwords are **SHA-256 hashed in the browser** using the native `Web Crypto API` before being sent to GAS. The raw password never leaves the client.

```ts
const hash = await sha256("mypassword"); // → hex string
```

---

## Backend — Google Apps Script

`gas/Code.gs` is deployed as a **GAS Web App**. The single `doPost(e)` function receives every request and dispatches by `action` field.

### Actions

| Action | Description |
|---|---|
| `sendOtp` | Validates uniqueness, generates 6-digit OTP, stores in `PendingUsers` sheet (expires in 5 min), sends OTP email |
| `verifyOtp` | Checks OTP + expiry → creates user row in `Users` sheet → cleans up `PendingUsers` |
| `register` | Legacy direct registration (no OTP, kept for backwards compatibility) |
| `login` | Finds user by USN, verifies SHA-256 hash, returns profile + `solvedArray[150]` |
| `updateProgress` | Verifies auth, sets `Q{n}` cell to 0 or 1, returns new `totalSolved` |
| `getLeaderboard` | Reads top 20 rows from the `Leaderboard` sheet |
| `resetPassword` | Checks 1-per-day rate limit → generates temp password → SHA-256 hashes it → emails plain text to user |
| `changePassword` | Verifies old hash → stores new hash |

---

## Google Sheets Schema

### `Users` sheet

| Col | Letter | Field | Notes |
|---|---|---|---|
| 1 | A | `slNo` | Serial number (auto-incremented) |
| 2 | B | `firstName` | |
| 3 | C | `lastName` | |
| 4 | D | `usn` | Primary key, stored uppercase |
| 5 | E | `email` | Must be unique |
| 6 | F | `leetcodeUsername` | |
| 7 | G | `password` | SHA-256 hex hash |
| 8 | H | `totalSolved` | Formula: `=COUNTIF(J{row}:FC{row}, 1)` |
| 9 | I | `percentage` | Formula: `=ROUND((H{row}/150)*100, 1)` |
| 10–159 | J–FC | `Q1`–`Q150` | `1` = solved, `0` = unsolved |
| 160 | | `lastResetAt` | Epoch ms timestamp of last password reset (rate-limit) |

### `PendingUsers` sheet

Temporary storage for unverified registrations (OTP flow):

| Col | Field |
|---|---|
| A | `usn` |
| B | `email` |
| C | `firstName` |
| D | `lastName` |
| E | `leetcodeUsername` |
| F | `passwordHash` |
| G | `otp` (6-digit string) |
| H | `expiryTimestamp` (epoch ms, 5 min TTL) |

### `Leaderboard` sheet

Powered by a `SORT` formula referencing the `Users` sheet. GAS reads it directly — top 20 rows are returned as-is.

| Col | Field |
|---|---|
| A | `firstName` |
| B | `lastName` |
| C | `usn` |
| D | `leetcodeUsername` |
| E | `totalSolved` |
| F | `percentage` |

---

## Authentication & Security

- Passwords are **SHA-256 hashed client-side** before transmission and stored as hex in the sheet. The raw password never reaches the server.
- Every `updateProgress` and `changePassword` call re-sends the password hash — GAS verifies it on every mutation (stateless auth).
- The session (including the hash) is stored in `localStorage` — suitable for an internal club tool.
- Password resets are **rate-limited to 1 per calendar day (UTC)** to protect the 100 emails/day GAS quota. The timestamp is stored in col 160 of the Users sheet.
- OTPs expire after **5 minutes**.

---

## Environment Variables

Create a `.env` file in the project root (never commit this):

```env
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace `YOUR_DEPLOYMENT_ID` with the deployment ID from your GAS Web App.

> On Vercel, add this under **Settings → Environment Variables**.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server with hot-reload
npm run dev

# Lint
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment

### Frontend (Vercel)

1. Push the repo to GitHub.
2. Import on [vercel.com](https://vercel.com).
3. Add `VITE_GAS_URL` as an environment variable.
4. Deploy — Vercel auto-detects Vite. The `vercel.json` rewrite rule ensures React Router handles direct URL access correctly.

### Backend (Google Apps Script)

1. Open the Google Sheet that will serve as your database.
2. Go to **Extensions → Apps Script**.
3. Paste the contents of `gas/Code.gs`.
4. Click **Deploy → New deployment → Web App**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL → set it as `VITE_GAS_URL`.
6. For every future change to `Code.gs`, create a **new version** (Deploy → Manage deployments → Edit → New version) — GAS does not hot-reload.


## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
