export type VehicleClass = 'compact' | 'sedan' | 'suv' | 'largeSuv';

export type Vehicle = {
  id: string;
  plate: string;
  name: string;
  vClass: VehicleClass;
  primary: boolean;
};

export type SpaceDimensions = {
  width: number; // metres
  length: number; // metres
};

export type Space = {
  id: string;
  title: string;
  area: string;
  address: string; // revealed after approval in a real service
  walk: string;
  price: number; // per hour, KRW
  rating: number;
  reviews: number;
  responseTime: string;
  instant: boolean;
  maxClass: VehicleClass;
  dimensions: SpaceDimensions;
  aiConfidence: number; // 0-100
  entryDifficulty: 'easy' | 'normal' | 'tricky';
  entryNote: string;
  features: string[];
  available: string;
  availableFromNow: boolean;
  x: number; // map position %
  y: number;
  host: {
    name: string;
    initial: string;
    approvalRate: number;
    verified: boolean;
  };
  ownedByMe: boolean;
  listed: boolean; // visible in browse (false while under review)
};

export type RequestSide = 'sent' | 'received';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export type ParkingRequest = {
  id: string;
  side: RequestSide;
  spaceId: string;
  spaceTitle: string;
  createdAt: number;
  startLabel: string;
  durationHours: number;
  price: number; // total
  vehiclePlate: string;
  vehicleName: string;
  fitScore: number;
  status: RequestStatus;
  guest?: { name: string; initial: string; rating: number; trips: number; reports: number };
};

export type AppNotification = {
  id: string;
  kind: 'request' | 'approved' | 'rejected' | 'system' | 'listing';
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
};

export type State = {
  hydrated: boolean;
  firstRun: boolean;
  spaces: Space[];
  favorites: string[];
  vehicles: Vehicle[];
  requests: ParkingRequest[];
  notifications: AppNotification[];
  recentSearches: string[];
};

export type Action =
  | { type: 'hydrate'; payload: Partial<State> }
  | { type: 'completeOnboarding' }
  | { type: 'toggleFavorite'; spaceId: string }
  | { type: 'addVehicle'; vehicle: Vehicle }
  | { type: 'removeVehicle'; id: string }
  | { type: 'setPrimaryVehicle'; id: string }
  | { type: 'addSpace'; space: Space }
  | { type: 'toggleListing'; spaceId: string }
  | { type: 'sendRequest'; request: ParkingRequest }
  | { type: 'resolveRequest'; id: string; status: RequestStatus }
  | { type: 'addNotification'; notification: AppNotification }
  | { type: 'markNotificationsRead' }
  | { type: 'pushRecentSearch'; term: string };
