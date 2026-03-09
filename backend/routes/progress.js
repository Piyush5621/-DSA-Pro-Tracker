// Progress routes
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Progress API' });
});

module.exports = router;