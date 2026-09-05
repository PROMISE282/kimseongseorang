import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { useStore } from '../store/StoreProvider';
import type { AppNotification } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { relativeTime } from '../utils/format';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const iconFor: Record<AppNotification['kind'], { icon: IconName; tone: 'blue' | 'green' | 'danger' | 'neutral' }> = {
  request: { icon: 'inbox-arrow-down', tone: 'blue' },
  approved: { icon: 'check-circle', tone: 'green' },
  rejected: { icon: 'close-circle', tone: 'danger' },
  listing: { icon: 'home-plus', tone: 'blue' },
  system: { icon: 'information', tone: 'neutral' },
};

export function NotificationsScreen() {
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'markNotificationsRead' }), 600);
    return () => clearTimeout(t);
  }, [dispatch]);

  const toneColor = (tone: 'blue' | 'green' | 'danger' | 'neutral') =>
    tone === 'green' ? colors.green : tone === 'danger' ? colors.danger : tone === 'blue' ? colors.blue : colors.muted;
  const toneBg = (tone: 'blue' | 'green' | 'danger' | 'neutral') =>
    tone === 'green' ? colors.greenSoft : tone === 'danger' ? colors.dangerSoft : tone === 'blue' ? colors.blueSoft : colors.surfaceAlt;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {state.notifications.length === 0 ? (
        <EmptyState icon="bell-sleep-outline" title="새 알림이 없어요" body="요청과 승인 소식이 여기에 모입니다." />
      ) : (
        state.notifications.map((n) => {
          const meta = iconFor[n.kind];
          return (
            <View
              key={n.id}
              style={[
                styles.row,
                { backgroundColor: colors.surface, borderRadius: radii.md, borderColor: n.read ? 'transparent' : colors.blue },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: toneBg(meta.tone), borderRadius: radii.sm }]}>
                <MaterialCommunityIcons name={meta.icon} size={20} color={toneColor(meta.tone)} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: colors.ink }]}>{n.title}</Text>
                  <Text style={[styles.time, { color: colors.subtle }]}>{relativeTime(n.createdAt)}</Text>
                </View>
                <Text style={[styles.body, { color: colors.muted }]}>{n.body}</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 10 },
  row: { padding: 14, flexDirection: 'row', gap: 12, borderWidth: 1 },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 13, fontWeight: '900' },
  time: { fontSize: 10, fontWeight: '700' },
  body: { marginTop: 4, fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
