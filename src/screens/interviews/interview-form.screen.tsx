import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import {
  INTERVIEW_STAGE_LABELS,
  INTERVIEW_STAGES,
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_TYPES,
  type InterviewStageId,
  type InterviewTypeId,
} from '../../constants/interview-metadata';
import { INTERVIEW_OUTCOMES } from '../../constants/interview-outcome';
import {
  Button,
  DateTimePickerField,
  LoadingState,
  OptionPickerField,
  Screen,
  TextField,
  Typography,
} from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { buildJobSummaryLookup } from '../../domain/job-lookup';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import type { InterviewFormParams } from '../../navigation/types';
import {
  useApplicationsListQuery,
  useCreateInterviewMutation,
  useCreateTimelineEventMutation,
  useDeleteInterviewMutation,
  useInterviewsQuery,
  useUpdateInterviewMutation,
} from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';

type Props = NativeStackScreenProps<{ InterviewForm: InterviewFormParams }, 'InterviewForm'>;

const STAGE_OPTIONS = INTERVIEW_STAGES.map((value) => ({
  value,
  label: INTERVIEW_STAGE_LABELS[value],
}));

const TYPE_OPTIONS = INTERVIEW_TYPES.map((value) => ({
  value,
  label: INTERVIEW_TYPE_LABELS[value],
}));

const OUTCOME_OPTIONS = [
  { value: '', label: 'Not set' },
  ...INTERVIEW_OUTCOMES.map((value) => ({ value, label: value })),
];

