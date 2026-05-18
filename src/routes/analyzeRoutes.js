const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); //middleware for handling file uploads 
const { parseResume } = require('../services/resumeParser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/parse', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded. Use form-data with key resume.' });
        }

        const text = await parseResume(req.file.path, req.file.mimetype);
        res.json({
            success: true,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            text
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }


    
});
const { analyzeResume } = require('../services/aiServices');

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ success: false, error: 'Job description is required' });
    }

    const resumeText = await parseResume(req.file.path, req.file.mimetype);
    const analysis = await analyzeResume(resumeText, req.body.jobDescription);

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
module.exports = router;
