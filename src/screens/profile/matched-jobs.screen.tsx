import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Linking, Pressable, RefreshControl, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import type { MoreStackParamList } from '../../navigation/types';
import type { MatchedJobListing } from '../../types/matched-jobs.dto';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import {
  useGenerateMatchedJobsMutation,
  useMatchedJobsQuery,
} from '../../query/jt-queries';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  Typography,
} from '../../components/ui';
import { useAppTheme } from '../../theme';
import { parseAxiosApiError } from '../../services/api';

type Props = NativeStackScreenProps<MoreStackParamList, 'MatchedJobs'>;

function MatchedJobCard(props: {
  match: MatchedJobListing;
  onOpenPosting: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const { match } = props;

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.sm }}>
        <View style={{ flex: 1, gap: theme.space.xs }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            {match.job.title}
          </Typography>
          <Typography variant="caption" muted>
            {match.job.companyName}
          </Typography>
        </View>
        <View
          style={{
            minWidth: 44,
            borderRadius: 999,
            backgroundColor: theme.colors.borderMuted,
            paddingHorizontal: theme.space.sm,
            paddingVertical: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" style={{ fontWeight: '700' }}>
            {match.overallScore}
          </Typography>
        </View>
      </View>

      <Typography variant="caption" muted>
        {match.matchReason}
      </Typography>

      {match.matchedSkills.length > 0 ? (
        <Typography variant="caption" muted numberOfLines={2}>
          Skills: {match.matchedSkills.join(', ')}
        </Typography>
      ) : null}

      {match.job.applyUrl ? (
        <Button
          label="Apply on company site"
          variant="outline"
          onPress={props.onOpenPosting}
          style={{ alignSelf: 'flex-start', minHeight: 40 }}
        />
      ) : null}
    </Card>
  );
}

export function MatchedJobsScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();
  const query = useMatchedJobsQuery(apiOn);
  const generate = useGenerateMatchedJobsMutation();

  const refreshing = query.isFetching || generate.isPending;
  const onRefresh = () => {
    if (query.data?.requiresProfile) {
      void query.refetch();
      return;
    }
    generate.mutate();
  };

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Typography variant="hero">Matched jobs</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Ranked against your candidate profile using skills, role fit, location, and recency.
      </Typography>

      {!apiOn ? (
        <EmptyState
          icon={Sparkles}
          title="Sign in to see matches"
          description="Connect your account to load ranked jobs from the backend."
        />
      ) : null}

      {apiOn && query.isLoading ? <LoadingState label="Loading matches…" /> : null}

      {apiOn && query.isError ? (
        <ErrorState
          message={parseAxiosApiError(query.error, 'Could not load matched jobs.')}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {apiOn && query.data?.requiresProfile ? (
        <EmptyState
          icon={Sparkles}
          title="Upload your resume first"
          description="Matching uses your parsed candidate profile. Upload a resume, then pull to refresh."
        />
      ) : null}

      {apiOn && query.data && !query.data.requiresProfile && query.data.matches.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No matches yet"
          description="Pull to refresh after syncing job sources, or try again later."
        />
      ) : null}

      {apiOn && query.data && !query.data.requiresProfile
        ? query.data.matches.map((match) => (
            <MatchedJobCard
              key={match.job.id}
              match={match}
              onOpenPosting={() => {
                if (match.job.applyUrl) {
                  void Linking.openURL(match.job.applyUrl);
                }
              }}
            />
          ))
        : null}

      {generate.isError ? (
        <Typography variant="caption" muted style={{ color: theme.colors.danger }}>
          {parseAxiosApiError(generate.error, 'Could not refresh matches.')}
        </Typography>
      ) : null}
    </Screen>
  );
}
