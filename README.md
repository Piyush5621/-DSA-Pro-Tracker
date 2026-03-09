# 🚀 DSA Pro Tracker

A completely premium, aesthetically stunning full-stack MERN application (React.js, Node.js, Firebase) designed precisely to track your progress across multiple competitive programming and DSA platforms including **LeetCode**, **GeeksforGeeks**, **HackerRank**, **CodeChef**, and **CodingNinjas**.

## ✨ Features

- **2500+ Curated Problems**: Automatically loaded from a comprehensive DSA topic tree.
- **Floating Island Navigation**: Glassmorphic, highly-polished floating navbar.
- **Smart Progress Filters**: Instantly sort huge problem trees by "Solved", "Unsolved", "Need Review", or "Stuck" into flattened, easy-to-read grids.
- **Interactive Deep Search**: Search not just by topics, but deeply across every single individual question title.
- **Premium Analytics Dashboard**: Live updating dashboard showing completion stats, queue counts, and a visual progress bar.
- **Rich Status Tracking**: 
  - Complete a problem (Pop animation checkmark + green background highlight)
  - Mark as "Revisit" (Clock icon)
  - Mark as "Stuck" (Warning icon) 
- **Smart Integrated Notes**: Private collapsible notes section per-question to type your time/space complexity or core logic to revise later.
- **Platform Badges**: Automatic vendor-specific chips with exact brand colors and icons (`react-icons`).
- **Google Authentication**: Frictionless 1-click Google sign in via Firebase Auth.
- **True Dark/Light Mode**: Full custom Tailwind styling that completely transforms between pristine light mode and ultra-sleek dark mode.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Lucide React, React Router
- **Backend / Authentication**: Firebase (Authentication + Firestore Database), Node.js / Express
- **Build / Tooling**: Vercel ready, npm

## 📸 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Piyush5621/-DSA-Pro-Tracker.git
   cd -DSA-Pro-Tracker
   ```

2. **Backend Setup (Express + Firebase):**
   - Create a Firebase project and enable Firestore and Google Authentication.
   - Place your `serviceAccountKey.json` from Firebase Admin SDK into the `/backend` folder.
   - Create a `.env` file in `/backend`:
     ```env
     PORT=5000
     ```
   - Install dependencies and start:
     ```bash
     cd backend
     npm install
     npm run dev
     ```

3. **Frontend Setup (React):**
   - Create a `.env` file in the `/frontend` directory containing your Firebase Web App config:
     ```env
     VITE_FIREBASE_API_KEY=your_key
     VITE_FIREBASE_AUTH_DOMAIN=your_domain
     VITE_FIREBASE_PROJECT_ID=your_id
     VITE_FIREBASE_STORAGE_BUCKET=your_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
   - Install dependencies and start:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

## 💡 About
Built to solve the chaotic problem of having dozens of spreadsheets and browser bookmarks attempting to track programming knowledge. With **DSA Pro Tracker**, everything you need is organized cleanly with industry-standard web practices.

---
*Created by Piyush Kumar.*
