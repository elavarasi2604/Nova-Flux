
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAppStore } from './store';
import { UserRole } from './types';
import Login from './pages/Login';
import CustomerBrowse from './pages/Customer/Browse';
import Cart from './pages/Customer/Cart';
import Orders from './pages/Customer/Orders';
import AdminDashboard from './pages/Admin/Dashboard';
import Reports from './pages/Admin/Reports';
import Simulator from './pages/Admin/Simulator';

const App: React.FC = () => {
  const { user, cart, logout } = useAppStore();

  const Header = () => (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="bg-blue-600 text-white py-1 px-4 text-[10px] sm:text-xs flex justify-between items-center overflow-hidden">
        <div className="flex gap-4">
          <p><strong>EN:</strong> Prevent harm without overreacting. Protect lives without breaking livelihoods.</p>
          <p className="hidden md:block"><strong>TA:</strong> அதிகமாக எதிர்வினையாற்றாமல் தீங்குகளைத் தடுக்கவும். வாழ்வாதாரத்தை பாதிக்காமல் உயிர்களைப் பாதுகாக்கவும்.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">ETHIX<span className="text-slate-900">LOGISTICS</span></Link>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">AI v1.2</span>
        </div>

        {user ? (
          <nav className="flex items-center gap-6">
            {user.role === UserRole.CUSTOMER ? (
              <>
                <Link to="/customer" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Shop</Link>
                <Link to="/customer/orders" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">My Orders</Link>
                <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cart.length}</span>}
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                <Link to="/admin/reports" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Reports</Link>
                <Link to="/admin/simulator" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Simulator</Link>
              </>
            )}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-700">{user.name}</span>
              <button onClick={logout} className="text-sm text-red-500 font-medium hover:text-red-700">Logout</button>
            </div>
          </nav>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md">Login</Link>
        )}
      </div>
    </header>
  );

  return (
    <HashRouter>
      <Header />
      <main className="min-h-[calc(100vh-80px)]">
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.role === UserRole.ADMIN ? "/admin" : "/customer") : "/login"} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={user?.role === UserRole.CUSTOMER ? <CustomerBrowse /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user?.role === UserRole.CUSTOMER ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/customer/orders" element={user?.role === UserRole.CUSTOMER ? <Orders /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/reports" element={user?.role === UserRole.ADMIN ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/admin/simulator" element={user?.role === UserRole.ADMIN ? <Simulator /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;
