
import { Product, Hub } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Insulin (Vial)',
    price: 450,
    category: 'Medicines',
    medicalFlag: true,
    prescriptionRequired: true,
    temperatureSensitive: true,
    businessValueTier: 'Medium',
    imageUrl: 'https://picsum.photos/seed/insulin/300/300'
  },
  {
    id: 'p2',
    name: 'MacBook Pro M3',
    price: 154900,
    category: 'Electronics',
    medicalFlag: false,
    prescriptionRequired: false,
    temperatureSensitive: false,
    businessValueTier: 'High',
    imageUrl: 'https://picsum.photos/seed/macbook/300/300'
  },
  {
    id: 'p3',
    name: 'Life-saving Antibiotics',
    price: 1200,
    category: 'Medicines',
    medicalFlag: true,
    prescriptionRequired: true,
    temperatureSensitive: false,
    businessValueTier: 'Medium',
    imageUrl: 'https://picsum.photos/seed/medicine/300/300'
  },
  {
    id: 'p4',
    name: 'Aashirvaad Atta (5kg)',
    price: 380,
    category: 'Essentials',
    medicalFlag: false,
    prescriptionRequired: false,
    temperatureSensitive: false,
    businessValueTier: 'Low',
    imageUrl: 'https://picsum.photos/seed/atta/300/300'
  },
  {
    id: 'p5',
    name: 'Blood Pressure Monitor',
    price: 2400,
    category: 'Medicines',
    medicalFlag: true,
    prescriptionRequired: false,
    temperatureSensitive: false,
    businessValueTier: 'Medium',
    imageUrl: 'https://picsum.photos/seed/bp/300/300'
  },
  {
    id: 'p6',
    name: 'iPhone 15 Pro',
    price: 129900,
    category: 'Electronics',
    medicalFlag: false,
    prescriptionRequired: false,
    temperatureSensitive: false,
    businessValueTier: 'High',
    imageUrl: 'https://picsum.photos/seed/iphone/300/300'
  }
];

export const HUBS: Hub[] = [
  { id: 'h1', name: 'Chennai Central Hub', coords: [13.0827, 80.2707] },
  { id: 'h2', name: 'Madurai Logistics Park', coords: [9.9252, 78.1198] },
  { id: 'h3', name: 'Coimbatore Distribution Center', coords: [11.0168, 76.9558] }
];

export const WEIGHTS = {
  MEDICAL_CASE: {
    URGENCY_TIME: 0.40,
    DELAY_RISK: 0.30,
    ETHICAL_RISK: 0.20,
    BUSINESS_VALUE: 0.10
  },
  STANDARD_CASE: {
    BUSINESS_VALUE: 0.50,
    DELAY_RISK: 0.25,
    TIME_SENSITIVITY: 0.15,
    ETHICAL_RISK: 0.10
  }
};
