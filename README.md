# Project Structure

This project is now split into two main directories: `frontend` and `backend`.

## Frontend

The `frontend` directory contains the React application. To run the frontend, navigate to the `frontend` directory and run the following commands:

```bash
cd frontend
npm install
npm run dev
```

To build the frontend, run:

```bash
cd frontend
npm run build
```

## Backend

The `backend` directory contains the Firebase functions. To deploy the backend, navigate to the `backend` directory and run the following commands:

```bash
cd backend
firebase deploy --only functions
