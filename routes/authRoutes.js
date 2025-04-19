const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { loginUser, registerUser, getUserInfo } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUserInfo);

router.post('/upload-image', upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No File uploaded" })
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json(imageUrl);
})

module.exports = router;