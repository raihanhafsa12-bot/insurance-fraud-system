import React, { useState } from 'react';
import { Send, ClipboardList, User, DollarSign, MapPin } from 'lucide-react';
import axios from 'axios';

const ClaimForm = ({ onClaimSubmitted }) => {
  const [formData, setFormData] = useState({
    policyNumber: '',
    claimantName: '',
    claimAmount: '',
    incidentDate: '',
    incidentType: 'Accident',
    location: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/claims/submit', formData);
      alert("Claim submitted successfully!");
      onClaimSubmitted(); // Refresh the table
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <ClipboardList className="text-slate-400" size={24} />
        New Insurance Claim
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Policy Number</label>
          <input 
            type="text" 
            placeholder="POL-12345"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Claimant Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, claimantName: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Claim Amount ($)</label>
          <input 
            type="number" 
            placeholder="5000"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, claimAmount: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Incident Date</label>
          <input 
            type="date" 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          className="md:col-span-2 mt-4 bg-slate-900 text-white p-4 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} /> Submit for Analysis
        </button>
      </form>
    </div>
  );
};

export default ClaimForm;