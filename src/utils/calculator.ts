import { carbonFactors } from '../data/carbonFactors';

export interface UserProfile {
  name?: string;
  country: string;
  diet: string;
  vehicleType: string;
  publicTransit: string;
  flights: string;
  homeSize: string;
  electricitySource: string;
  heating: string;
  shoppingHabits: string;
}

export interface FootprintBreakdown {
  food: number;
  travel: number;
  energy: number;
  shopping: number;
}

export interface CalculatedFootprint {
  total: number;
  breakdown: FootprintBreakdown;
}

export function calculateFootprint(profile: UserProfile): CalculatedFootprint {
  const foodEmissions = carbonFactors.diet[profile.diet] || 2.5;

  const vehicleEmissions = carbonFactors.transport.vehicleType[profile.vehicleType] || 0;
  const transitEmissions = carbonFactors.transport.publicTransit[profile.publicTransit] || 0;
  const flightEmissions = carbonFactors.transport.flights[profile.flights] || 0;
  const travelTotal = vehicleEmissions + transitEmissions + flightEmissions;

  const sizeFactor = carbonFactors.energy.homeSize[profile.homeSize] || 1.6;
  const electricityFactor = carbonFactors.energy.electricitySource[profile.electricitySource] || 1.8;
  
  // High fidelity location adjustment: warm climates like India require very little space heating (scaled down by 90%)
  const isWarmClimate = profile.country === 'india';
  const heatingModifier = isWarmClimate ? 0.1 : 1.0;
  const heatingFactor = (carbonFactors.energy.heating[profile.heating] || 1.0) * heatingModifier;
  
  const energyTotal = sizeFactor * (electricityFactor * 0.4 + heatingFactor * 0.6);

  // Approximation for average indirect emissions from shopping and consumption habits
  const shoppingTotal = profile.shoppingHabits === 'minimalist' ? 0.8 : profile.shoppingHabits === 'average' ? 1.5 : 2.5;

  const total = parseFloat((foodEmissions + travelTotal + energyTotal + shoppingTotal).toFixed(2));

  return {
    total,
    breakdown: {
      food: parseFloat(foodEmissions.toFixed(2)),
      travel: parseFloat(travelTotal.toFixed(2)),
      energy: parseFloat(energyTotal.toFixed(2)),
      shopping: parseFloat(shoppingTotal.toFixed(2))
    }
  };
}
