
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { evaluateContext } from '../../services/geminiService';
import { calculatePriorityScore, determineLane, calculateHaversineDistance } from '../../services/routingEngine';
import { HUBS } from '../../constants';
import { Order, Shipment, UserRole } from '../../types';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartItem, createOrder, clearCart, user } = useAppStore();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) return;
    setCheckingOut(true);

    try {
      const shipments: Shipment[] = [];
      const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      for (const item of cart) {
        // Evaluate with AI Advisor or Fallback Heuristic
        const advisor = await evaluateContext(item);
        
        // Mock random delivery coordinates in TN (bounds roughly 8N-14N, 76E-80E)
        const coords: [number, number] = [
          8.5 + Math.random() * 5.5,
          76.5 + Math.random() * 3.5
        ];

        // Find nearest hub for distance risk
        const hub = HUBS[0]; // Simplification for MVP
        const distance = calculateHaversineDistance(hub.coords[0], hub.coords[1], coords[0], coords[1]);
        const delayRisk = Math.min(distance / 500, 1.0); // Simple risk metric

        const score = calculatePriorityScore(advisor, delayRisk);
        const lane = determineLane(score);

        shipments.push({
          id: 'SHP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          orderId,
          productId: item.id,
          itemName: item.name,
          lane,
          status: 'Processing',
          priorityScore: score,
          medicalUrgency: advisor.medicalUrgency,
          ethicalRisk: advisor.ethicalRisk,
          businessValue: advisor.businessRelevance,
          timeSensitivity: advisor.timeSensitivity,
          delayRisk,
          coords,
          aiExplanation: advisor.explanation,
          isAiFallback: advisor.isFallback,
          timestamp: new Date().toISOString(),
          profitImpact: lane === 'Ethical Express' ? 200 : 0, // Mock impact
          slackUsed: lane === 'Ethical Express'
        });
      }

      const order: Order = {
        id: orderId,
        customerId: user.id,
        items: [...cart],
        totalPrice: cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
        timestamp: new Date().toISOString(),
        shipments
      };

      createOrder(order);
      clearCart();
      navigate('/customer/orders');
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-10">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <button onClick={() => navigate('/customer')} className="mt-4 text-blue-600 font-bold hover:underline">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Review Order</h2>
      
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                <span className="font-bold text-slate-900">₹{item.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{item.category}</p>
              
              {item.medicalFlag && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Medical Compliance Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      className="bg-white border border-blue-200 rounded-lg p-2 text-sm outline-none"
                      onChange={(e) => updateCartItem(item.id, { medicalContext: { ...item.medicalContext!, intendedUse: e.target.value, recipientType: item.medicalContext?.recipientType || 'Patient' }})}
                    >
                      <option value="">Intended Use</option>
                      <option value="emergency">Emergency Relief</option>
                      <option value="chronic">Chronic Care</option>
                      <option value="surgical">Post-Surgical</option>
                    </select>
                    <select 
                      className="bg-white border border-blue-200 rounded-lg p-2 text-sm outline-none"
                      onChange={(e) => updateCartItem(item.id, { medicalContext: { ...item.medicalContext!, recipientType: e.target.value, intendedUse: item.medicalContext?.intendedUse || 'Relief' }})}
                    >
                      <option value="">Recipient</option>
                      <option value="Patient">Direct Patient</option>
                      <option value="Hospital">Hospital Supply</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Recipient details or urgency notes (Optional)"
                    className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm outline-none resize-none h-20"
                    onChange={(e) => updateCartItem(item.id, { medicalContext: { ...item.medicalContext!, notes: e.target.value, intendedUse: item.medicalContext?.intendedUse || 'Relief', recipientType: item.medicalContext?.recipientType || 'Patient' }})}
                  />
                  <p className="text-[10px] text-blue-400 italic">Collected for compliance only. NOT analyzed by AI.</p>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-end">
              <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 font-medium hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400 font-medium">Order Total</span>
          <span className="text-2xl font-black">₹{cart.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</span>
        </div>
        <button 
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 disabled:opacity-50"
        >
          {checkingOut ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Optimising Routes...
            </>
          ) : (
            'Confirm & Split Shipments'
          )}
        </button>
      </div>
    </div>
  );
};

export default Cart;
