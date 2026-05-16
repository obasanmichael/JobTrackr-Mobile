import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationRoot } from './src/navigation';
import { ThemeProvider } from './src/theme';
import { useAuthStore } from './src/store/auth.store';

function createConfiguredQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  });
}

export default function App() {
  const [queryClient] = useState(createConfiguredQueryClient);

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationRoot />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
