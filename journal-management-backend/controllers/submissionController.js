// controllers/submissionController.js
const Submission = require('../models/Submission');
const fs = require('fs');
const path = require('path');

// @route   POST /api/submissions
// @desc    Create a new submission (Author only)
// @access  Private
exports.createSubmission = async (req, res) => {
  // req.user.id is available thanks to the auth middleware
  const submittedBy = req.user.id;
  
  // Data comes from req.body (for text fields) and req.files (for files)
  const { title, abstract, keywords, authors } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ msg: 'Manuscript files are required.' });
  }

  // IMPORTANT: In a real system, files would be uploaded to S3/Cloud Storage, 
  // and the 'url' would be the S3 link, not a local path.
  // For this prototype, we're storing temporary file paths.
  const files = req.files.map(f => ({
    filename: f.originalname,
    // Note: The URL here is temporary/placeholder.
    url: `/uploads/${f.filename}`, 
    fileType: f.mimetype,
    // Add path for cleanup/S3 upload logic later
    localPath: f.path 
  }));

  try {
    // Keywords and Authors often come in as strings/JSON strings via multipart form, 
    // so we need to parse them.
    const parsedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
    // Assuming 'authors' is a JSON string of array objects: [{name, email, affiliation}]
    const parsedAuthors = authors ? JSON.parse(authors) : []; 

    const submission = new Submission({
      title,
      abstract,
      keywords: parsedKeywords,
      authors: parsedAuthors,
      submittedBy,
      files,
      // Status defaults to 'submitted' in the schema
    });

    await submission.save();

    // In a real application, after saving, you would move/stream the files 
    // from the 'uploads/' directory to S3 or permanent storage.

    // Optional: Clean up temporary local files after successful DB save (if not needed for S3 upload)
    // req.files.forEach(f => fs.unlinkSync(f.path)); 

    // Send confirmation email (async/in a separate service)

    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    // Important: Clean up uploaded files if DB save fails
    if (req.files) {
        req.files.forEach(f => fs.unlinkSync(f.path));
    }
    res.status(500).json({ error: 'Could not create submission' });
  }
};