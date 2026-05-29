# Setup and Run Commands for DSA Pro Tracker

This document provides a quick reference for all the commands needed to install dependencies, configure the project, and start both the frontend and backend servers.

## 1. Prerequisites
- **Node.js**: Make sure Node.js (v16 or higher recommended) is installed. You can verify this by running:
  ```bash
  node -v
  npm -v
  ```
- **Firebase Account**: Required for Authentication and Firestore.

## 2. Install Dependencies
Since this project uses npm workspaces, you can install both backend and frontend dependencies with a single command from the root directory:

```bash
# Make sure you are in the root directory (dsa-tracker)
npm install
```

## 3. Environment Variables Setup
Before starting the app, you need to create the `.env` files for both frontend and backend.

**Backend (`backend/.env`):**
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```
*(Also, place your `serviceAccountKey.json` from Firebase Admin inside the `backend/` directory).*

**Frontend (`frontend/.env`):**
Create a `.env` file in the `frontend/` directory:
```env
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

## 4. How to Start the App

You need to run both the backend and frontend. It's recommended to open two separate terminal windows/tabs.

**Terminal 1 (Start the Backend):**
From the root directory (`dsa-tracker`), run:
```bash
npm start
```
*(This executes `npm start --workspace=backend` to start the Node server).*

**Terminal 2 (Start the Frontend):**
From the root directory (`dsa-tracker`), run:
```bash
npm run dev
```
*(This executes `npm run dev --workspace=frontend` to start the React development server).*

## 5. Other Useful Commands

**Build the frontend for production:**
```bash
# From the root directory
npm run build
```

**Run frontend specifically from the frontend folder:**
```bash
cd frontend
npm run dev
```

**Run backend specifically from the backend folder:**
```bash
cd backend
npm start
```
