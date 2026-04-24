const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    // Customer Info
    policyNumber: { type: String, required: true },
    claimantName: { type: String, required: true },
    age: { type: Number },
    monthsAsCustomer: { type: Number },
    insuredSex: { type: String },
    insuredEducationLevel: { type: String },
    insuredOccupation: { type: String },
    insuredRelationship: { type: String },
    
    // Incident Info
    claimAmount: { type: Number, required: true },
    incidentDate: { type: Date, required: true },
    incidentType: { type: String, default: 'Single Vehicle Collision' },
    collisionType: { type: String },
    incidentSeverity: { type: String },
    location: { type: String },
    incidentHourOfTheDay: { type: Number },
    numberOfVehiclesInvolved: { type: Number, default: 1 },
    
    // Damage Info
    propertyDamage: { type: String },
    bodilyInjuries: { type: Number, default: 0 },
    witnesses: { type: Number, default: 0 },
    policeReportAvailable: { type: String },
    
    // Claim breakdown
    injuryClaim: { type: Number, default: 0 },
    propertyClaim: { type: Number, default: 0 },
    vehicleClaim: { type: Number, default: 0 },
    
    // ML Service fields
    fraudScore: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
    status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);