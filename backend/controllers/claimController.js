const Claim = require('../models/Claim');

// Submit a new claim
exports.submitClaim = async (req, res) => {
    try {
        const newClaim = new Claim(req.body);
        const savedClaim = await newClaim.save();
        res.status(201).json(savedClaim);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all claims for the dashboard
exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.find().sort({ createdAt: -1 });
        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};