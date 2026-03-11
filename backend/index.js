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
    console.error("\n[WARNING] Firestore GET error:", error.message);
    const fs = require('fs');
    fs.appendFileSync('progress_logs.txt', `[GET] ERROR: ${error.message}\n`);
    res.status(200).json({ solved: [], userProgress: {} });
  }
});

// Update solved questions and notes
app.post('/api/progress', authenticate, async (req, res) => {
  const fs = require('fs');
  fs.appendFileSync('progress_logs.txt', `[POST] REQ.BODY: ${JSON.stringify(req.body)}\n`);
  try {
    const userId = req.user.uid;
    const { solved, userProgress } = req.body;
    const updateData = {};
    if (solved !== undefined) updateData.solved = solved;
    if (userProgress !== undefined) updateData.userProgress = userProgress;

    await db.collection('progress').doc(userId).set(updateData, { merge: true });
    fs.appendFileSync('progress_logs.txt', `[POST] SUCCESS\n`);
    res.json({ success: true });
  } catch (error) {
    console.error("[WARNING] Firestore POST error:", error.message);
    fs.appendFileSync('progress_logs.txt', `[POST] ERROR: ${error.message}\n`);
    res.status(200).json({ success: false, warning: "Firestore not enabled. Progress not saved." });
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
    console.error("Stats fetch error:", error.message);
    res.json({ activeUsers: io.engine.clientsCount, totalRegistered: 1 });
  }
});

const path = require('path');

// Serve the frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO`));