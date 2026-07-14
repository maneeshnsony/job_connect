# Job Connect Portal - JC_PLAN (Implementation Steps & Testing)

> **Status**: ✅ ALL STEPS COMPLETE

---

## Infrastructure & Environment Setup

### Step 1: Docker Infrastructure
- [x] Create `docker-compose.yml` with Backend (PHP 8.4 FPM), Frontend (Node 22-alpine)
- [x] Create backend `Dockerfile` with PHP 8.4 FPM, pdo_pgsql, mbstring, zip, gd, Composer
- [x] Create frontend `Dockerfile` with Node 22, NPM
- [x] Configure Docker network for inter-service communication
- [x] Remove PostgreSQL service — uses locally installed DB via `host.docker.internal`
- [x] **Test**: `docker-compose build` succeeds for all services

### Step 2: Backend Laravel Initialization
- [x] Create Laravel project via `composer create-project`
- [x] Configure `.env` for PostgreSQL connection (`host.docker.internal`, port 5432)
- [x] Set up Mailtrap SMTP for email testing (live.smtp.mailtrap.io:587, TLS)
- [x] Run initial Laravel migrations
- [x] **Test**: `php artisan migrate` succeeds; DB connection verified

### Step 3: Frontend Next.js Initialization
- [x] Create Next.js 16 app with TypeScript & Tailwind CSS
- [x] Install Axios, configure base URL (`NEXT_PUBLIC_API_URL`) and interceptors
- [x] Install TanStack React Query for data fetching
- [x] Install `sonner` for toast notifications
- [x] **Test**: Dev server starts on port 3000

---

## Authentication System

### Step 4: Laravel Sanctum API Auth (Token-based)
- [x] Install & configure Laravel Sanctum for token auth
- [x] Create `AuthController`: `/api/register`, `/api/login`, `/api/logout`, `/api/user`
- [x] Routes defined in `routes/api.php` under `auth:sanctum` middleware
- [x] **Test**: `POST /api/register` creates user & returns token
- [x] **Test**: `POST /api/login` returns token for valid credentials
- [x] **Test**: `POST /api/logout` (with Bearer token) revokes token

### Step 5: Email Verification (Disabled for Google Auth)
- [x] User model implements `MustVerifyEmail`
- [x] Mailtrap SMTP configured in `.env` for sending verification emails
- [x] Endpoints: `/api/email/verify/{id}/{hash}`, `/api/email/verification-notification`
- [x] Custom `EnsureEmailIsVerified` middleware protects outreach routes
- [x] Google-authenticated users (`google_id` set) skip verification — `email_verified_at` set on OAuth success
- [x] Frontend dashboard layout redirects to verify-email only for non-Google users
- [x] **Test**: Registration sends verification email via Mailtrap
- [x] **Test**: Verification link marks email as verified
- [x] **Test**: Resend endpoint works

### Step 6: Google OAuth with Socialite (Primary Auth Method)
- [x] Install Laravel Socialite
- [x] Add `google_id` column to users table migration (unique, nullable)
- [x] Create endpoints: `GET /api/auth/google/redirect`, `GET /api/auth/google/callback`
- [x] `googleRedirect()` returns 302 redirect to Google OAuth URL
- [x] `googleCallback()` exchanges code for user info via Socialite
- [x] New users created with `email_verified_at = now()` and `google_id` set
- [x] Existing users linked by email: `google_id` updated, `email_verified_at` set if null
- [x] On success, redirects to `http://localhost:3000/auth/google/callback?token=xxx`
- [x] Frontend callback page stores token in localStorage, redirects to `/dashboard`
- [x] **Test**: Redirect URL returns valid Google auth URL
- [x] **Test**: Callback creates/logs in user via Google account

