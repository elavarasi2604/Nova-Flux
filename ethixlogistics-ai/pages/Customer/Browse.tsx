
import React from 'react';
import { PRODUCTS } from '../../constants';
import { useAppStore } from '../../store';

const CustomerBrowse: React.FC = () => {
  const { addToCart } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Discover Products</h2>
          <p className="text-slate-500 mt-1">Ethical fulfillment guaranteed for essential items.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all hover-lift">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.medicalFlag && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Medical Essential
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                <span className="text-sm font-black text-blue-600">₹{product.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">{product.category}</p>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-slate-50 text-slate-900 font-bold py-3 rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerBrowse;
