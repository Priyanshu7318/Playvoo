const express = require('express');
const { addVideo, addView, getByTag, getVideo, random, search, sub, trend, like, dislike, getByUser } = require('../controllers/videos');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a video
router.post('/', verifyToken, addVideo);
// Update views
router.put('/view/:id', addView);
// Trend videos
router.get('/trend', trend);
// Random videos
router.get('/random', random);
// Subscribed channels videos
router.get('/sub', verifyToken, sub);
// Get videos by tags
router.get('/tags', getByTag);
// Search videos
router.get('/search', search);

router.put('/like/:videoId', verifyToken, like);
router.put('/dislike/:videoId', verifyToken, dislike);

router.get('/user/:userId', getByUser);
router.get('/find/:id', getVideo);

// Upload video and thumbnail files
router.post('/upload', verifyToken, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), (req, res) => {
  if (!req.files || !req.files.video) return res.status(400).json({ message: "No video uploaded!" });
  
  const videoUrl = `/uploads/${req.files.video[0].filename}`;
  let imgUrl = "https://images.unsplash.com/photo-1626544827763-d516dce335e4?q=80&w=800"; // default
  
  if (req.files.thumbnail) {
    imgUrl = `/uploads/${req.files.thumbnail[0].filename}`;
  }
  
  res.status(200).json({ videoUrl, imgUrl });
});

module.exports = router;
