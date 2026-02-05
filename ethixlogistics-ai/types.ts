
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum Lane {
  ETHICAL_EXPRESS = 'Ethical Express',
  FAST_BUSINESS = 'Fast Business',
  STANDARD = 'Standard'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  medicalFlag: boolean;
  prescriptionRequired: boolean;
  temperatureSensitive: boolean;
  businessValueTier: 'Low' | 'Medium' | 'High';
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
  medicalContext?: {
    intendedUse: string;
    recipientType: string;
    notes?: string;
    prescriptionId?: string;
  };
}

export interface Shipment {
  id: string;
  orderId: string;
  productId: string;
  itemName: string;
  lane: Lane;
  status: 'Processing' | 'In Transit' | 'Delivered';
  priorityScore: number;
  medicalUrgency: number;
  ethicalRisk: number;
  businessValue: number;
  timeSensitivity: number;
  delayRisk: number;
  coords: [number, number];
  aiExplanation?: string;
  isAiFallback: boolean;
  timestamp: string;
  profitImpact: number;
  slackUsed: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: string;
  shipments: Shipment[];
}

export interface Hub {
  id: string;
  name: string;
  coords: [number, number];
}

export interface AIAdvisorResult {
  medicalUrgency: number;
  timeSensitivity: number;
  ethicalRisk: number;
  businessRelevance: number;
  explanation: string;
  isFallback: boolean;
}
