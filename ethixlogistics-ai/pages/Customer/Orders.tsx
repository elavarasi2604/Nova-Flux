
import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { Lane } from '../../types';

const MapView: React.FC<{ coords: [number, number]; lane: Lane }> = ({ coords, lane }) => {
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
  
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;
    const map = L.map(mapId).setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    const color = lane === Lane.ETHICAL_EXPRESS ? '#ef4444' : lane === Lane.FAST_BUSINESS ? '#f59e0b' : '#10b981';
    L.circleMarker(coords, { color, fillOpacity: 0.8, radius: 10 }).addTo(map);
    
    return () => map.remove();
  }, [coords, lane, mapId]);

  return <div id={mapId} className="h-64 w-full rounded-2xl border border-slate-100 shadow-inner mt-4" />;
};

const Orders: React.FC = () => {
  const { orders } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-black text-slate-900 mb-8">My Deliveries</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">No shipments found.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.slice().reverse().map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-sm font-bold text-slate-900">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                  <p className="text-sm font-black text-blue-600">₹{order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-8 space-y-8">
                {order.shipments.map((shipment) => (
                  <div key={shipment.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          shipment.lane === Lane.ETHICAL_EXPRESS ? 'bg-red-500' : shipment.lane === Lane.FAST_BUSINESS ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          shipment.lane === Lane.ETHICAL_EXPRESS ? 'bg-red-100 text-red-600' : shipment.lane === Lane.FAST_BUSINESS ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {shipment.lane}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs font-bold text-slate-500">{shipment.status}</span>
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-900 mb-2">{shipment.itemName}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        {shipment.aiExplanation}
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA</p>
                          <p className="text-xs font-bold text-slate-900">{shipment.lane === Lane.ETHICAL_EXPRESS ? '2-4 Hours' : 'Today, 8 PM'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                          <p className="text-xs font-bold text-slate-900">{(shipment.priorityScore * 100).toFixed(0)}%</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Distance</p>
                          <p className="text-xs font-bold text-slate-900">{(shipment.delayRisk * 500).toFixed(1)} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <MapView coords={shipment.coords} lane={shipment.lane} />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-200">
                        LIVE TRACKING ACTIVE
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
