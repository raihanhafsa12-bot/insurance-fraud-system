import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClaimForm from './components/ClaimForm';
import ClaimTable from './components/ClaimTable';
import { ShieldCheck } from 'lucide-react';

function App() {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/claims/all');
      setClaims(response.data);
    } catch (err) {
      console.error("Error fetching claims", err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Guardian AI</h1>
        </div>
        <div className="text-sm text-slate-500 font-medium">Fraud Detection Dashboard</div>
      </header>

      <main className="max-w-6xl mx-auto">
        <ClaimForm onClaimSubmitted={fetchClaims} />
        <ClaimTable claims={claims} />
      </main>
    </div>
  );
}

export default App;