export function InterviewFormScreen({ navigation, route }: Props): ReactElement {
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const { interviewId, applicationId: presetApplicationId, headline, recordTimeline } = route.params;
  const isEdit = Boolean(interviewId);

  const appsQuery = useApplicationsListQuery(apiOn, {});
  const interviewsQuery = useInterviewsQuery(apiOn && isEdit);
  const createMutation = useCreateInterviewMutation();
  const updateMutation = useUpdateInterviewMutation();
  const deleteMutation = useDeleteInterviewMutation();

  const existing = useMemo(
    () => interviewsQuery.data?.find((i) => i.id === interviewId),
    [interviewId, interviewsQuery.data],
  );

  const timelineAppId = presetApplicationId ?? existing?.applicationId ?? '';
  const timelineMutation = useCreateTimelineEventMutation(timelineAppId);

  const [hydrated, setHydrated] = useState(!isEdit);
  const [applicationId, setApplicationId] = useState(presetApplicationId ?? '');
  const [stage, setStage] = useState<InterviewStageId>('TECHNICAL_INTERVIEW');
  const [interviewType, setInterviewType] = useState<InterviewTypeId>('VIDEO');
  const [scheduledAtIso, setScheduledAtIso] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    if (!isEdit || !existing) return;
    setApplicationId(existing.applicationId);
    setStage(existing.stage);
    setInterviewType(existing.interviewType);
    setScheduledAtIso(existing.scheduledAt);
    setLocation(existing.location ?? existing.meetingLink ?? '');
    setNotes(existing.notes ?? '');
    setOutcome(existing.outcome ?? '');
    setHydrated(true);
  }, [existing, isEdit]);

  useEffect(() => {
    if (isEdit) return;
    if (presetApplicationId) setApplicationId(presetApplicationId);
    setHydrated(true);
  }, [isEdit, presetApplicationId]);

  const lookup = useMemo(() => buildJobSummaryLookup(appsQuery.data), [appsQuery.data]);
  const applicationOptions = useMemo(
    () =>
      (appsQuery.data ?? []).map((app) => ({
        value: app.id,
        label: `${app.companyName}, ${app.jobTitle}`,
      })),
    [appsQuery.data],
  );

  const save = (): void => {
    if (scaffold || !apiOn) {
      Alert.alert('Not signed in', 'Connect your JobTrackr account to save interviews.');
      return;
    }

    if (!scheduledAtIso.trim()) {
      Alert.alert('Date required', 'Pick when this interview is scheduled.');
      return;
    }
    if (!isEdit && !applicationId) {
      Alert.alert('Application required', 'Link this interview to an application.');
      return;
    }

    const sharedPayload = {
      stage,
      interviewType,
      scheduledAt: scheduledAtIso,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      outcome: outcome.trim() || undefined,
    };

    if (isEdit && interviewId) {
      updateMutation.mutate(
        {
          id: interviewId,
          payload: {
            ...sharedPayload,
            location: location.trim() || null,
            notes: notes.trim() || null,
            outcome: outcome.trim() || null,
          },
        },
        {
          onSuccess: () => {
            showSuccessFeedback('Interview updated');
            navigation.goBack();
          },
          onError: (error) => {
            showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not update interview.');
          },
        },
      );
      return;
    }

    createMutation.mutate(
      {
        applicationId,
        ...sharedPayload,
      },
      {
        onSuccess: async (created) => {
          if (recordTimeline && timelineAppId) {
            try {
              const when = format(parseISO(created.scheduledAt), 'MMM d, h:mm a');
              const stageLabel = INTERVIEW_STAGE_LABELS[created.stage] ?? created.stage;
              const typeLabel = INTERVIEW_TYPE_LABELS[created.interviewType] ?? created.interviewType;
              await timelineMutation.mutateAsync({
                type: 'INTERVIEW_UPDATE',
                title: 'Interview logged',
                description: `${stageLabel} (${typeLabel}) on ${when}`,
              });
            } catch {
              /* timeline is best-effort */
            }
          }
          showSuccessFeedback('Interview logged');
          navigation.goBack();
        },
        onError: (error) => {
          showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not log interview.');
        },
      },
    );
  };

  const confirmDelete = (): void => {
    if (!interviewId) return;
    Alert.alert('Delete interview?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(interviewId, {
            onSuccess: () => {
              showSuccessFeedback('Interview deleted');
              navigation.goBack();
            },
            onError: (error) => {
              showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not delete interview.');
            },
          }),
      },
    ]);
  };

  const pending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || timelineMutation.isPending;

  if (isEdit && apiOn && interviewsQuery.isPending) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <LoadingState message="Loading interview…" />
      </Screen>
    );
  }

  if (isEdit && apiOn && !existing && hydrated) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <Typography variant="bodySmall">Interview not found.</Typography>
        <Button label="Go back" variant="secondary" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </Screen>
    );
  }

  const linkedSummary = applicationId ? lookup[applicationId] : undefined;

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">{isEdit ? 'Edit interview' : 'Log interview'}</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: 8 }}>
        {isEdit ? 'Update stage, schedule, location, or notes.' : 'Track interview rounds for your applications.'}
      </Typography>

      {headline ? (
        <Typography variant="bodySmall" style={{ marginTop: 16, fontWeight: '600' }}>
          {headline}
        </Typography>
      ) : null}

      {!isEdit ? (
        <View style={{ marginTop: 20 }}>
          <OptionPickerField
            label="Application"
            value={applicationId}
            options={applicationOptions}
            onChange={setApplicationId}
            placeholder="Select application"
            disabled={Boolean(presetApplicationId)}
          />
        </View>
      ) : linkedSummary ? (
        <Typography variant="caption" muted style={{ marginTop: 16 }}>
          Linked to {linkedSummary.companyName} · {linkedSummary.jobTitle}
        </Typography>
      ) : null}

      <View style={{ marginTop: 16, gap: 16 }}>
        <OptionPickerField label="Stage" value={stage} options={STAGE_OPTIONS} onChange={setStage} />
        <OptionPickerField label="Type" value={interviewType} options={TYPE_OPTIONS} onChange={setInterviewType} />
      </View>

      <View style={{ marginTop: 16 }}>
        <DateTimePickerField
          label="Date & time"
          valueIso={scheduledAtIso}
          onChangeIso={setScheduledAtIso}
        />
      </View>

      <TextField
        label="Location / link"
        placeholder="e.g. Google Meet, onsite"
        value={location}
        onChangeText={setLocation}
        style={{ marginTop: 16 }}
      />

      <View style={{ marginTop: 16 }}>
        <OptionPickerField
          label="Outcome"
          value={outcome}
          options={OUTCOME_OPTIONS}
          onChange={setOutcome}
          placeholder="Not set"
        />
      </View>

      <TextField
        label="Notes"
        placeholder="Topics, questions, observations…"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={{ marginTop: 16, minHeight: 100 }}
      />

      <Button
        label={pending ? 'Saving…' : isEdit ? 'Save changes' : 'Log interview'}
        variant="primary"
        block
        disabled={pending || !hydrated || scaffold || !apiOn}
        style={{ marginTop: 24 }}
        onPress={() => save()}
      />

      {isEdit ? (
        <Button
          label={deleteMutation.isPending ? 'Deleting…' : 'Delete interview'}
          variant="outline"
          block
          disabled={pending}
          style={{ marginTop: 12 }}
          onPress={() => confirmDelete()}
        />
      ) : null}
    </Screen>
  );
}
