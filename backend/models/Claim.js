const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    claimantName: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    incidentDate: { type: Date, required: true },
    incidentType: { type: String, enum: ['Accident', 'Theft', 'Medical', 'Other'], default: 'Accident' },
    location: { type: String },
    description: { type: String },
    
    // Fields for the ML service to update later
    fraudScore: { type: Number, default: 0 }, 
    isFlagged: { type: Boolean, default: false },
    status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);