const Claim = require('../models/Claim');
const axios = require('axios');

exports.submitClaim = async (req, res) => {
    try {
        const newClaim = new Claim(req.body);
        const savedClaim = await newClaim.save();

        try {
            // Send all relevant fields to ML service
            const mlResponse = await axios.post('http://localhost:8000/analyze', {
                policyNumber: savedClaim.policyNumber,
                claimAmount: savedClaim.claimAmount,
                incidentType: savedClaim.incidentType,
                collisionType: savedClaim.collisionType,
                incidentSeverity: savedClaim.incidentSeverity,
                location: savedClaim.location,
                age: savedClaim.age,
                monthsAsCustomer: savedClaim.monthsAsCustomer,
                insuredSex: savedClaim.insuredSex,
                insuredEducationLevel: savedClaim.insuredEducationLevel,
                insuredOccupation: savedClaim.insuredOccupation,
                insuredRelationship: savedClaim.insuredRelationship,
                incidentHourOfTheDay: savedClaim.incidentHourOfTheDay,
                numberOfVehiclesInvolved: savedClaim.numberOfVehiclesInvolved,
                propertyDamage: savedClaim.propertyDamage,
                bodilyInjuries: savedClaim.bodilyInjuries,
                witnesses: savedClaim.witnesses,
                policeReportAvailable: savedClaim.policeReportAvailable,
                injuryClaim: savedClaim.injuryClaim,
                propertyClaim: savedClaim.propertyClaim,
                vehicleClaim: savedClaim.vehicleClaim,
            });

            savedClaim.fraudScore = mlResponse.data.fraudScore;
            savedClaim.isFlagged = mlResponse.data.isFlagged;
            savedClaim.status = mlResponse.data.isFlagged ? 'Under Review' : 'Approved';
            await savedClaim.save();
        } catch (mlError) {
            console.error('ML Service Error:', mlError.message);
        }

        res.status(201).json(savedClaim);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.find().sort({ createdAt: -1 });
        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};