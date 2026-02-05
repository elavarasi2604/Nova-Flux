
import { Lane, AIAdvisorResult, CartItem } from "../types";
// Corrected import: WEIGHTS is defined in constants.ts
import { WEIGHTS } from "../constants";

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function determineLane(score: number): Lane {
  if (score >= 0.7) return Lane.ETHICAL_EXPRESS;
  if (score >= 0.4) return Lane.FAST_BUSINESS;
  return Lane.STANDARD;
}

export function calculatePriorityScore(advisor: AIAdvisorResult, delayRisk: number): number {
  const { medicalUrgency, timeSensitivity, ethicalRisk, businessRelevance } = advisor;

  if (medicalUrgency > 0.3) {
    return (
      WEIGHTS.MEDICAL_CASE.URGENCY_TIME * (medicalUrgency * timeSensitivity) +
      WEIGHTS.MEDICAL_CASE.DELAY_RISK * delayRisk +
      WEIGHTS.MEDICAL_CASE.ETHICAL_RISK * ethicalRisk +
      WEIGHTS.MEDICAL_CASE.BUSINESS_VALUE * businessRelevance
    );
  } else {
    return (
      WEIGHTS.STANDARD_CASE.BUSINESS_VALUE * businessRelevance +
      WEIGHTS.STANDARD_CASE.DELAY_RISK * delayRisk +
      WEIGHTS.STANDARD_CASE.TIME_SENSITIVITY * timeSensitivity +
      WEIGHTS.STANDARD_CASE.ETHICAL_RISK * ethicalRisk
    );
  }
}
