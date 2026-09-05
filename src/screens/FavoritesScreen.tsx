import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { SpaceCard } from '../components/SpaceCard';
import { useSpaces, useStore } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const spaces = useSpaces();
  const { state } = useStore();

  const favorites = state.favorites
    .map((id) => spaces.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="찜한 공간이 없어요"
          body="마음에 드는 공간의 하트를 눌러 저장해두세요."
        />
      ) : (
        favorites.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onPress={() => navigation.navigate('SpaceDetail', { spaceId: space.id })}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14 },
});
