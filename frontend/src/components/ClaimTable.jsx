import React from 'react';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

const ClaimTable = ({ claims }) => {
  const getStatusDisplay = (claim) => {
    if (claim.isFlagged || claim.status === 'Under Review') {
      return (
        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          <ShieldAlert size={16} /> Under Review
        </span>
      );
    }
    if (claim.status === 'Approved') {
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <CheckCircle size={16} /> Approved
        </span>
      );
    }
    if (claim.status === 'Rejected') {
      return (
        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full">
          <AlertTriangle size={16} /> Rejected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
        <Clock size={16} /> {claim.status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-4 font-semibold text-slate-600 text-sm">Policy</th>
            <th className="p-4 font-semibold text-slate-600 text-sm">Claimant</th>
            <th className="p-4 font-semibold text-slate-600 text-sm">Amount</th>
            <th className="p-4 font-semibold text-slate-600 text-sm">Fraud Score</th>
            <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {claims.map((claim) => (
            <tr key={claim._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-sm font-medium">{claim.policyNumber}</td>
              <td className="p-4 text-sm text-slate-600">{claim.claimantName}</td>
              <td className="p-4 text-sm font-semibold">${Number(claim.claimAmount).toLocaleString()}</td>
              <td className="p-4 text-sm">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  claim.fraudScore > 0.5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {(claim.fraudScore * 100).toFixed(0)}%
                </span>
              </td>
              <td className="p-4 text-sm">
                {getStatusDisplay(claim)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimTable;