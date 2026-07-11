# Job Connect Portal - JC_PLAN (Implementation Steps & Testing)

> **Status**: ✅ ALL STEPS COMPLETE
> **Completed**: ✅ | **In Progress**: 🔄 | **Pending**: ⬜

---

## Infrastructure & Environment Setup

### Step 1: Docker Infrastructure
- [x] Create `docker-compose.yml` with PostgreSQL (15-alpine), Backend (PHP 8.2 FPM), Frontend (Node 18-alpine)
- [x] Create backend `Dockerfile` with PHP 8.2 FPM, pdo_pgsql, Composer
- [x] Create frontend `Dockerfile` with Node 18, NPM
- [x] Configure Docker network and volumes for persistence & hot-reload
- [x] **Test**: `docker-compose build` succeeds for all services

### Step 2: Backend Laravel Initialization
- [x] Create Laravel project via `composer create-project`
- [x] Configure `.env` for PostgreSQL connection (host: `db`, port: 5432)
- [x] Run initial Laravel migrations
- [x] **Test**: `php artisan migrate` succeeds; DB connection verified

### Step 3: Frontend Next.js Initialization
- [x] Create Next.js app with TypeScript & Tailwind CSS
- [x] Install Axios, configure base URL and interceptors
- [x] **Test**: Dev server starts on port 3000

---

## Authentication System

### Step 4: Laravel Sanctum API Auth
- [x] Install & configure Laravel Sanctum for SPA/token auth
- [x] Create `AuthController`: `/api/register`, `/api/login`, `/api/logout`
- [x] **Test**: `POST /api/register` creates user & returns token
- [x] **Test**: `POST /api/login` returns token for valid credentials
- [x] **Test**: `POST /api/logout` (with Bearer token) revokes token

### Step 5: Email Verification
- [x] User model implements `MustVerifyEmail`
- [x] Configure mail in `.env` (Mailtrap / log driver for testing)
- [x] Endpoints: `/api/email/verify/{id}/{hash}`, `/api/email/verification-notification`
- [x] **Test**: Registration sends verification email
- [x] **Test**: Verification link marks email as verified
- [x] **Test**: Resend endpoint works

### Step 6: Google OAuth with Socialite
- [x] Install Laravel Socialite
- [x] Add `google_id` column to users table migration
- [x] Create endpoints: `/api/auth/google/redirect`, `/api/auth/google/callback`
- [x] **Test**: Redirect URL returns Google auth URL
- [x] **Test**: Callback creates/logs in user via Google account

---

## Outreach Tracker - Database & API

### Step 7: Outreach Database Schema
- [x] Create migration for `outreaches` table with all required columns
- [x] Create `Outreach` model with `belongsTo(User)` relationship
- [x] Create `OutreachFactory` and seeder for test data
- [x] **Test**: `php artisan migrate` creates table
- [x] **Test**: `php artisan db:seed` populates test data

### Step 8: Outreach API Endpoints
- [x] Create `OutreachController` with resource methods
- [x] Apply `auth:sanctum` + `verified` middleware
- [x] Create `StoreOutreachRequest` / `UpdateOutreachRequest` validation
- [x] Create `OutreachResource` for JSON formatting
- [x] **Test**: `GET /api/outreaches` returns user's outreach records
- [x] **Test**: `POST /api/outreaches` creates record (validated)
- [x] **Test**: `GET /api/outreaches/{id}` returns single record
- [x] **Test**: `PUT /api/outreaches/{id}` updates record
- [x] **Test**: `DELETE /api/outreaches/{id}` deletes record
- [x] **Test**: Unauthenticated requests return 401
- [x] **Test**: Unverified users get 403

---

## Frontend - Auth Flow

### Step 9: Login & Register Pages
- [x] Create `/login` page with email/password form
- [x] Create `/register` page with name/email/password/confirm form
- [x] Token storage (localStorage) and Axios interceptor
- [x] Redirect to dashboard on success
- [x] **Test**: Register flow works end-to-end
- [x] **Test**: Login flow works end-to-end
- [x] **Test**: Error messages display on failure

### Step 10: Email Verification UI
- [x] Create `/verify-email` page
- [x] "Resend Verification Email" button
- [x] Auto-check verification status
- [x] **Test**: Unverified user sees verify page
- [x] **Test**: Resend button works
- [x] **Test**: After verification, user can access dashboard

### Step 11: Google OAuth Frontend
- [x] "Sign in with Google" button on login/register pages
- [x] Handle OAuth callback on frontend
- [x] **Test**: Google login flow works end-to-end

### Step 12: Protected Routes
- [x] Next.js middleware for route protection
- [x] Redirect unauthenticated users to `/login`
- [x] Redirect unverified users to `/verify-email`
- [x] **Test**: Visiting `/dashboard` without auth redirects to `/login`
- [x] **Test**: Unverified user redirected to `/verify-email`

---

## Frontend - Dashboard & Outreach Table

### Step 13: Dashboard Layout
- [x] Sidebar with navigation (Dashboard, Logout)
- [x] Navbar with user info
- [x] Dark theme styling (matching reference image)
- [x] **Test**: Layout renders correctly

### Step 14: Outreach Table Component
- [x] Table with columns: #, COMPANY, SECTOR, RECRUITER, LINKEDIN, MSG SENT, REPLY?, NEXT ACTION
- [x] Data fetching via Axios + React Query (TanStack Query)
- [x] Loading skeleton state
- [x] Empty state
- [x] Dark-themed styling
- [x] **Test**: Table displays user's outreach data
- [x] **Test**: Linkedin URLs are clickable
- [x] **Test**: Loading skeleton shows while fetching

### Step 15: Add/Edit/Delete Modals
- [x] "Add New" button opens modal with form
- [x] Edit button (inline or modal) for updating record
- [x] Delete button with confirmation dialog
- [x] React Hook Form + Zod validation
- [x] Form fields: Company, Sector, Recruiter, LinkedIn URL, Msg Sent Date, Reply status, Next Action
- [x] **Test**: Add new record works
- [x] **Test**: Edit existing record works
- [x] **Test**: Delete removes record
- [x] **Test**: Validation errors show on invalid input

---

## Polish & Error Handling

### Step 16: Toast Notifications & UX
- [x] Install and configure `sonner` for toasts
- [x] Success toast on add/edit/delete
- [x] Error toast on API failure
- [x] **Test**: Toast appears on successful operations
- [x] **Test**: Toast appears on errors

### Step 17: Form Validation (Client-side)
- [x] Zod schemas for all forms
- [x] Field-level error messages
- [x] Submit button disabled while invalid/in flight
- [x] **Test**: Empty fields show validation errors
- [x] **Test**: Invalid LinkedIn URL is rejected

---

## Final Verification

### Step 18: Full Integration Test
- [x] Register new user → verify email → login → dashboard loads → add outreach → edit → delete → logout
- [x] Google OAuth flow from redirect to callback to dashboard
- [x] 401/403 handling across all protected routes
- [x] All CRUD operations verified via API calls
- [x] Docker compose up runs all services together
