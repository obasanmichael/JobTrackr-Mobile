import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, DatePickerField, Screen, TextField, Typography } from '../../components/ui';
import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from '../../constants/application-status';
import { APPLICATION_CURRENCIES } from '../../constants/currency';
import { JOB_SOURCE_LABELS, JOB_SOURCES, type JobSource } from '../../constants/job-source';
import { WORK_MODE_LABELS, type WorkMode } from '../../constants/work-mode';
import { buildApplicationWritePayload } from '../../domain/application-write-helpers';
import { parseAxiosApiError } from '../../services/api';
import { useCreateApplicationMutation } from '../../query/jt-queries';
import type { QuickAddStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

const WORK_SEQUENCE: WorkMode[] = ['UNSPECIFIED', 'REMOTE', 'HYBRID', 'ONSITE'];

type Props = CompositeScreenProps<
  NativeStackScreenProps<QuickAddStackParamList, 'QuickAddApplication'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function QuickAddApplicationScreen(props: Props): ReactElement {
  const { navigation } = props;
  const { theme } = useAppTheme();
  const create = useCreateApplicationMutation();

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);

  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('UNSPECIFIED');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState<typeof APPLICATION_CURRENCIES[number]>('USD');
  const [source, setSource] = useState<JobSource>('LINKEDIN');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [notes, setNotes] = useState('');

  const pill = (label: string, active: boolean, onPress: () => void): ReactElement => (
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
        {label}
      </Typography>
    </Pressable>
  );

  const save = (): void => {
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
      includeExtras: moreOpen,
    });
    if (!built.ok) {
      Alert.alert(built.alert.title, built.alert.message);
      return;
    }

    create.mutate(built.payload, {
      onSuccess: (created) => {
        navigation.navigate('Applications', {
          screen: 'ApplicationDetail',
          params: { applicationId: created.id },
        });
      },
      onError: (error) => {
        const normalized = parseAxiosApiError(error);
        Alert.alert(
          'Could not save application',
          normalized?.message ?? 'Something went wrong. Please try again.',
        );
      },
    });
  };

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <Typography variant="hero">Quick add</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Add the basics now. Expand more details anytime to mirror the desktop form.
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

      <Button
        label={moreOpen ? 'Hide more details' : 'More details (status, salary, deadline…)'}
        variant="outline"
        block
        style={{ marginTop: theme.space.lg }}
        onPress={() => setMoreOpen((v) => !v)}
      />

      {moreOpen ? (
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
            {JOB_SOURCES.map((s) => (
              <View key={s}>{pill(JOB_SOURCE_LABELS[s], source === s, () => setSource(s))}</View>
            ))}
          </ScrollView>

          <View style={{ gap: theme.space.xs }}>
            <DatePickerField label="Application deadline" value={deadlineDate} onChangeYmd={setDeadlineDate} />
            <Typography variant="caption" muted>
              Date-only, same as the website field.
            </Typography>
          </View>

          <TextField
            label="Notes (optional)"
            placeholder="Talking points, comp expectations…"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>
      ) : null}

      <Button
        label={create.isPending ? 'Saving…' : 'Save application'}
        variant="primary"
        block
        disabled={create.isPending}
        style={{ marginTop: theme.space.xl }}
        onPress={() => save()}
      />
    </Screen>
  );
}
