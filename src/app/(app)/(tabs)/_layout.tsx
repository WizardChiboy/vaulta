import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/layout/TabBar';
import { useTheme } from '@/components/layout/ThemeProvider';

/** Home · Transfer · Savings · Profile. Home (08) and Transfer (16) are built; TabBar shows all four. */
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transfer" options={{ title: 'Transfer' }} />
    </Tabs>
  );
}
