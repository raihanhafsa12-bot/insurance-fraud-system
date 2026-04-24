const express = require('express');
const router = express.Router();
const { submitClaim, getClaims } = require('../controllers/claimController');

// URL: http://localhost:5000/api/claims/submit
router.post('/submit', submitClaim);

// URL: http://localhost:5000/api/claims/all
router.get('/all', getClaims);

module.exports = router;