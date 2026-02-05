
import React from 'react';
import { useAppStore } from '../../store';
import { Lane } from '../../types';

const Simulator: React.FC = () => {
  const { shipments } = useAppStore();

  // Simulated Counterfactual Calculation
  // Without ethics, medical items would likely be Standard or Fast Business based on price/tier only.
  const withEthics = {
    ethicalCount: shipments.filter(s => s.lane === Lane.ETHICAL_EXPRESS).length,
    avgDelayForMedical: shipments.filter(s => s.medicalUrgency > 0.5).length ? '1.5h' : '0h',
    prExposure: 'Low / Positive',
    slaRisk: '0.2%'
  };

  const withoutEthics = {
    ethicalCount: 0,
    avgDelayForMedical: shipments.filter(s => s.medicalUrgency > 0.5).length ? '48h' : '0h',
    prExposure: shipments.filter(s => s.medicalUrgency > 0.7).length > 0 ? 'HIGH (Medical Harm Risk)' : 'Minimal',
    slaRisk: '5.4%'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Ethical Counterfactual</h2>
        <p className="text-slate-500">Quantifying the impact of our deterministic ethical guardrails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* With EthixLogistics */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-100 border-2 border-blue-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Active System</div>
          <h3 className="text-2xl font-black text-blue-600 mb-8 flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            With EthixLogistics AI
          </h3>
          
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-500 font-bold">Priority medical deliveries</span>
              <span className="text-xl font-black text-slate-900">{withEthics.ethicalCount} Items</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-500 font-bold">Avg. Critical Item Delay</span>
              <span className="text-xl font-black text-green-500">{withEthics.avgDelayForMedical}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-500 font-bold">Public Harm Potential</span>
              <span className="text-xl font-black text-blue-600">{withEthics.prExposure}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">SLA Breach Risk</span>
              <span className="text-xl font-black text-slate-900">{withEthics.slaRisk}</span>
            </div>
          </div>
        </div>

        {/* Without (Profit Only) */}
        <div className="bg-slate-50 rounded-[40px] p-10 border-2 border-slate-200">
          <h3 className="text-2xl font-black text-slate-400 mb-8 flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Pure Profit Model
          </h3>

          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-slate-400 font-bold">Priority medical deliveries</span>
              <span className="text-xl font-black text-slate-400">{withoutEthics.ethicalCount} Items</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-slate-400 font-bold">Avg. Critical Item Delay</span>
              <span className="text-xl font-black text-red-500">{withoutEthics.avgDelayForMedical}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-slate-400 font-bold">Public Harm Potential</span>
              <span className="text-xl font-black text-red-600 uppercase tracking-tighter">{withoutEthics.prExposure}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">SLA Breach Risk</span>
              <span className="text-xl font-black text-slate-600">{withoutEthics.slaRisk}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center max-w-2xl mx-auto">
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          The "Pure Profit Model" prioritizes high-tier business items (Laptops, Phones) exclusively. 
          Our deterministic engine captures "Slack Capacity" from these routes to ensure life-saving medicines 
          reach destinations without impacting core business profitability.
        </p>
      </div>
    </div>
  );
};

export default Simulator;
