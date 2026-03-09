const admin = require('firebase-admin');
const fs = require('fs');

let db;

try {
  const serviceAccountPath = './serviceAccountKey.json';

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Check if it's the dummy key from the prompt/example
    if (serviceAccount.private_key && serviceAccount.private_key.includes('dummy_key') ||
      serviceAccount.private_key.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...')) {
      console.warn("⚠️ Using dummy service account key. Firestore will NOT work. Please replace backend/serviceAccountKey.json with your actual key.");
      // Initialize with a dummy project ID so that admin.firestore() doesn't crash on boot
      admin.initializeApp({ projectId: "dummy-project" });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } else {
    console.warn("⚠️ File serviceAccountKey.json not found. Creating a dummy file to prevent crashes.");
    admin.initializeApp({ projectId: "dummy-project" });
  }
} catch (error) {
  console.warn(`⚠️ Error reading service account key: ${error.message}. Running in mock mode.`);
  admin.initializeApp({ projectId: "dummy-project" });
}

try {
  db = admin.firestore();
} catch (e) {
  console.error("Failed to initialize firestore. Ensure your serviceAccountKey.json is valid.", e.message);
}
module.exports = { admin, db };