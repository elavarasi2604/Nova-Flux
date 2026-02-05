
import React from 'react';
import { useAppStore } from '../../store';

const Reports: React.FC = () => {
  const { shipments } = useAppStore();

  const handleExportCSV = () => {
    const headers = ['OrderID', 'Item', 'Lane', 'Score', 'MedicalUrgency', 'BusinessValue', 'ProfitImpact', 'SlackUsed', 'Timestamp', 'Explanation'];
    const rows = shipments.map(s => [
      s.orderId,
      s.itemName,
      s.lane,
      s.priorityScore.toFixed(3),
      s.medicalUrgency.toFixed(2),
      s.businessValue.toFixed(2),
      s.profitImpact,
      s.slackUsed ? 'Yes' : 'No',
      s.timestamp,
      (s.aiExplanation || '').replace(/,/g, ' ')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `EthixLogistics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">System Reports</h2>
          <p className="text-slate-500">Auditable logs of every ethical routing decision.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-blue-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export CSV Report
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lane</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AI/Fallback</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shipments.slice().reverse().map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{s.orderId}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium">{s.itemName}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      s.lane === 'Ethical Express' ? 'bg-red-100 text-red-600' : s.lane === 'Fast Business' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {s.lane}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-slate-900 text-center">{(s.priorityScore * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${s.isAiFallback ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      {s.isAiFallback ? 'Fallback' : 'Gemini 3'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-400">{new Date(s.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && (
            <div className="p-10 text-center text-slate-400">No data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
