import React, { useState } from 'react';
import { Send, ClipboardList, User, DollarSign, MapPin, Calendar, Car, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const ClaimForm = ({ onClaimSubmitted }) => {
  const [formData, setFormData] = useState({
    // Customer Info
    policyNumber: '',
    claimantName: '',
    age: '',
    monthsAsCustomer: '',
    insuredSex: 'MALE',
    insuredEducationLevel: 'College',
    insuredOccupation: 'prof-specialty',
    insuredRelationship: 'not-in-family',
    
    // Incident Info
    claimAmount: '',
    incidentDate: '',
    incidentType: 'Single Vehicle Collision',
    collisionType: 'Front Collision',
    incidentSeverity: 'Major Damage',
    location: '',
    incidentHourOfTheDay: '',
    numberOfVehiclesInvolved: '1',
    
    // Damage Info
    propertyDamage: 'YES',
    bodilyInjuries: '0',
    witnesses: '0',
    policeReportAvailable: 'YES',
    
    // Claim breakdown (auto-calculated)
    injuryClaim: '',
    propertyClaim: '',
    vehicleClaim: '',
  });

  // Auto-calculate claim breakdown when amount changes
  const handleAmountChange = (value) => {
    const amount = parseFloat(value) || 0;
    setFormData({
      ...formData,
      claimAmount: value,
      injuryClaim: (amount * 0.2).toFixed(2),
      propertyClaim: (amount * 0.3).toFixed(2),
      vehicleClaim: (amount * 0.5).toFixed(2),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/claims/submit', formData);
      alert("Claim submitted successfully!");
      onClaimSubmitted();
    } catch (err) {
      console.error(err);
      alert("Error submitting claim");
    }
  };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "text-sm font-medium text-slate-600";
  const selectClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <ClipboardList className="text-slate-400" size={24} />
        New Insurance Claim
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Customer Information Section */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
            <User size={18} /> Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Policy Number</label>
              <input type="text" placeholder="POL-12345" className={inputClass}
                onChange={(e) => setFormData({...formData, policyNumber: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Claimant Name</label>
              <input type="text" placeholder="John Doe" className={inputClass}
                onChange={(e) => setFormData({...formData, claimantName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Age</label>
              <input type="number" placeholder="35" className={inputClass}
                onChange={(e) => setFormData({...formData, age: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Months as Customer</label>
              <input type="number" placeholder="24" className={inputClass}
                onChange={(e) => setFormData({...formData, monthsAsCustomer: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Sex</label>
              <select className={selectClass} value={formData.insuredSex}
                onChange={(e) => setFormData({...formData, insuredSex: e.target.value})}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Education Level</label>
              <select className={selectClass} value={formData.insuredEducationLevel}
                onChange={(e) => setFormData({...formData, insuredEducationLevel: e.target.value})}>
                <option value="High School">High School</option>
                <option value="Associate">Associate</option>
                <option value="College">College</option>
                <option value="Masters">Masters</option>
                <option value="MD">MD</option>
                <option value="PhD">PhD</option>
                <option value="JD">JD</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Occupation</label>
              <select className={selectClass} value={formData.insuredOccupation}
                onChange={(e) => setFormData({...formData, insuredOccupation: e.target.value})}>
                <option value="prof-specialty">Professional Specialty</option>
                <option value="exec-managerial">Executive/Managerial</option>
                <option value="sales">Sales</option>
                <option value="tech-support">Tech Support</option>
                <option value="craft-repair">Craft/Repair</option>
                <option value="machine-op-inspct">Machine Operator</option>
                <option value="transport-moving">Transport/Moving</option>
                <option value="armed-forces">Armed Forces</option>
                <option value="adm-clerical">Admin/Clerical</option>
                <option value="protective-serv">Protective Service</option>
                <option value="priv-house-serv">Private Household</option>
                <option value="farming-fishing">Farming/Fishing</option>
                <option value="handlers-cleaners">Handlers/Cleaners</option>
                <option value="other-service">Other Service</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Relationship</label>
              <select className={selectClass} value={formData.insuredRelationship}
                onChange={(e) => setFormData({...formData, insuredRelationship: e.target.value})}>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="own-child">Own Child</option>
                <option value="other-relative">Other Relative</option>
                <option value="not-in-family">Not in Family</option>
                <option value="unmarried">Unmarried</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incident Details Section */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Car size={18} /> Incident Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Claim Amount ($)</label>
              <input type="number" placeholder="5000" className={inputClass}
                value={formData.claimAmount}
                onChange={(e) => handleAmountChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Incident Date</label>
              <input type="date" className={inputClass}
                onChange={(e) => setFormData({...formData, incidentDate: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Incident Hour</label>
              <input type="number" placeholder="14" min="0" max="23" className={inputClass}
                onChange={(e) => setFormData({...formData, incidentHourOfTheDay: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Incident Type</label>
              <select className={selectClass} value={formData.incidentType}
                onChange={(e) => setFormData({...formData, incidentType: e.target.value})}>
                <option value="Single Vehicle Collision">Single Vehicle Collision</option>
                <option value="Multi-vehicle Collision">Multi-Vehicle Collision</option>
                <option value="Vehicle Theft">Vehicle Theft</option>
                <option value="Parked Car">Parked Car</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Collision Type</label>
              <select className={selectClass} value={formData.collisionType}
                onChange={(e) => setFormData({...formData, collisionType: e.target.value})}>
                <option value="Front Collision">Front Collision</option>
                <option value="Rear Collision">Rear Collision</option>
                <option value="Side Collision">Side Collision</option>
                <option value="?">Unknown</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Incident Severity</label>
              <select className={selectClass} value={formData.incidentSeverity}
                onChange={(e) => setFormData({...formData, incidentSeverity: e.target.value})}>
                <option value="Trivial Damage">Trivial Damage</option>
                <option value="Minor Damage">Minor Damage</option>
                <option value="Major Damage">Major Damage</option>
                <option value="Total Loss">Total Loss</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Location</label>
              <input type="text" placeholder="City, Street" className={inputClass}
                onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Vehicles Involved</label>
              <input type="number" placeholder="1" min="1" max="10" className={inputClass}
                value={formData.numberOfVehiclesInvolved}
                onChange={(e) => setFormData({...formData, numberOfVehiclesInvolved: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Damage & Evidence Section */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} /> Damage & Evidence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Property Damage</label>
              <select className={selectClass} value={formData.propertyDamage}
                onChange={(e) => setFormData({...formData, propertyDamage: e.target.value})}>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Bodily Injuries</label>
              <input type="number" placeholder="0" min="0" className={inputClass}
                value={formData.bodilyInjuries}
                onChange={(e) => setFormData({...formData, bodilyInjuries: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Witnesses</label>
              <input type="number" placeholder="0" min="0" className={inputClass}
                value={formData.witnesses}
                onChange={(e) => setFormData({...formData, witnesses: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Police Report</label>
              <select className={selectClass} value={formData.policeReportAvailable}
                onChange={(e) => setFormData({...formData, policeReportAvailable: e.target.value})}>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
            {/* Claim breakdown - read only */}
            <div className="space-y-2">
              <label className={labelClass}>Injury Claim ($)</label>
              <input type="text" className={`${inputClass} bg-slate-100`} value={formData.injuryClaim} readOnly />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Property Claim ($)</label>
              <input type="text" className={`${inputClass} bg-slate-100`} value={formData.propertyClaim} readOnly />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Vehicle Claim ($)</label>
              <input type="text" className={`${inputClass} bg-slate-100`} value={formData.vehicleClaim} readOnly />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 bg-slate-900 text-white p-4 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} /> Submit for AI Analysis
        </button>
      </form>
    </div>
  );
};

export default ClaimForm;