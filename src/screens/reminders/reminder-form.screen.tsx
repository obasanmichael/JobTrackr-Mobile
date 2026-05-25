import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { format, parseISO } from 'date-fns';
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
import type { ReminderFormParams } from '../../navigation/types';
import {
  useApplicationsListQuery,
  useCreateReminderMutation,
  useCreateTimelineEventMutation,
  useDeleteReminderMutation,
  useRemindersQuery,
  useUpdateReminderMutation,
} from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';

type Props = NativeStackScreenProps<{ ReminderForm: ReminderFormParams }, 'ReminderForm'>;

export function ReminderFormScreen({ navigation, route }: Props): ReactElement {
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const { reminderId, applicationId: presetApplicationId, headline, recordTimeline } = route.params;
  const isEdit = Boolean(reminderId);

  const appsQuery = useApplicationsListQuery(apiOn, {});
  const remindersQuery = useRemindersQuery(apiOn && isEdit);
  const createMutation = useCreateReminderMutation();
  const updateMutation = useUpdateReminderMutation();
  const deleteMutation = useDeleteReminderMutation();

  const existing = useMemo(
    () => remindersQuery.data?.find((r) => r.id === reminderId),
    [reminderId, remindersQuery.data],
  );

  const timelineAppId = presetApplicationId ?? existing?.applicationId ?? '';
  const timelineMutation = useCreateTimelineEventMutation(timelineAppId);

  const [hydrated, setHydrated] = useState(!isEdit);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateIso, setDueDateIso] = useState('');
  const [applicationId, setApplicationId] = useState(presetApplicationId ?? '');

  useEffect(() => {
    if (!isEdit || !existing) return;
    setTitle(existing.title);
    setDescription(existing.description ?? '');
    setDueDateIso(existing.dueDate);
    setApplicationId(existing.applicationId);
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
      Alert.alert('Not signed in', 'Connect your JobTrackr account to save reminders.');
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Title required', 'Give this reminder a short title.');
      return;
    }
    if (!dueDateIso.trim()) {
      Alert.alert('Due date required', 'Pick when this reminder is due.');
      return;
    }
    if (!isEdit && !applicationId) {
      Alert.alert('Application required', 'Link this reminder to an application.');
      return;
    }

    if (isEdit && reminderId) {
      updateMutation.mutate(
        {
          id: reminderId,
          payload: {
            title: trimmedTitle,
            description: description.trim() || null,
            dueDate: dueDateIso,
          },
        },
        {
          onSuccess: () => {
            showSuccessFeedback('Reminder updated');
            navigation.goBack();
          },
          onError: (error) => {
            showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not update reminder.');
          },
        },
      );
      return;
    }

    createMutation.mutate(
      {
        applicationId,
        title: trimmedTitle,
        description: description.trim() || undefined,
        dueDate: dueDateIso,
      },
      {
        onSuccess: async (created) => {
          if (recordTimeline && timelineAppId) {
            try {
              const dueLabel = format(parseISO(created.dueDate), 'MMM d, yyyy');
              await timelineMutation.mutateAsync({
                type: 'REMINDER_CREATED',
                title: `Reminder set: "${created.title}"`,
                description: `Due ${dueLabel}`,
              });
            } catch {
              /* timeline is best-effort when creating from application detail */
            }
          }
          showSuccessFeedback('Reminder created');
          navigation.goBack();
        },
        onError: (error) => {
          showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not create reminder.');
        },
      },
    );
  };

  const confirmDelete = (): void => {
    if (!reminderId) return;
    Alert.alert('Delete reminder?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(reminderId, {
            onSuccess: () => {
              showSuccessFeedback('Reminder deleted');
              navigation.goBack();
            },
            onError: (error) => {
              showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not delete reminder.');
            },
          }),
      },
    ]);
  };

  const pending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || timelineMutation.isPending;

  if (isEdit && apiOn && remindersQuery.isPending) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <LoadingState message="Loading reminder…" />
      </Screen>
    );
  }

  if (isEdit && apiOn && !existing && hydrated) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <Typography variant="bodySmall">Reminder not found.</Typography>
        <Button label="Go back" variant="secondary" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </Screen>
    );
  }

  const linkedSummary = applicationId ? lookup[applicationId] : undefined;

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">{isEdit ? 'Edit reminder' : 'New reminder'}</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: 8 }}>
        {isEdit
          ? 'Update title, details, or due date.'
          : 'Follow-ups and deadlines linked to your applications.'}
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

      <TextField
        label="Title"
        placeholder="e.g. Follow up with recruiter"
        value={title}
        onChangeText={setTitle}
        style={{ marginTop: 20 }}
      />

      <TextField
        label="Description"
        placeholder="Optional details…"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={{ marginTop: 16, minHeight: 88 }}
      />

      <View style={{ marginTop: 16 }}>
        <DateTimePickerField label="Due date" valueIso={dueDateIso} onChangeIso={setDueDateIso} />
      </View>

      <Button
        label={pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create reminder'}
        variant="primary"
        block
        disabled={pending || !hydrated || scaffold || !apiOn}
        style={{ marginTop: 24 }}
        onPress={() => save()}
      />

      {isEdit ? (
        <Button
          label={deleteMutation.isPending ? 'Deleting…' : 'Delete reminder'}
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
