import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { MapPin, Search } from 'lucide-react-native';
import { JOB_BOARD_WORK_MODE_API, type JobBoardWorkModeApi } from '../../constants/job-board';
import type { JobBoardListing, JobSearchRequestParams } from '../../types/job-board.dto';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useJobSearchQuery } from '../../query/jt-queries';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  TextField,
  Typography,
} from '../../components/ui';
import { useAppTheme } from '../../theme';
import { parseAxiosApiError } from '../../services/api';

function formatPosted(postedAt: string | null | undefined): string | null {
  if (!postedAt) return null;
  try {
    return format(parseISO(postedAt), 'MMM d, yyyy');
  } catch {
    return null;
  }
}

function JobListingCard(props: {
  job: JobBoardListing;
  onOpenPosting: () => void;
}): ReactElement {
  const { theme } = useAppTheme();
  const { job } = props;

  const salaryParts = [job.salaryMin, job.salaryMax]
    .map((n) => (n != null ? n.toLocaleString() : null))
    .filter(Boolean)
    .join(' – ');
  const salaryLabel = salaryParts ? `${salaryParts}${job.currency ? ` ${job.currency}` : ''}` : null;

  const postedLabel = formatPosted(job.postedAt);

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ gap: theme.space.xs }}>
        <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
          {job.title}
        </Typography>
        <Typography variant="caption" muted>
          {job.companyName}
        </Typography>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm }}>
        {job.location ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color={theme.colors.textMuted} strokeWidth={2} />
            <Typography variant="caption" muted>
              {job.location}
            </Typography>
          </View>
        ) : null}
        {job.workMode ? (
          <View
            style={{
              alignSelf: 'flex-start',
              borderRadius: 999,
              backgroundColor: theme.colors.borderMuted,
              paddingHorizontal: theme.space.sm,
              paddingVertical: 4,
            }}
          >
            <Typography variant="caption" muted style={{ fontSize: 11, fontWeight: '600' }}>
              {job.workMode}
            </Typography>
          </View>
        ) : null}
        {job.source ? (
          <Typography variant="caption" muted style={{ fontSize: 11 }}>
            Source · {job.source}
          </Typography>
        ) : null}
      </View>

      {salaryLabel ? (
        <Typography variant="caption" muted>
          {salaryLabel}
        </Typography>
      ) : null}

      {postedLabel ? (
        <Typography variant="caption" muted style={{ opacity: 0.85 }}>
          Posted {postedLabel}
        </Typography>
      ) : null}

      {job.excerpt ? (
        <Typography variant="caption" muted numberOfLines={4}>
          {job.excerpt}
        </Typography>
      ) : null}

      {job.applyUrl ? (
        <Button label="View posting" variant="outline" onPress={props.onOpenPosting} style={{ alignSelf: 'flex-start', minHeight: 40 }} />
      ) : null}
    </Card>
  );
}

export function JobSearchScreen(): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();

  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<JobBoardWorkModeApi>(JOB_BOARD_WORK_MODE_API[0].value);
  const [searched, setSearched] = useState(false);
  const [submittedFilters, setSubmittedFilters] = useState<{
    q?: string;
    location?: string;
    workMode: JobBoardWorkModeApi;
  }>({
    q: '',
    location: '',
    workMode: JOB_BOARD_WORK_MODE_API[0].value,
  });

  const queryFilters: JobSearchRequestParams = useMemo(
    () => ({
      q: submittedFilters.q,
      location: submittedFilters.location,
      workMode: submittedFilters.workMode,
      page: 1,
      limit: 20,
    }),
    [submittedFilters],
  );

  const jobsQuery = useJobSearchQuery(apiOn && searched, queryFilters);

  function runSearch(): void {
    setSearched(true);
    setSubmittedFilters({
      q: q.trim(),
      location: location.trim(),
      workMode,
    });
  }

  const errParse = jobsQuery.error ? parseAxiosApiError(jobsQuery.error) : null;
  const errMessage =
    jobsQuery.error instanceof Error ? jobsQuery.error.message : errParse?.message ?? 'Request failed';

  return (
    <Screen scroll keyboardAvoiding edges={['left', 'right', 'bottom']}>
      <Typography variant="subtitle" muted>
        Search aggregated listings from linked job sources—the same backend filters as the web app.
      </Typography>

      {!apiOn ? (
        <Card style={{ marginTop: theme.space.lg }}>
          <Typography variant="caption" muted>
            Connect your account with EXPO_PUBLIC_API_URL set to search live listings from your workspace.
          </Typography>
        </Card>
      ) : null}

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <TextField label="Keywords" placeholder="Role title or stack…" value={q} onChangeText={setQ} />
        <TextField label="Location" placeholder="City, country" value={location} onChangeText={setLocation} />
        <Typography variant="caption">Work mode</Typography>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm }}>
          {JOB_BOARD_WORK_MODE_API.map((option) => {
            const picked = option.value === workMode;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: picked }}
                onPress={() => setWorkMode(option.value)}
                style={{
                  paddingHorizontal: theme.space.md,
                  paddingVertical: theme.space.sm,
                  borderRadius: theme.radii.pill,
                  borderWidth: 2,
                  borderColor: picked ? theme.colors.accent : theme.colors.borderMuted,
                  backgroundColor: picked ? `${theme.colors.accent}22` : theme.colors.surfaceElevated,
                }}
              >
                <Typography variant="caption" style={{ fontWeight: picked ? '700' : '500', color: theme.colors.textPrimary }}>
                  {option.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
        <Button
          label="Search jobs"
          variant="primary"
          hapticOnPress
          onPress={() => void runSearch()}
          style={{ marginTop: theme.space.sm }}
        />
      </Card>

      {apiOn && !searched ? (
        <EmptyState
          icon={Search}
          title="Run a search to load results"
          description="Aggregation may return zero rows until sources sync—you can still validate filters against your API."
          actionLabel="Search with current filters"
          onActionPress={() => void runSearch()}
        />
      ) : null}

      {apiOn && searched && jobsQuery.isPending ? <LoadingState message="Searching…" /> : null}

      {apiOn && searched && jobsQuery.isError ? (
        <ErrorState message={errMessage} onRetry={() => void jobsQuery.refetch()} retryLabel="Retry" />
      ) : null}

      {apiOn && searched && jobsQuery.data && jobsQuery.data.total === 0 && !jobsQuery.isPending ? (
        <EmptyState
          icon={Search}
          title="No listings matched"
          description="Try different keywords or work mode—or wait until more roles sync from wired sources."
        />
      ) : null}

      {apiOn &&
      searched &&
      jobsQuery.data &&
      jobsQuery.data.total > 0 &&
      !jobsQuery.isPending &&
      !jobsQuery.isError ? (
        <View style={{ gap: theme.space.md, marginTop: theme.space.lg }}>
          <Typography variant="caption" muted style={{ letterSpacing: 0.25 }}>
            Showing {jobsQuery.data.jobs.length} of {jobsQuery.data.total} · Page {jobsQuery.data.page}
          </Typography>
          {jobsQuery.data.jobs.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              onOpenPosting={
                job.applyUrl
                  ? () => void Linking.openURL(job.applyUrl as string).catch(() => undefined)
                  : () => {}
              }
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
