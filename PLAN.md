# Job Connect Portal - Development Plan

This document outlines the step-by-step implementation plan for the Job Connect Portal. The architecture separates the frontend (Next.js) and backend (Laravel REST API) into distinct Docker containers, utilizing a PostgreSQL database.

## Part 1: Docker Infrastructure & Environment Setup
**Goal:** Establish the containerized environment for local development.

1. **Root Directory Setup:** Create a root folder `job-connect-portal` to house both projects and the orchestration files.
2. **Docker Compose Configuration (`docker-compose.yml`):**
    *   **Service: `db`:** Use the official `postgres:15-alpine` image. Configure environment variables for `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`. Map port `5432`.
    *   **Service: `backend`:** Create a `Dockerfile` based on `php:8.2-fpm` (or use Laravel Sail). Install necessary PHP extensions (pdo_pgsql). Map port `8000`.
    *   **Service: `frontend`:** Create a `Dockerfile` based on `node:18-alpine`. Expose port `3000`.
3. **Network Configuration:** Define a custom Docker bridge network so all services can securely communicate.
4. **Volume Management:** Mount local directories to containers for hot-reloading and set up a persistent volume for the PostgreSQL database.

## Part 2: Backend Initialization & Authentication (Laravel)
**Goal:** Set up the Laravel REST API, configure the database, and implement robust authentication.

1. **Laravel Installation:** Run `composer create-project laravel/laravel backend` within the backend container.
2. **Database Configuration:** Update `.env` to point to the `db` Docker service (Host: `db`, Port: `5432`). Run initial migrations.
3. **API Authentication (Laravel Sanctum):** 
    *   Install and configure Laravel Sanctum for API token management.
    *   Create `AuthController` with endpoints for `/api/register`, `/api/login`, and `/api/logout`.
4. **Email Verification:**
    *   Ensure the `User` model implements the `MustVerifyEmail` contract.
    *   Set up a mail service in `.env` (e.g., Mailtrap for local testing).
    *   Create endpoints: `/api/email/verify/{id}/{hash}` and `/api/email/verification-notification` for resending the link.
5. **Google OAuth (Laravel Socialite):**
    *   Install Laravel Socialite.
    *   Set up Google Cloud Console credentials (Client ID, Secret) and add them to `.env`.
    *   Create endpoints `/api/auth/google/redirect` and `/api/auth/google/callback` to handle the OAuth flow and user creation/login. Update the `users` table to include a `google_id` column.

## Part 3: Database Design & Modeling (Outreach Tracker)
**Goal:** Replicate the data structure shown in the provided image (`image_7a6737.jpg`) for tracking recruiter outreach.

1. **Migration Creation:** Run `php artisan make:migration create_outreaches_table`.
2. **Schema Definition:** Define the following columns to match the image requirements:
    *   `id` (Primary Key)
    *   `user_id` (Foreign Key referencing `users` table)
    *   `company` (String)
    *   `sector` (String)
    *   `recruiter` (String - Name of the recruiter)
    *   `linkedin` (String - URL to LinkedIn profile)
    *   `msg_sent` (Date - Date the message was sent)
    *   `reply` (Enum/String - e.g., 'Yes', 'No', 'Pending')
    *   `next_action` (String - Action to take, e.g., 'Send Msg 2 today')
    *   `timestamps` (created_at, updated_at)
3. **Model Setup:** Create the `Outreach` model. Define the fillable properties and the `belongsTo` relationship with the `User` model.
4. **Seeders & Factories:** Create an `OutreachFactory` to generate mock data for testing UI layouts.

## Part 4: Backend API Development (Outreach Endpoints)
**Goal:** Expose CRUD operations for the Outreach data via secure REST APIs.

1. **Controllers:** Create `OutreachController` utilizing API resource methods (`index`, `store`, `show`, `update`, `destroy`).
2. **Middleware:** Apply `auth:sanctum` and `verified` middleware to the outreach routes to ensure only verified, logged-in users can access their data.
3. **Form Requests:** Create `StoreOutreachRequest` and `UpdateOutreachRequest` to validate incoming JSON payloads (e.g., ensuring URLs are valid, required fields are present).
4. **API Resources:** Create `OutreachResource` to format the JSON responses cleanly and consistently.

## Part 5: Frontend Initialization & Global Setup (Next.js)
**Goal:** Bootstrap the Next.js application and configure essential global tools.

1. **Next.js Installation:** Run `npx create-next-app@latest frontend` with TypeScript and Tailwind CSS enabled.
2. **Axios Configuration:** 
    *   Install `axios`. 
    *   Create an `api.js` or `axios.ts` utility file.
    *   Configure the base URL to point to `http://localhost:8000/api`.
    *   Set up interceptors to attach the authentication token (from cookies or local storage) to every request and handle 401/403 responses (redirect to login).
3. **State Management / Data Fetching:** Install tools like React Query or SWR for efficient server-state management and caching.

## Part 6: Frontend Authentication Flow
**Goal:** Build the user-facing authentication screens and integrate them with the API.

1. **Auth Pages:** Create UI components for `/login` and `/register`.
2. **Email Verification UI:** Create a `/verify-email` prompt page that informs the user to check their inbox. Add a "Resend Verification Email" button.
3. **Google Login Integration:** Add a "Sign in with Google" button that triggers the Laravel Socialite flow. Alternatively, utilize `NextAuth.js` configured with Google Provider and a custom credentials provider linking to the Laravel backend.
4. **Protected Routes:** Implement a Higher-Order Component (HOC) or Next.js middleware to restrict access to dashboard pages for unauthenticated or unverified users.

## Part 7: Frontend Dashboard & Outreach Table 
**Goal:** Build the core user interface matching the visual requirements from the provided image.

1. **Layout Component:** Create a dashboard layout with a sidebar/navbar and a main content area.
2. **Outreach Table Component:** 
    *   Design the table with a dark-themed UI (as seen in the reference image) using Tailwind CSS.
    *   Columns: `#`, `COMPANY`, `SECTOR`, `RECRUITER`, `LINKEDIN`, `MSG SENT`, `REPLY?`, `NEXT ACTION`.
    *   Integrate data fetching (via Axios/React Query) to populate the table with the user's data from `/api/outreaches`.
3. **Data Mutation UIs:**
    *   Create a Modal or separate page with a form to "Add New Outreach Record".
    *   Implement inline editing or an edit modal to update the `reply` status and `next_action`.
    *   Implement a delete action (with confirmation).

## Part 8: Polishing & Error Handling
**Goal:** Ensure the application is robust and user-friendly.

1. **Global Error Handling:** Add toast notifications (e.g., `react-toastify` or `sonner`) to display success messages (record saved) and error messages (API failures).
2. **Loading States:** Implement skeleton loaders for the table while data is being fetched.
3. **Form Validation:** Use `react-hook-form` alongside `zod` or `yup` for client-side form validation before submitting to the API.
