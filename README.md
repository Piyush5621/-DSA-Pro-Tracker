# 🚀 DSA Pro Tracker

**DSA Pro Tracker** is a full-stack web application for tracking competitive programming and DSA problem-solving progress. It combines a polished React UI with Firebase-backed authentication and data storage, plus an Express backend for API routing and realtime active-user stats.

## ✨ What This Project Does

- Loads a structured DSA problem tree from `frontend/src/data/dsaData.json`
- Displays topic and technique views so users can explore problems by category
- Lets users search across all question titles and filter problems instantly
- Tracks progress per user in real time using Google sign-in, local state, and Firestore
- Saves per-question status, notes, and solved metadata
- Shows live dashboard metrics for completion, solved count, revisit count, and stuck count
- Provides a responsive, animated learning dashboard with dark mode support

## ✅ Key Features

- **Google Authentication** with Firebase Auth
- **Progress persistence** using Firestore and browser localStorage fallback
- **Problem status management**:
  - `Completed`
  - `Revisit`
  - `Stuck`
- **Dynamic topic & technique explorer**
- **Search and filter** across the full DSA sheet
- **Visual analytics** with completion percentage, solved count, revisit count, and stuck count
- **Realtime active user stats** via Socket.IO + backend API
- **Responsive UI** with modern animations using Framer Motion
- **Custom dark/light theme support**
- **Browser routing** with React Router
- **Backend API endpoints** for sheet data, progress, and stats
- **Build-ready static frontend** served from Express in production

## 🧱 Tech Stack & Libraries Used

### Frontend
- `react`
- `react-dom`
- `react-router-dom`
- `firebase`
- `axios`
- `framer-motion`
- `lucide-react`
- `react-icons`
- `tailwindcss`
- `clsx`
- `tailwind-merge`
- `react-scripts`

### Backend
- `express`
- `cors`
- `socket.io`
- `firebase-admin`
- `cheerio` (included in backend dependencies)

### Data & Tooling
- Firebase Firestore for user progress storage
- Firebase Auth for Google sign-in
- LocalStorage for offline / fast local progress caching
- `npm` for package management
- `serve` for production frontend hosting

## 📁 Project Structure

- `frontend/` — React UI, pages, components, data, and theme/auth contexts
- `backend/` — Express server, Firebase-auth middleware, API routes, and Socket.IO stats
- `frontend/src/data/dsaData.json` — problem tree source for the sheet
- `backend/index.js` — API and server entry point
- `frontend/src/firebase.js` — Firebase config and auth setup
- `frontend/src/context/ProgressContext.jsx` — progress loading, saving, and state handling
- `frontend/src/context/AuthContext.jsx` — authentication provider
- `dsa-tracker/scripts/parseBookmarks.js` — utility for parsing bookmark data

## 🚀 Setup & Run

### 1. Install root workspace dependencies
```bash
cd dsa-tracker
npm install
```

### 2. Configure backend

1. Create a Firebase project
2. Enable Google Authentication
3. Enable Firestore database
4. Download Firebase Admin SDK `serviceAccountKey.json`
5. Place `serviceAccountKey.json` inside `dsa-tracker/backend`
6. Create a `.env` in `dsa-tracker/backend` with:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Configure frontend

Create `.env` inside `dsa-tracker/frontend` with your Firebase web config:
```env
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

### 4. Run locally

Start backend:
```bash
cd dsa-tracker/backend
npm start
```

Start frontend:
```bash
cd dsa-tracker/frontend
npm run dev
```

Open `http://localhost:3000` and sign in with Google.

## 🔧 How Data Flows

- The frontend loads DSA problem data from `frontend/src/data/dsaData.json`
- The app stores user progress in `progress` Firestore documents keyed by UID
- Progress calls are proxied through `backend/index.js` at `/api/progress`
- The backend also serves `/api/sheet` and `/api/stats`
- Socket.IO broadcasts `activeUsers` count in real time when users connect/disconnect

## 💡 Notes

- The app is built to be production-ready: the frontend build can be served statically by the Express backend
- Progress is saved in Firestore, but localStorage is used as a fallback so users can still keep session data if backend connectivity fails
- `dsaData.json` contains the full curated problem tree and topic structure

## 📝 Recommended Enhancements

- Add direct problem bookmarking and shareable study plans
- Add pagination or lazy-loading for very large problem sets
- Add user profile preferences and custom themes

---

**Created for DSA tracking and interview preparation.**
