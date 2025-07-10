const express = require('express');
const router = express.Router();
const upload = require('../midlewares/upload');
const { signup, Login } = require('../controllers/authcontroller');

router.post('/signup',upload.single('profileImage'), signup);
router.post('/login', Login);
router.get('/ping', (req, res) => {
  res.send("User API is alive ✅");
});

module.exports = router;


