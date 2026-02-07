// GateZero Mobile - Root Layout
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0B' }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A0A0B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0A0A0B',
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="scan" 
          options={{ 
            title: 'Scan Vehicle',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="vehicle/[id]" 
          options={{ 
            title: 'Vehicle Details',
          }} 
        />
      </Stack>
    </View>
  );
}
