
import { create } from 'zustand';
import { User, UserRole, CartItem, Order, Shipment } from './types';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  shipments: Shipment[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  createOrder: (order: Order) => void;
  setShipments: (shipments: Shipment[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  cart: [],
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
  shipments: JSON.parse(localStorage.getItem('shipments') || '[]'),

  login: (email, role) => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), name: email.split('@')[0], email, role };
    set({ user: newUser });
    localStorage.setItem('user', JSON.stringify(newUser));
  },

  logout: () => {
    set({ user: null, cart: [], orders: [] });
    localStorage.removeItem('user');
    localStorage.removeItem('orders');
    localStorage.removeItem('shipments');
  },

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(i => i.id === product.id);
    if (existing) {
      return { cart: state.cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(i => i.id !== productId)
  })),

  updateCartItem: (productId, updates) => set((state) => ({
    cart: state.cart.map(i => i.id === productId ? { ...i, ...updates } : i)
  })),

  clearCart: () => set({ cart: [] }),

  createOrder: (order) => set((state) => {
    const newOrders = [...state.orders, order];
    const newShipments = [...state.shipments, ...order.shipments];
    localStorage.setItem('orders', JSON.stringify(newOrders));
    localStorage.setItem('shipments', JSON.stringify(newShipments));
    return { orders: newOrders, shipments: newShipments };
  }),

  setShipments: (shipments) => set({ shipments })
}));
