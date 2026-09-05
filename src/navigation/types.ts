import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Map: { focusSpaceId?: string } | undefined;
  Register: undefined;
  Requests: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  SpaceDetail: { spaceId: string };
  Booking: { spaceId: string };
  Notifications: undefined;
  Favorites: undefined;
  Vehicles: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
