import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePendingReceivedCount } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import type { TabParamList } from './types';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const meta: Record<keyof TabParamList, { label: string; icon: IconName; activeIcon: IconName }> = {
  Home: { label: '홈', icon: 'home-outline', activeIcon: 'home' },
  Map: { label: '지도', icon: 'map-marker-outline', activeIcon: 'map-marker' },
  Register: { label: '공간 등록', icon: 'camera-plus-outline', activeIcon: 'camera-plus' },
  Requests: { label: '승인', icon: 'check-circle-outline', activeIcon: 'check-circle' },
  My: { label: 'MY', icon: 'account-outline', activeIcon: 'account' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const pending = usePendingReceivedCount();

  return (
    <View
      style={[
        styles.nav,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const key = route.name as keyof TabParamList;
        const info = meta[key];
        if (!info) return null;
        const focused = state.index === index;
        const isRegister = key === 'Register';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={info.label}
            onPress={onPress}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
          >
            <View
              style={[
                styles.iconWrap,
                isRegister && [styles.registerIcon, shadow, { backgroundColor: colors.blue, borderColor: colors.surface }],
                focused && !isRegister && { backgroundColor: colors.blueSoft },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? info.activeIcon : info.icon}
                size={isRegister ? 24 : 22}
                color={isRegister ? colors.onAccent : focused ? colors.blue : colors.subtle}
              />
              {key === 'Requests' && pending > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.surface }]}>
                  <Text style={styles.badgeText}>{pending}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: focused ? colors.blue : colors.subtle },
                focused && { fontWeight: '900' },
                isRegister && { color: colors.ink, marginTop: -3 },
              ]}
            >
              {info.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconWrap: {
    width: 38,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  registerIcon: { width: 48, height: 48, marginTop: -20, borderRadius: 24, borderWidth: 4 },
  label: { fontSize: 11, fontWeight: '700' },
  badge: {
    position: 'absolute',
    right: -2,
    top: -4,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
});
