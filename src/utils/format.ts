import type { VehicleClass } from '../store/types';

export const formatWon = (value: number) => `${Math.round(value).toLocaleString('ko-KR')}원`;

export const vehicleClassLabel: Record<VehicleClass, string> = {
  compact: '준중형까지',
  sedan: '중형 세단까지',
  suv: 'SUV까지',
  largeSuv: '대형 SUV까지',
};

export const vehicleClassShort: Record<VehicleClass, string> = {
  compact: '준중형',
  sedan: '중형',
  suv: 'SUV',
  largeSuv: '대형 SUV',
};

export const vehicleClassOrder: VehicleClass[] = ['compact', 'sedan', 'suv', 'largeSuv'];

export function relativeTime(from: number, now = Date.now()): string {
  const diff = Math.max(0, now - from);
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
}

export function startLabelFromNow(offsetHours = 0, now = new Date()): string {
  const start = new Date(now.getTime() + offsetHours * 3600_000);
  const rounded = new Date(start);
  rounded.setMinutes(start.getMinutes() >= 30 ? 30 : 0, 0, 0);
  const h = rounded.getHours();
  const m = rounded.getMinutes();
  const period = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const daylabel = offsetHours < 12 ? '오늘' : '오늘';
  return `${daylabel} ${period} ${h12}:${m === 0 ? '00' : '30'}`;
}
