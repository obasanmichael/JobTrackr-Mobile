import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, DatePickerField, LoadingState, Screen, TextField, Typography } from '../../components/ui';
import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from '../../constants/application-status';
import { APPLICATION_CURRENCIES } from '../../constants/currency';
import { JOB_SOURCE_LABELS, JOB_SOURCES, type JobSource } from '../../constants/job-source';
import { WORK_MODE_LABELS, type WorkMode } from '../../constants/work-mode';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { applicationDtoToFormDraft } from '../../domain/application-draft-from-dto';
import { buildApplicationWritePayload } from '../../domain/application-write-helpers';
import { getMockApplicationById } from '../../fixtures/mock-applications';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useApplicationDetailQuery, useUpdateApplicationMutation } from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';
import { useAppTheme } from '../../theme';

const WORK_SEQUENCE: WorkMode[] = ['UNSPECIFIED', 'REMOTE', 'HYBRID', 'ONSITE'];

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'EditApplication'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function EditApplicationScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const applicationId = route.params.applicationId;

  const detailQuery = useApplicationDetailQuery(apiOn && !scaffold, applicationId);
  const updateMutation = useUpdateApplicationMutation(applicationId);

  const [hydrated, setHydrated] = useState(false);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('UNSPECIFIED');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState<(typeof APPLICATION_CURRENCIES)[number]>('USD');
  const [source, setSource] = useState<JobSource>('OTHER');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (apiOn || !scaffold) return;
    const mock = getMockApplicationById(applicationId);
    if (!mock) {
      setHydrated(true);
      return;
    }
    setRole(mock.jobTitle);
    setCompany(mock.companyName);
    setJobUrl('');
    setStatus(mock.status);
    setLocation(mock.location ?? '');
    setWorkMode(mock.workMode);
    setSalaryMin('');
    setSalaryMax('');
    setCurrency('USD');
    setSource('OTHER');
    setDeadlineDate('');
    setNotes(mock.notesPreview ?? '');
    setHydrated(true);
  }, [apiOn, scaffold, applicationId]);

  useLayoutEffect(() => {
    if (!apiOn || scaffold || !detailQuery.data) return;
    const d = applicationDtoToFormDraft(detailQuery.data);
    setRole(d.jobTitle);
    setCompany(d.companyName);
    setJobUrl(d.jobUrl);
    setStatus(d.status);
    setLocation(d.location);
    setWorkMode(d.workMode);
    setSalaryMin(d.salaryMinStr);
    setSalaryMax(d.salaryMaxStr);
    setCurrency(d.currency);
    setSource(d.source);
    setDeadlineDate(d.deadlineDateStr);
    setNotes(d.notes);
    setHydrated(true);
  }, [apiOn, scaffold, detailQuery.data]);

  const pill = (labelText: string, active: boolean, onPress: () => void): ReactElement => (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        paddingHorizontal: theme.space.md,
        paddingVertical: theme.space.sm,
        borderRadius: theme.radii.pill,
        borderWidth: active ? 2 : 1,
        borderColor: active ? theme.colors.accent : theme.colors.borderMuted,
        backgroundColor: active ? theme.colors.accentMuted : theme.colors.surfaceElevated,
        marginRight: theme.space.sm,
      }}
    >
      <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
        {labelText}
      </Typography>
    </Pressable>
  );

  const save = (): void => {
    if (scaffold || !apiOn) {
      Alert.alert('Not signed in', 'Connect your JobTrackr account to save edits.');
      return;
    }

    const built = buildApplicationWritePayload({
      jobTitle: role,
      companyName: company,
      jobUrl,
      status,
      location,
      workMode,
      salaryMinStr: salaryMin,
      salaryMaxStr: salaryMax,
      currency,
      source,
      deadlineDateStr: deadlineDate,
      notes,
      includeExtras: true,
    });
    if (!built.ok) {
      Alert.alert(built.alert.title, built.alert.message);
      return;
    }

    updateMutation.mutate(built.payload, {
      onSuccess: () => navigation.goBack(),
      onError: (error) => {
        const normalized = parseAxiosApiError(error);
        Alert.alert(
          'Could not save changes',
          normalized?.message ?? 'Something went wrong. Please try again.',
        );
      },
    });
  };

  const scaffoldMissingMock = scaffold && !getMockApplicationById(applicationId);
  const bootLoading = apiOn && !scaffold && !detailQuery.data && (detailQuery.isPending || detailQuery.isFetching);
  const loadError = apiOn && !scaffold && detailQuery.isError && !detailQuery.data;

  if (bootLoading) {
    return (
      <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
        <LoadingState message="Loading application…" />
      </Screen>
    );
  }

  if (loadError) {
    return (
      <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
        <Typography variant="hero">Edit application</Typography>
        <Typography variant="bodySmall" color={theme.colors.danger} style={{ marginTop: theme.space.lg }}>
          {(detailQuery.error as Error)?.message ?? 'Unable to load this application.'}
        </Typography>
        <Button label="Retry" variant="outline" block style={{ marginTop: theme.space.lg }} onPress={() => void detailQuery.refetch()} />
      </Screen>
    );
  }

  if (scaffoldMissingMock) {
    return (
      <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
        <Typography variant="hero">Edit application</Typography>
        <Typography variant="bodySmall" muted style={{ marginTop: theme.space.lg }}>
          This application isn’t in the offline sample dataset.
        </Typography>
        <Button label="Go back" variant="outline" block style={{ marginTop: theme.space.lg }} onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <Typography variant="hero">Edit application</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        {scaffold ? 'Offline preview · sign in to save changes.' : 'Updates sync with JobTrackr on web and mobile.'}
      </Typography>

      <Card style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
        <TextField label="Job title" placeholder="Senior Engineer" value={role} onChangeText={setRole} />
        <TextField label="Company" placeholder="Acme Labs" value={company} onChangeText={setCompany} />
        <TextField
          label="Posting URL (optional)"
          placeholder="https://…"
          value={jobUrl}
          onChangeText={setJobUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
      </Card>

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.md }}>
        <Typography variant="label">Status</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {APPLICATION_STATUSES.map((s) => (
            <View key={s}>{pill(STATUS_LABELS[s], status === s, () => setStatus(s))}</View>
          ))}
        </ScrollView>

        <TextField label="Location (optional)" placeholder="City, province, …" value={location} onChangeText={setLocation} />

        <Typography variant="label">Work arrangement</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {WORK_SEQUENCE.map((w) => (
            <View key={w}>{pill(WORK_MODE_LABELS[w], workMode === w, () => setWorkMode(w))}</View>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: theme.space.md }}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Salary min"
              placeholder="120000"
              value={salaryMin}
              onChangeText={setSalaryMin}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Salary max"
              placeholder="180000"
              value={salaryMax}
              onChangeText={setSalaryMax}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Typography variant="label">Currency</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {APPLICATION_CURRENCIES.map((c) => (
            <View key={c}>{pill(c, currency === c, () => setCurrency(c))}</View>
          ))}
        </ScrollView>

        <Typography variant="label">Source</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {JOB_SOURCES.map((src) => (
            <View key={src}>{pill(JOB_SOURCE_LABELS[src], source === src, () => setSource(src))}</View>
          ))}
        </ScrollView>

        <View style={{ gap: theme.space.xs }}>
          <DatePickerField label="Application deadline" value={deadlineDate} onChangeYmd={setDeadlineDate} />
          <Typography variant="caption" muted>
            Date-only, like the desktop form—sent to the backend in the same yyyy-mm-dd shape.
          </Typography>
        </View>

        <TextField
          label="Notes (optional)"
          placeholder="Talking points, comp expectations…"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </Card>

      <Button
        label={
          scaffold || !apiOn ? 'Save (sign in required)' : updateMutation.isPending ? 'Saving…' : 'Save changes'
        }
        variant="primary"
        block
        disabled={updateMutation.isPending || scaffold || !apiOn || !hydrated}
        style={{ marginTop: theme.space.xl }}
        onPress={() => save()}
      />
      <Button label="Cancel" variant="outline" block style={{ marginTop: theme.space.md }} onPress={() => navigation.goBack()} />
    </Screen>
  );
}
