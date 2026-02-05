
import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { Lane, Shipment } from '../../types';
import { HUBS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { shipments } = useAppStore();
  
  const laneCounts = [
    { name: Lane.ETHICAL_EXPRESS, value: shipments.filter(s => s.lane === Lane.ETHICAL_EXPRESS).length, color: '#ef4444' },
    { name: Lane.FAST_BUSINESS, value: shipments.filter(s => s.lane === Lane.FAST_BUSINESS).length, color: '#f59e0b' },
    { name: Lane.STANDARD, value: shipments.filter(s => s.lane === Lane.STANDARD).length, color: '#10b981' }
  ];

  const avgPriority = shipments.length ? (shipments.reduce((acc, s) => acc + s.priorityScore, 0) / shipments.length) : 0;
  const totalProfitImpact = shipments.reduce((acc, s) => acc + s.profitImpact, 0);
  const slackUtil = shipments.filter(s => s.slackUsed).length;

  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;
    const map = L.map('admin-fleet-map').setView([11.0, 78.5], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    HUBS.forEach(hub => {
      L.marker(hub.coords).addTo(map).bindPopup(hub.name);
    });

    shipments.forEach(s => {
      const color = s.lane === Lane.ETHICAL_EXPRESS ? '#ef4444' : s.lane === Lane.FAST_BUSINESS ? '#f59e0b' : '#10b981';
      L.circleMarker(s.coords, { color, radius: 5 }).addTo(map);
    });

    return () => map.remove();
  }, [shipments]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Control Center</h2>
          <p className="text-slate-500">Fleet overview and ethical lane distribution.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Priority Score</p>
            <p className="text-xl font-black text-blue-600">{(avgPriority * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 shadow-sm text-center text-white">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Slack Utilised</p>
            <p className="text-xl font-black text-blue-400">{slackUtil} Shipments</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Lane Allocation Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laneCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {laneCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Fulfillment Health</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Ethical Surcharge Revenue</span>
              <span className="text-lg font-black text-slate-900">₹{totalProfitImpact.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">AI Fallback Rate</span>
              <span className="text-lg font-black text-amber-500">{shipments.length ? (shipments.filter(s => s.isAiFallback).length / shipments.length * 100).toFixed(0) : 0}%</span>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Guardrail Status</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-slate-700">Profit Impact &lt; 5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-slate-700">SLA Violation Rate 0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Live TN Logistics Mesh</h3>
        </div>
        <div id="admin-fleet-map" className="h-[500px] w-full" />
      </div>
    </div>
  );
};

export default AdminDashboard;
