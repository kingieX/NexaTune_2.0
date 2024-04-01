const express = require('express');
const path = require('path');
const cors = require('cors');
const router = express.Router();

// Enable CORS for all routes under this router
const allowedOrigin = 'http://localhost:5173';
router.use(cors((
  {
    origin: allowedOrigin,
    credentials: true
  }
)));

// Assume your music files are in the 'uploads' directory
const musicDirectory = path.join(__dirname, 'uploads');

router.get('/music/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(musicDirectory, filename);

  res.sendFile(filePath);
});

module.exports = router;