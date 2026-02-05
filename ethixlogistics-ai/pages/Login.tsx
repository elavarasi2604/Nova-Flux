
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAppStore();

  const handleLogin = (role: UserRole) => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    login(email, role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Log in to EthixLogistics Platform</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. logistics@flipkart.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleLogin(UserRole.CUSTOMER)}
              className="bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex flex-col items-center gap-1 shadow-lg shadow-blue-200"
            >
              <span className="text-lg">Shop</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest">Customer View</span>
            </button>
            <button 
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex flex-col items-center gap-1 shadow-lg shadow-slate-300"
            >
              <span className="text-lg">Manage</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest">Admin View</span>
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-xs text-blue-700 leading-relaxed text-center">
            EthixLogistics AI evaluates shipments independently using a deterministic priority engine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
