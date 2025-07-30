# SmartSlate: Project Knowledge Base

## 1. Project Vision & Purpose

**SmartSlate** is a strategic EdTech platform designed to solve the "Talent Paradox" in India. The core mission is to bridge the critical skills gap between the demands of a rapidly growing economy and the capabilities of the emerging workforce.

The platform targets three primary personas:
*   **Businesses:** Seeking to build a future-ready workforce, reduce attrition, and increase productivity through targeted upskilling.
*   **Educators:** Aiming to enhance institutional prestige by producing verifiably skilled, employable graduates and fostering stronger industry partnerships.
*   **Students/Learners:** Looking to accelerate their career trajectory, increase their earning potential, and unlock new job opportunities by acquiring in-demand skills.

SmartSlate addresses this challenge by providing a transformative framework that delivers measurable ROI and career benefits for all stakeholders.

## 2. Core Features & Functionality

*   **User Authentication:** Secure sign-up, login, and session management handled by Firebase Authentication. Includes social authentication options.
*   **Role-Based Access Control (RBAC):** A sophisticated system with distinct roles (`smartslateAdmin`, `smartslateManager`, `smartslateClientManager`, `learner`) that governs access to different features and data.
*   **Admin Dashboard:** A comprehensive backend interface for platform management.
    *   **User Management:** View, search, and manage all users. Admins can enable/disable accounts, delete users, and change user roles.
    *   **Content Management:** Manage course offerings and other platform content.
*   **User Profiles:** Dedicated profile pages for users to manage their information and track their progress.
*   **Interactive ROI Calculator:** A key marketing and engagement tool on the landing page that provides a personalized impact analysis for each user persona, quantifying the value proposition of the platform.
*   **Admin Impersonation:** A secure feature allowing `smartslateAdmin` users to log in as other non-admin users for troubleshooting and support purposes.

## 3. Technical Architecture

SmartSlate is built on a modern, two-part architecture: a SvelteKit frontend and a serverless Firebase backend.

### Frontend (SvelteKit)

*   **Framework:** Built with **SvelteKit**, a full-stack Svelte framework that provides a fast, modern development experience with features like server-side rendering (SSR) and static site generation (SSG).
*   **Routing:** Utilizes SvelteKit's file-based routing system located in `frontend/src/routes`.
    *   **Layouts:** Group layouts like `(app)/+layout.svelte` are used to apply consistent UI and logic to entire sections of the application without affecting the URL structure.
    *   **Pages:** Individual pages are created with `+page.svelte` files.
*   **Component Architecture:** Components are logically organized within `frontend/src/lib/components` into clear subdirectories (`common`, `admin`, `pages`, `landing`), promoting modularity and reusability.
*   **State Management:** Global application state is managed reactively using **Svelte Stores**. The `frontend/src/lib/stores/authStore.ts` is a critical piece, handling user authentication status and role information across the app.
*   **Styling:** The application employs a robust, centralized design system.
    *   **Global Styles:** Core styles, typography, and component primitives are defined in `frontend/src/app.css` using CSS custom properties (variables).
    *   **Design System:** The visual identity is formally documented in `COLOR_PALETTE.md`, which specifies the color palette, usage guidelines, and accessibility considerations.

### Backend (Firebase/Node.js)

*   **Platform:** The backend logic is deployed as **Firebase Cloud Functions v2**, providing a scalable, serverless environment.
*   **API Structure:** The backend is exposed as a single, unified HTTP service using the **Express.js** framework. This is a modern, maintainable pattern that consolidates API logic.
    *   All API routes are organized under a main `api` function in `backend-v2/functions/src/index.ts`.
    *   Administrative endpoints are grouped logically under the `/admin` path using an Express router.
*   **Authentication:** Endpoints are secured by a robust, role-based authentication middleware.
    *   It validates **Firebase ID Tokens** sent in the `Authorization` header of each request.
    *   It checks for specific user roles (e.g., `smartslateAdmin`) stored as **custom claims** on the Firebase user object, ensuring granular access control.
*   **Database:** **Cloud Firestore** is the primary NoSQL database.
    *   A `users` collection stores user data, including roles and course enrollments.
    *   A Firebase Auth trigger (`createUserDocument`) automatically creates a new user profile in Firestore upon successful registration, assigning a default `learner` role.

## 4. Technology Stack

*   **Frontend:**
    *   Framework: **SvelteKit**
    *   Language: **TypeScript**
    *   UI Library: **Svelte 5**
    *   Build Tool: **Vite**
    *   Icons: **Lucide Svelte**
*   **Backend:**
    *   Platform: **Firebase Cloud Functions**
    *   Runtime: **Node.js (v20)**
    *   Framework: **Express.js**
    *   Language: **TypeScript**
*   **Database:**
    *   **Cloud Firestore** (NoSQL)
*   **Authentication:**
    *   **Firebase Authentication**
*   **Development & Tooling:**
    *   **ESLint**, **Prettier** for code quality and formatting.
    *   **Husky** for Git hooks.

## 5. Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   **Node.js:** Version 20.x is required.
*   **Firebase CLI:** Install it globally: `npm install -g firebase-tools`.

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/notjitin-1994/smartslate-v2.git
    cd smartslate-v2
    ```

2.  **Install Dependencies:**
    Install dependencies for the root, frontend, and backend projects.
    ```bash
    # Install root dependencies
    npm install

    # Install frontend dependencies
    cd frontend
    npm install
    cd ..

    # Install backend dependencies
    cd backend-v2/functions
    npm install
    cd ../..
    ```

3.  **Environment Variables:**
    The frontend requires Firebase configuration to connect to the backend.
    *   Navigate to the `frontend` directory.
    *   Create a new file named `.env` by copying the example: `cp .env.example .env`.
    *   Open `.env` and populate it with your Firebase project's web app configuration keys. You can find these in your Firebase project settings.

4.  **Run the Development Servers:**
    You will need two separate terminals to run the frontend and backend concurrently.

    *   **Terminal 1: Start the Backend Emulator**
        ```bash
        cd backend-v2/functions
        npm run serve
        ```
        This command builds the TypeScript code and starts the Firebase emulators for local development.

    *   **Terminal 2: Start the Frontend Dev Server**
        ```bash
        cd frontend
        npm run dev
        ```
        The SvelteKit application will now be running, typically at `http://localhost:5173`.
