import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';

import type { Space } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { formatWon } from '../utils/format';

type MapCanvasProps = {
  spaces: Space[];
  selectedId: string | undefined;
  onSelect: (space: Space) => void;
  onRecenter?: () => void;
  tall?: boolean;
};

const shortPrice = (won: number) => `${Math.round(won / 100) / 10}천`;

export function MapCanvas({ spaces, selectedId, onSelect, onRecenter, tall = false }: MapCanvasProps) {
  const { colors, radii, shadow } = useTheme();

  return (
    <View
      style={[
        styles.map,
        { backgroundColor: colors.mapBase, borderColor: colors.line, borderRadius: radii.lg },
        tall && styles.tallMap,
      ]}
      accessibilityLabel="성동구 주차공간 지도"
    >
      {[styles.roadOne, styles.roadTwo, styles.roadThree].map((road, i) => (
        <View key={i} style={[styles.road, road, { backgroundColor: colors.mapRoad, borderColor: colors.line }]} />
      ))}
      <View style={[styles.block, { backgroundColor: colors.mapBlock, left: '5%', top: '7%', width: '26%', height: '20%' }]} />
      <View style={[styles.block, { backgroundColor: colors.mapBlock, left: '38%', top: '8%', width: '24%', height: '18%' }]} />
      <View style={[styles.park, { backgroundColor: colors.greenSoft, right: '4%', top: '8%', width: '25%', height: '28%' }]}>
        <MaterialCommunityIcons name="tree" size={24} color={colors.green} />
      </View>
      <View style={[styles.block, { backgroundColor: colors.mapBlock, left: '9%', bottom: '8%', width: '29%', height: '25%' }]} />
      <View style={[styles.block, { backgroundColor: colors.mapBlock, right: '8%', bottom: '8%', width: '32%', height: '22%' }]} />

      {spaces.map((space) => {
        const selected = space.id === selectedId;
        return (
          <Pressable
            key={space.id}
            onPress={() => onSelect(space)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${space.title}, 시간당 ${formatWon(space.price)}`}
            style={[
              styles.marker,
              {
                left: `${space.x}%`,
                top: `${space.y}%`,
                backgroundColor: selected ? colors.blue : colors.surface,
                borderColor: selected ? colors.blue : colors.ink,
                zIndex: selected ? 5 : 1,
              },
              shadow,
              selected && styles.selectedMarker,
            ]}
          >
            <Text style={[styles.markerText, { color: selected ? colors.onAccent : colors.ink }]}>
              {shortPrice(space.price)}
            </Text>
          </Pressable>
        );
      })}

      <View style={[styles.currentLocation, { backgroundColor: `${colors.blue}2A` }]}>
        <View style={[styles.currentDot, { backgroundColor: colors.blue, borderColor: colors.surface }]} />
      </View>

      {onRecenter && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="가까운 공간 보기"
          onPress={onRecenter}
          style={[styles.locationButton, shadow, { backgroundColor: colors.surface }]}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={21} color={colors.ink} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 286, overflow: 'hidden', borderWidth: 1, position: 'relative' },
  tallMap: { flex: 1, borderRadius: 0, borderLeftWidth: 0, borderRightWidth: 0 },
  road: { position: 'absolute', borderWidth: 1 },
  roadOne: { width: '120%', height: 55, left: '-8%', top: '35%', transform: [{ rotate: '-8deg' }] },
  roadTwo: { width: 62, height: '130%', left: '43%', top: '-15%', transform: [{ rotate: '9deg' }] },
  roadThree: { width: '75%', height: 48, left: '-5%', bottom: '20%', transform: [{ rotate: '18deg' }] },
  block: { position: 'absolute', borderRadius: 7 },
  park: { position: 'absolute', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  marker: {
    position: 'absolute',
    minWidth: 52,
    height: 36,
    marginLeft: -26,
    marginTop: -18,
    borderRadius: 13,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarker: { transform: [{ scale: 1.1 }] },
  markerText: { fontSize: 13, fontWeight: '900' },
  currentLocation: {
    position: 'absolute',
    left: '46%',
    top: '55%',
    width: 46,
    height: 46,
    marginLeft: -23,
    marginTop: -23,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: { width: 13, height: 13, borderRadius: 7, borderWidth: 3 },
  locationButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
