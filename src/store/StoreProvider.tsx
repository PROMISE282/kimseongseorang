import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { seedNotifications, seedRequests, seedSpaces, seedVehicles } from './seed';
import type { Action, AppNotification, ParkingRequest, State, Vehicle } from './types';

const STORAGE_KEY = 'juchamowa.store.v1';

const initialState: State = {
  hydrated: false,
  firstRun: true,
  spaces: seedSpaces,
  favorites: [],
  vehicles: seedVehicles,
  requests: seedRequests,
  notifications: seedNotifications,
  recentSearches: [],
};

/** Only these slices are persisted; seed content is merged back on load. */
type Persisted = Pick<
  State,
  'firstRun' | 'favorites' | 'vehicles' | 'requests' | 'notifications' | 'recentSearches'
> & { customSpaces: State['spaces'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true };

    case 'completeOnboarding':
      return { ...state, firstRun: false };

    case 'toggleFavorite': {
      const has = state.favorites.includes(action.spaceId);
      return {
        ...state,
        favorites: has
          ? state.favorites.filter((id) => id !== action.spaceId)
          : [action.spaceId, ...state.favorites],
      };
    }

    case 'addVehicle': {
      const vehicles = action.vehicle.primary
        ? [action.vehicle, ...state.vehicles.map((v) => ({ ...v, primary: false }))]
        : [...state.vehicles, action.vehicle];
      return { ...state, vehicles: ensurePrimary(vehicles) };
    }

    case 'removeVehicle':
      return { ...state, vehicles: ensurePrimary(state.vehicles.filter((v) => v.id !== action.id)) };

    case 'setPrimaryVehicle':
      return {
        ...state,
        vehicles: state.vehicles.map((v) => ({ ...v, primary: v.id === action.id })),
      };

    case 'addSpace':
      return { ...state, spaces: [action.space, ...state.spaces] };

    case 'toggleListing':
      return {
        ...state,
        spaces: state.spaces.map((s) =>
          s.id === action.spaceId ? { ...s, listed: !s.listed } : s,
        ),
      };

    case 'sendRequest':
      return { ...state, requests: [action.request, ...state.requests] };

    case 'resolveRequest':
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.id ? { ...r, status: action.status } : r,
        ),
      };

    case 'addNotification':
      return { ...state, notifications: [action.notification, ...state.notifications] };

    case 'markNotificationsRead':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };

    case 'pushRecentSearch': {
      const term = action.term.trim();
      if (!term) return state;
      return {
        ...state,
        recentSearches: [term, ...state.recentSearches.filter((t) => t !== term)].slice(0, 6),
      };
    }

    default:
      return state;
  }
}

function ensurePrimary(vehicles: Vehicle[]): Vehicle[] {
  if (vehicles.length === 0) return vehicles;
  if (vehicles.some((v) => v.primary)) return vehicles;
  return vehicles.map((v, i) => ({ ...v, primary: i === 0 }));
}

type StoreValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) {
          dispatch({ type: 'hydrate', payload: {} });
          return;
        }
        const saved = JSON.parse(raw) as Partial<Persisted>;
        const customSpaces = (saved.customSpaces ?? []).filter(
          (s) => !seedSpaces.some((seed) => seed.id === s.id),
        );
        dispatch({
          type: 'hydrate',
          payload: {
            firstRun: saved.firstRun ?? true,
            favorites: saved.favorites ?? [],
            vehicles: saved.vehicles?.length ? saved.vehicles : seedVehicles,
            requests: mergeRequests(saved.requests),
            notifications: saved.notifications ?? seedNotifications,
            recentSearches: saved.recentSearches ?? [],
            spaces: [...customSpaces, ...seedSpaces],
          },
        });
      })
      .catch(() => dispatch({ type: 'hydrate', payload: {} }))
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  useEffect(() => {
    if (!state.hydrated || !loaded.current) return;
    const persisted: Persisted = {
      firstRun: state.firstRun,
      favorites: state.favorites,
      vehicles: state.vehicles,
      requests: state.requests,
      notifications: state.notifications.slice(0, 40),
      recentSearches: state.recentSearches,
      customSpaces: state.spaces.filter((s) => !seedSpaces.some((seed) => seed.id === s.id)),
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)).catch(() => undefined);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function mergeRequests(saved?: ParkingRequest[]): ParkingRequest[] {
  if (!saved) return seedRequests;
  const seedKept = seedRequests.filter((seed) => !saved.some((r) => r.id === seed.id));
  return [...saved, ...seedKept];
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ---- Selectors / helpers -------------------------------------------------

export function useSpaces() {
  return useStore().state.spaces;
}

export function useSpace(id: string | undefined) {
  const spaces = useSpaces();
  return spaces.find((s) => s.id === id);
}

export function usePrimaryVehicle(): Vehicle | null {
  const { vehicles } = useStore().state;
  return vehicles.find((v) => v.primary) ?? vehicles[0] ?? null;
}

export function useUnreadCount(): number {
  return useStore().state.notifications.filter((n) => !n.read).length;
}

export function usePendingReceivedCount(): number {
  return useStore().state.requests.filter((r) => r.side === 'received' && r.status === 'pending')
    .length;
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function notify(
  dispatch: React.Dispatch<Action>,
  n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>,
) {
  dispatch({
    type: 'addNotification',
    notification: { ...n, id: makeId('noti'), createdAt: Date.now(), read: false },
  });
}