### Step 7: Frontend Auth UI (Google-Only)
- [x] `/login` page — only "Sign in with Google" button, email/password form removed
- [x] `/register` page — only "Sign up with Google" button, email/password form removed
- [x] `/auth/google/callback` page — handles OAuth redirect, stores token, redirects to dashboard
- [x] AuthContext with token-based state management (localStorage)
- [x] Axios interceptor adds Bearer token to all requests
- [x] Axios interceptor handles 401 — clears token, redirects to `/login`
- [x] **Test**: Google login flow works end-to-end
- [x] **Test**: Token stored and reused on page refresh

### Step 8: Protected Routes & Guards
- [x] Dashboard layout checks auth status — redirects to `/login` if no user
- [x] Dashboard layout redirects unverified users (non-Google) to `/verify-email`
- [x] **Test**: Visiting `/dashboard` without auth redirects to `/login`
- [x] **Test**: Unverified user redirected to `/verify-email`
- [x] **Test**: Google-authenticated users bypass email verification

---

## Outreach Tracker - Database & API

### Step 9: Outreach Database Schema
- [x] Create migration for `outreaches` table with columns: company, sector, recruiter, linkedin, msg_sent (date), reply (string), next_action, user_id (FK)
- [x] Create `Outreach` model with `belongsTo(User)` relationship and `$fillable` array
- [x] Create `OutreachFactory` and seeder for test data
- [x] `msg_sent` cast as `date` in model
- [x] **Test**: `php artisan migrate` creates table
- [x] **Test**: `php artisan db:seed` populates test data

### Step 10: Outreach API Endpoints (with Sort/Filter)
- [x] Create `OutreachController` with full CRUD: index, store, show, update, destroy
- [x] Apply `auth:sanctum` + `verified` middleware
- [x] `index()` supports:
  - **Sorting**: `?sort=company&direction=asc` on fields: company, sector, recruiter, msg_sent, reply, next_action, created_at
  - **Filtering**: `?company=xxx&sector=xxx&recruiter=xxx` (LIKE search) and `?reply=Yes|No|Pending` (exact match)
  - Default sort: `created_at DESC`
  - Paginated: 20 per page
- [x] Create `StoreOutreachRequest` / `UpdateOutreachRequest` validation
- [x] Create `OutreachResource` for JSON formatting
- [x] User authorization check on show/update/delete (owner only)
- [x] **Test**: `GET /api/outreaches?sort=company&direction=asc&reply=Yes` returns filtered results
- [x] **Test**: `POST /api/outreaches` creates record (validated)
- [x] **Test**: `PUT /api/outreaches/{id}` updates record
- [x] **Test**: `DELETE /api/outreaches/{id}` deletes record
- [x] **Test**: Unauthenticated requests return 401

---

## Frontend - Dashboard & Outreach Table

### Step 11: Dashboard Layout
- [x] Sidebar with navigation (Dashboard link)
- [x] User email display in sidebar header
- [x] Logout button in sidebar
- [x] Dark theme styling (bg-gray-900/800/700)
- [x] **Test**: Layout renders correctly with user info

### Step 12: Outreach Table with Sort/Filter
- [x] Table columns: #, Company, Sector, Recruiter, LinkedIn, Msg Sent, Reply?, Next Action, Actions
- [x] **Sortable column headers** — click to toggle asc/desc, arrow indicator shows active sort
- [x] **Filter inputs** — inline text inputs for Company, Sector, Recruiter; dropdown for Reply (All/Yes/No/Pending)
- [x] Filters sent as query params to API, data refreshes automatically via React Query
- [x] Loading skeleton state (pulsing bars)
- [x] Empty state with icon and message
- [x] Error state with red border and message
- [x] Reply status shown as colored badges (green=Yes, red=No, yellow=Pending)
- [x] LinkedIn URLs are clickable (opens in new tab)
- [x] **Test**: Clicking column header sorts data
- [x] **Test**: Typing in filter inputs filters data
- [x] **Test**: Reply dropdown filters by status

