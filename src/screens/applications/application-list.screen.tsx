import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ApplicationCard } from '../../components/applications/application-card';
import { Screen, TextField, Typography } from '../../components/ui';
import { MOCK_APPLICATIONS } from '../../fixtures/mock-applications';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationList'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function ApplicationListScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_APPLICATIONS;
    return MOCK_APPLICATIONS.filter(
      (a) =>
        a.jobTitle.toLowerCase().includes(q) ||
        a.companyName.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen scroll>
      <Typography variant="hero">Applications</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.xs }}>
        Mock list · swap fixtures for TanStack Query once endpoints wire up.
      </Typography>
      <View style={{ marginTop: theme.space.lg }}>
        <TextField
          label="Search (local)"
          placeholder="Role, company, status…"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        {filtered.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onPress={() => navigation.navigate('ApplicationDetail', { applicationId: app.id })}
          />
        ))}
      </View>
    </Screen>
  );
}
