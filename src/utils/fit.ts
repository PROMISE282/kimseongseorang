import type { Space, Vehicle, VehicleClass } from '../store/types';
import { vehicleClassOrder } from './format';

/** Rough real-world footprint per vehicle class, in metres (width x length). */
const footprint: Record<VehicleClass, { width: number; length: number }> = {
  compact: { width: 1.72, length: 4.3 },
  sedan: { width: 1.86, length: 4.9 },
  suv: { width: 1.9, length: 4.75 },
  largeSuv: { width: 2.0, length: 5.15 },
};

export type FitResult = {
  score: number; // 0-100
  fits: boolean;
  widthGap: number; // metres of clearance (can be negative)
  lengthGap: number;
  summary: string;
};

/**
 * Compute how well a vehicle fits a space. Combines dimensional clearance with
 * the host's declared max class and the AI confidence for the listing.
 */
export function computeFit(space: Space, vehicle: Vehicle | null): FitResult {
  const car = footprint[vehicle?.vClass ?? 'sedan'];
  const widthGap = space.dimensions.width - car.width;
  const lengthGap = space.dimensions.length - car.length;

  const classAllowed =
    vehicleClassOrder.indexOf(vehicle?.vClass ?? 'sedan') <= vehicleClassOrder.indexOf(space.maxClass);

  // Clearance scoring: 0.35m clearance on each axis reads as "comfortable".
  const widthScore = clamp01(widthGap / 0.35);
  const lengthScore = clamp01(lengthGap / 0.6);
  const dimScore = widthScore * 0.6 + lengthScore * 0.4;

  const entryPenalty = space.entryDifficulty === 'tricky' ? 0.12 : space.entryDifficulty === 'normal' ? 0.05 : 0;

  let score = (dimScore * 0.7 + (space.aiConfidence / 100) * 0.3 - entryPenalty) * 100;
  if (!classAllowed) score = Math.min(score, 46);
  score = Math.round(Math.max(8, Math.min(99, score)));

  const fits = classAllowed && widthGap > 0.06 && lengthGap > 0.1;

  const summary = !classAllowed
    ? `호스트가 ${maxClassLabel(space.maxClass)}까지 받는 공간이에요`
    : !fits
      ? '실측상 여유가 빠듯해요. 진입에 주의하세요'
      : widthGap > 0.3
        ? '폭·길이 모두 여유롭게 들어가요'
        : '표준 주차에 적합해요';

  return { score, fits, widthGap, lengthGap, summary };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function maxClassLabel(c: VehicleClass) {
  return { compact: '준중형', sedan: '중형 세단', suv: 'SUV', largeSuv: '대형 SUV' }[c];
}
