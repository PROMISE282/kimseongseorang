import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadow } from '../theme';
import type { TabKey } from '../types';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const tabs: { key: TabKey; label: string; icon: IconName; activeIcon: IconName }[] = [
  { key: 'home', label: '홈', icon: 'home-outline', activeIcon: 'home' },
  { key: 'map', label: '지도', icon: 'map-marker-outline', activeIcon: 'map-marker' },
  { key: 'register', label: '공간 등록', icon: 'camera-plus-outline', activeIcon: 'camera-plus' },
  { key: 'requests', label: '승인', icon: 'check-circle-outline', activeIcon: 'check-circle' },
  { key: 'my', label: 'MY', icon: 'account-outline', activeIcon: 'account' },
];

type BottomNavProps = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  pendingCount?: number;
};

export function BottomNav({ active, onChange, pendingCount = 0 }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      {tabs.map((tab) => {
        const selected = active === tab.key;
        const isRegister = tab.key === 'register';
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <View style={[styles.iconWrap, isRegister && styles.registerIcon, selected && !isRegister && styles.activeIconWrap]}>
              <MaterialCommunityIcons
                name={selected ? tab.activeIcon : tab.icon}
                size={isRegister ? 24 : 22}
                color={isRegister ? colors.surface : selected ? colors.blue : colors.subtle}
              />
              {tab.key === 'requests' && pendingCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{pendingCount}</Text></View>}
            </View>
            <Text style={[styles.label, selected && styles.activeLabel, isRegister && styles.registerLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 82, paddingBottom: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  item: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconWrap: { width: 38, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  activeIconWrap: { backgroundColor: colors.blueSoft },
  registerIcon: { width: 48, height: 48, marginTop: -20, borderRadius: 24, backgroundColor: colors.blue, borderWidth: 4, borderColor: colors.surface, ...shadow },
  label: { color: colors.subtle, fontSize: 11, fontWeight: '700' },
  activeLabel: { color: colors.blue, fontWeight: '900' },
  registerLabel: { color: colors.ink, marginTop: -3 },
  pressed: { opacity: 0.62 },
  badge: { position: 'absolute', right: 1, top: 0, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.surface, fontSize: 10, fontWeight: '900' },
});
