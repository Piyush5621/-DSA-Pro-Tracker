const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { admin, db } = require('./firebaseAdmin');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const fs = require('fs');
const path = require('path');
const LOCAL_DB_PATH = path.join(__dirname, 'data', 'progress.json');

const readLocalData = () => {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
    }
  } catch (err) {
    console.error("Local DB read error:", err);
  }
  return {};
};

const writeLocalData = (data) => {
  try {
    if (!fs.existsSync(path.dirname(LOCAL_DB_PATH))) {
      fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Local DB write error:", err);
  }
};

// Track active users using io.engine.clientsCount
io.on('connection', (socket) => {
  io.emit('activeUsers', io.engine.clientsCount);

  socket.on('disconnect', () => {
    io.emit('activeUsers', io.engine.clientsCount);
  });
});


// Middleware to verify Firebase ID token
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Serve the DSA sheet data (static JSON)
const dsaData = require('../frontend/src/data/dsaData.json');
app.get('/api/sheet', (req, res) => {
  res.json(dsaData);
});

// Get user's solved questions
app.get('/api/progress', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const doc = await db.collection('progress').doc(userId).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.json({ solved: [], userProgress: {} });
    }
  } catch (error) {
    console.warn("\n[WARNING] Firestore GET error, using local fallback:", error.message);
    const localData = readLocalData();
    const userData = localData[req.user.uid] || { solved: [], userProgress: {} };
    res.json(userData);
  }
});

// Update solved questions and notes
app.post('/api/progress', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { solved, userProgress } = req.body;
    const updateData = {};
    if (solved !== undefined) updateData.solved = solved;
    if (userProgress !== undefined) updateData.userProgress = userProgress;

    await db.collection('progress').doc(userId).set(updateData, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.warn("[WARNING] Firestore POST error, using local fallback:", error.message);
    const localData = readLocalData();
    const currentUserData = localData[req.user.uid] || { solved: [], userProgress: {} };
    
    if (req.body.solved !== undefined) currentUserData.solved = req.body.solved;
    if (req.body.userProgress !== undefined) {
      currentUserData.userProgress = { ...currentUserData.userProgress, ...req.body.userProgress };
    }
    
    localData[req.user.uid] = currentUserData;
    writeLocalData(localData);
    
    res.json({ success: true, localFallback: true });
  }
});

// Optional: Expose global stats for the landing page
app.get('/api/stats', async (req, res) => {
  try {
    // Count from Firebase Auth to get actual registered accounts
    const listUsersResult = await admin.auth().listUsers(1000);
    const totalUsers = listUsersResult.users.length;
    
    res.json({
        activeUsers: io.engine.clientsCount,
        totalRegistered: Math.max(totalUsers, 1)
    });
  } catch (error) {
    console.warn("Stats fetch error, using local fallback count:", error.message);
    const localData = readLocalData();
    const localUsersCount = Object.keys(localData).length;
    res.json({ activeUsers: io.engine.clientsCount, totalRegistered: Math.max(localUsersCount, 1) });
  }
});

// Serve the frontend build

// Serve the frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO`));