### Step 13: Add/Edit/Delete Modals
- [x] "Add New" button opens modal with form
- [x] Edit button (pencil icon) opens same modal pre-filled
- [x] Delete button (trash icon) with confirmation dialog
- [x] Form fields: Company*, Sector*, Recruiter*, LinkedIn URL, Msg Sent Date, Reply? (Pending/Yes/No), Next Action
- [x] Client-side validation (required fields, LinkedIn URL format)
- [x] Error messages displayed below fields
- [x] **Test**: Add new record works
- [x] **Test**: Edit existing record works
- [x] **Test**: Delete removes record with confirmation
- [x] **Test**: Validation errors show on invalid input

### Step 14: Toast Notifications & UX
- [x] Configured `sonner` with rich colors and top-right position
- [x] Success toast on add/edit/delete
- [x] Error toast on API failure
- [x] **Test**: Toast appears on successful operations
- [x] **Test**: Toast appears on errors

---

---

## Bug Fixes & Hardening

### Step 15: Session Persistence Across Rebuilds
- [x] `AuthContext.fetchUser()` only clears token on 401 errors (not network/connection errors)
- [x] During Docker rebuild, brief backend outage no longer destroys valid tokens in localStorage
- [x] Token survives frontend page refresh after backend recovers
- [x] **Test**: Rebuild Docker containers without losing existing user sessions

### Step 16: Route Group Rendering
- [x] Added `(auth)/layout.tsx` to ensure route group is properly recognized by Next.js
- [x] Root layout body uses CSS variables (`var(--bg-primary)`, `var(--text-primary)`) instead of hardcoded `bg-gray-900 text-white`
- [x] Google callback page uses CSS variables instead of hardcoded `bg-gray-900`
- [x] **Test**: `/login` and `/register` routes render correctly after fresh Docker build

## Outreach Notes Feature

### Step 17: Outreach Notes (1:N Relationship)
- [x] Create migration for `outreach_notes` table (outreach_id FK, note text, timestamps, composite index)
- [x] Create `OutreachNote` model with `belongsTo(Outreach)` relationship
- [x] Update `Outreach` model with `hasMany(OutreachNote)` relationship and `$withCount = ['notes']`
- [x] Create `StoreOutreachNoteRequest` validation (note required, string, max:2000)
- [x] Create `OutreachNoteResource` for JSON transformation
- [x] Create `OutreachNoteController` with: index (notes list, latest first), store (create), destroy (delete)
- [x] Register nested REST routes: `GET/POST /api/outreaches/{outreach}/notes`, `DELETE /api/outreaches/{outreach}/notes/{note}`
- [x] Update `OutreachResource` to include `notes_count` in response
- [x] Update `Outreach` TypeScript interface with `notes_count`
- [x] Add API client functions: `getOutreachNotes`, `createOutreachNote`, `deleteOutreachNote`
- [x] Create `OutreachNoteModal` component — shows notes list (latest first, with timestamps), add note form, delete with confirmation
- [x] Add "View Notes" icon (chat bubble) and "Add Note" icon (circle-plus) to action column in `OutreachTable`
- [x] Widen action column from `w-24` to `w-40` for 4 action buttons
- [x] Wire up note modal state and callbacks in `DashboardPage`
- [x] **Test**: `php artisan migrate` creates outreach_notes table
- [x] **Test**: All note routes registered in `php artisan route:list`
- [x] **Test**: Frontend TypeScript compiles without errors

## Final Verification

### Step 18: Full Integration Test
- [x] Google OAuth flow from redirect to callback to dashboard
- [x] Outreach CRUD with sort/filter via UI
- [x] Notes: view, add, and delete via note modal
- [x] Notes appear in latest-to-oldest order
- [x] `notes_count` displays on view notes button hover
- [x] Cascade delete: notes removed when outreach is deleted
- [x] Authorization: only outreach owner can view/add/delete notes
- [x] 401 handling — redirects to login on expired token (not on network errors)
- [x] Light/dark theme with per-user persistence (CSS variables + `theme` column)
- [x] Docker compose up runs all services together
