export type TabKey = 'home' | 'map' | 'register' | 'requests' | 'my';

export type Space = {
  id: string;
  title: string;
  area: string;
  walk: string;
  price: number;
  rating: number;
  reviews: number;
  fitScore: number;
  responseTime: string;
  vehicle: string;
  features: string[];
  available: string;
  x: number;
  y: number;
};

export type ApprovalStatus = 'none' | 'pending' | 'approved';
