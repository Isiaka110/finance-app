// routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const submissionController = require('../controllers/submissionController');
const multer = require('multer');

// Configure Multer storage
// WARNING: Storing files locally in 'uploads/' is for PROTOTYPE ONLY.
// For production, use cloud storage (S3/DigitalOcean Spaces).
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit (example)
}); 

// POST /api/submissions
// Protected route, handles file upload
router.post(
    '/', 
    auth, // 1. Check for valid JWT token
    upload.array('manuscriptFiles', 5), // 2. Handle file upload (up to 5 files)
    submissionController.createSubmission // 3. Handle controller logic
);

module.exports = router;