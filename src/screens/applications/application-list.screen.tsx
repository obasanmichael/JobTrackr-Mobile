import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { ApplicationCard } from '../../components/applications/application-card';
import { EmptyState, LoadingState, Screen, TextField, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { applicationDtoToListItem } from '../../domain/application-mappers';
import { MOCK_APPLICATIONS } from '../../fixtures/mock-applications';
import { useDebouncedValue } from '../../hooks/use-debounced-value';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useApplicationsListQuery } from '../../query/jt-queries';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationList'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function ApplicationListScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim(), 380);

  const remote = useApplicationsListQuery(apiOn, { search: debounced || undefined });
  const listFromApi = useMemo(
    () => remote.data?.map(applicationDtoToListItem) ?? [],
    [remote.data],
  );

  const filteredMocks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_APPLICATIONS;
    return MOCK_APPLICATIONS.filter(
      (a) =>
        a.jobTitle.toLowerCase().includes(q) ||
        a.companyName.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q),
    );
  }, [query]);

  const rows = scaffold || !apiOn ? filteredMocks : listFromApi;

  const subtitle = scaffold
    ? 'Sample listings for preview.'
    : apiOn
      ? 'Tap a row to open the full workspace.'
      : 'Showing local preview until your account connects.';

  const refresh = (
    <RefreshControl
      refreshing={Boolean(apiOn && remote.isRefetching)}
      onRefresh={() => void remote.refetch()}
    />
  );

  const boot = apiOn && remote.isPending;

  if (boot) {
    return (
      <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
        <LoadingState message="Fetching applications…" />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshControl={refresh} edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero" accessibilityRole="header">
        Applications
      </Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.xs }}>
        {subtitle}
      </Typography>

      {apiOn && remote.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(remote.error as Error)?.message ?? 'Applications request failed'}
        </Typography>
      ) : null}

      <View style={{ marginTop: theme.space.lg }}>
        <TextField
          label="Search"
          placeholder="Role, company, status…"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {rows.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description={
            apiOn ? 'Nothing matched this search · try widening terms or clear the query.' : 'Nothing to display.'
          }
        />
      ) : (
        <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
          {rows.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onPress={() => navigation.navigate('ApplicationDetail', { applicationId: app.id })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
