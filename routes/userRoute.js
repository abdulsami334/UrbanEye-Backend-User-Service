const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage });
const { storage } = require('../utils/cloudinary'); 
const { signup, Login,adminLogin } = require('../controllers/authcontroller');

router.post('/signup',upload.single('profileImage'), signup);
router.post('/login', Login);
router.post('/adminlogin', adminLogin);
router.get('/ping', (req, res) => {
  res.send("User API is alive ✅");
});

module.exports = router;


