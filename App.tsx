import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BookingSheet } from './src/components/BookingSheet';
import { BottomNav } from './src/components/BottomNav';
import { spaces } from './src/data';
import { HomeScreen } from './src/screens/HomeScreen';
import { MapScreen } from './src/screens/MapScreen';
import { MyScreen } from './src/screens/MyScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { RequestsScreen } from './src/screens/RequestsScreen';
import { SpaceDetailScreen } from './src/screens/SpaceDetailScreen';
import { colors, radii, shadow } from './src/theme';
import type { ApprovalStatus, Space, TabKey } from './src/types';

export default function App() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<TabKey>('home');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [duration, setDuration] = useState<1 | 2 | 4>(2);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('none');
  const [hostRequestStatus, setHostRequestStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const openTab = (nextTab: TabKey) => {
    setSelectedSpace(null);
    setBookingOpen(false);
    setTab(nextTab);
  };

  const openSpace = (space: Space) => {
    setSelectedSpace(space);
    setBookingOpen(false);
  };

  const submitApproval = () => {
    setApprovalStatus('pending');
    setBookingOpen(false);
    setSelectedSpace(null);
    setTab('requests');
    setToast('호스트에게 승인 요청을 보냈어요');
  };

  const approveHostRequest = () => {
    setHostRequestStatus('approved');
    setToast('게스트 이용을 승인했어요');
  };

  const rejectHostRequest = () => {
    setHostRequestStatus('rejected');
    setToast('요청을 거절했어요 · 게스트에게 사유가 안내됩니다');
  };

  const completeRegistration = useCallback(() => {
    setTab('my');
    setToast('검수 요청이 접수됐어요');
  }, []);

  const renderScreen = () => {
    if (selectedSpace) {
      return <SpaceDetailScreen space={selectedSpace} onBack={() => setSelectedSpace(null)} onBook={() => setBookingOpen(true)} />;
    }
    switch (tab) {
      case 'map':
        return <MapScreen onOpenSpace={openSpace} />;
      case 'register':
        return <RegisterScreen onComplete={completeRegistration} />;
      case 'requests':
        return <RequestsScreen guestStatus={approvalStatus} hostRequestStatus={hostRequestStatus} onApproveHostRequest={approveHostRequest} onRejectHostRequest={rejectHostRequest} />;
      case 'my':
        return <MyScreen />;
      default:
        return <HomeScreen onOpenSpace={openSpace} onOpenTab={openTab} />;
    }
  };

  const shellWidth = Platform.OS === 'web' ? Math.min(width, 520) : width;
  const bookingSpace = selectedSpace ?? spaces[0];

  return (
    <SafeAreaProvider>
      <View style={styles.page}>
        <SafeAreaView edges={['top']} style={[styles.appShell, { width: shellWidth }]}>
          <StatusBar style="dark" />
          {renderScreen()}
          {!selectedSpace && <BottomNav active={tab} onChange={openTab} pendingCount={hostRequestStatus === 'pending' ? 1 : 0} />}
          {toast && <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
          <BookingSheet
            visible={bookingOpen}
            space={bookingSpace}
            duration={duration}
            onDurationChange={setDuration}
            onClose={() => setBookingOpen(false)}
            onConfirm={submitApproval}
          />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#E8ECF2' : colors.background, alignItems: 'center' },
  appShell: { flex: 1, backgroundColor: colors.background, overflow: 'hidden', ...(Platform.OS === 'web' ? { ...shadow, borderRadius: radii.md } : {}) },
  toast: { position: 'absolute', left: 28, right: 28, bottom: 94, minHeight: 48, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center', ...shadow },
  toastText: { color: colors.surface, fontSize: 13, fontWeight: '800', textAlign: 'center' },
});
