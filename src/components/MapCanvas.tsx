import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadow } from '../theme';
import type { Space } from '../types';
import { formatWon } from '../data';

type MapCanvasProps = {
  spaces: Space[];
  selectedId: string;
  onSelect: (space: Space) => void;
  tall?: boolean;
};

export function MapCanvas({ spaces, selectedId, onSelect, tall = false }: MapCanvasProps) {
  return (
    <View style={[styles.map, tall && styles.tallMap]} accessibilityLabel="성수동 주차공간 지도">
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View style={[styles.block, { left: '5%', top: '7%', width: '26%', height: '20%' }]} />
      <View style={[styles.block, { left: '38%', top: '8%', width: '24%', height: '18%' }]} />
      <View style={[styles.park, { right: '4%', top: '8%', width: '25%', height: '28%' }]}>
        <MaterialCommunityIcons name="tree" size={26} color="#6CAA7C" />
      </View>
      <View style={[styles.block, { left: '9%', bottom: '8%', width: '29%', height: '25%' }]} />
      <View style={[styles.block, { right: '8%', bottom: '8%', width: '32%', height: '22%' }]} />
      <Text style={[styles.mapLabel, { left: '39%', top: '40%' }]}>성수이로</Text>
      <Text style={[styles.mapLabel, { left: '8%', bottom: '38%' }]}>서울숲길</Text>

      {spaces.map((space) => {
        const selected = space.id === selectedId;
        return (
          <Pressable
            key={space.id}
            onPress={() => onSelect(space)}
            accessibilityRole="button"
            accessibilityLabel={`${space.title}, 시간당 ${formatWon(space.price)}`}
            style={[
              styles.marker,
              { left: `${space.x}%`, top: `${space.y}%` },
              selected && styles.selectedMarker,
            ]}
          >
            <Text style={[styles.markerText, selected && styles.selectedMarkerText]}>
              {Math.round(space.price / 100) / 10}천
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.currentLocation}>
        <View style={styles.currentDot} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="현재 위치로 이동" onPress={() => spaces[0] && onSelect(spaces[0])} style={styles.locationButton}>
        <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 286,
    overflow: 'hidden',
    borderRadius: radii.lg,
    backgroundColor: '#EEF1F4',
    borderWidth: 1,
    borderColor: '#E0E5EA',
    position: 'relative',
  },
  tallMap: { height: 430, borderRadius: 0, borderLeftWidth: 0, borderRightWidth: 0 },
  road: { position: 'absolute', backgroundColor: '#FFFFFF', borderColor: '#D8DDE3', borderWidth: 1 },
  roadOne: { width: '120%', height: 55, left: '-8%', top: '35%', transform: [{ rotate: '-8deg' }] },
  roadTwo: { width: 62, height: '130%', left: '43%', top: '-15%', transform: [{ rotate: '9deg' }] },
  roadThree: { width: '75%', height: 48, left: '-5%', bottom: '20%', transform: [{ rotate: '18deg' }] },
  block: { position: 'absolute', backgroundColor: '#E1E5E9', borderRadius: 7, borderWidth: 1, borderColor: '#D5DAE0' },
  park: { position: 'absolute', borderRadius: 8, backgroundColor: '#DDECDD', alignItems: 'center', justifyContent: 'center' },
  mapLabel: { position: 'absolute', color: '#929AA5', fontSize: 11, fontWeight: '600', transform: [{ rotate: '-7deg' }] },
  marker: {
    position: 'absolute',
    minWidth: 55,
    height: 38,
    marginLeft: -28,
    marginTop: -20,
    borderRadius: 13,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  selectedMarker: { backgroundColor: colors.blue, borderColor: colors.blue, transform: [{ scale: 1.08 }] },
  markerText: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  selectedMarkerText: { color: colors.surface },
  currentLocation: {
    position: 'absolute',
    left: '46%',
    top: '55%',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: 'rgba(23,105,246,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.blue, borderWidth: 3, borderColor: colors.surface },
  locationButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
});
