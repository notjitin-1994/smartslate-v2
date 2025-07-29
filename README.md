# SmartSlate Web Application

This repository contains the source code for the SmartSlate web application, a platform designed to bridge the skills gap and demonstrate the value of targeted talent development. The application features an interactive ROI calculator to illustrate the financial and career benefits for businesses, educators, and students.

## Technology Stack

This project is a monorepo composed of a SvelteKit frontend and a Firebase backend.

*   **Frontend**: [SvelteKit](https://kit.svelte.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Backend**: [Firebase Functions](https://firebase.google.com/docs/functions) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: CSS with variables for theming.
*   **Linting/Formatting**: [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

## Project Structure

The project is organized into two primary directories:

-   `frontend/`: Contains the SvelteKit application, including all components, routes, and static assets.
-   `backend/`: Contains the Firebase Cloud Functions written in TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher, as specified in `backend/functions/package.json`)
-   [pnpm](https://pnpm.io/installation) (or npm/yarn)
-   [Firebase CLI](https://firebase.google.com/docs/cli#install_the_cli)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Set Up Firebase

1.  Log in to the Firebase CLI:
    ```bash
    firebase login
    ```
2.  Initialize Firebase in the project (if not already done):
    ```bash
    firebase init
    ```
    Follow the prompts, selecting your existing Firebase project.

### 3. Frontend Setup

To run the frontend application locally for development:

1.  Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    pnpm install
    ```
2.  Start the development server:
    ```bash
    pnpm run dev
    ```
The application will be available at `http://localhost:5173` by default.

### 4. Backend Setup

To run the Firebase functions locally using the emulator suite:

1.  Navigate to the functions directory and install dependencies:
    ```bash
    cd backend/functions
    pnpm install
    ```
2.  Build the TypeScript source and start the emulators:
    ```bash
    pnpm run serve
    ```
The function logs and emulator status will be displayed in your terminal.

## Available Scripts

### Frontend (`frontend/`)

-   `pnpm run dev`: Starts the SvelteKit development server.
-   `pnpm run build`: Builds the application for production.
-   `pnpm run preview`: Previews the production build locally.
-   `pnpm run check`: Runs Svelte check for type-checking.
-   `pnpm run lint`: Lints the code using ESLint.
-   `pnpm run format`: Formats the code using Prettier.

### Backend (`backend/functions/`)

-   `pnpm run build`: Compiles the TypeScript code to JavaScript.
-   `pnpm run serve`: Builds the functions and starts the local Firebase emulator.
-   `pnpm run deploy`: Deploys the functions to your Firebase project.
-   `pnpm run logs`: Fetches logs for deployed functions.
