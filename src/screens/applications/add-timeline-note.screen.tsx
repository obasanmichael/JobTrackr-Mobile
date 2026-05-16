import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Screen, TextField, Typography } from '../../components/ui';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { parseAxiosApiError } from '../../services/api';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useCreateTimelineEventMutation } from '../../query/jt-queries';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'AddTimelineNote'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function AddTimelineNoteScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();

  const [body, setBody] = useState('');
  const applicationId = route.params.applicationId;
  const mutate = useCreateTimelineEventMutation(applicationId);

  const save = (): void => {
    if (scaffold || !apiOn) {
      Alert.alert('Read-only scaffold', 'Authenticate against the Nest API without scaffold mode to POST notes.');
      return;
    }
    const trimmed = body.trim();
    if (!trimmed) {
      Alert.alert('Nothing to save', 'Add a short note summarizing what changed.');
      return;
    }

    const title = trimmed.slice(0, 120).trimEnd();
    const overflow = trimmed.slice(120).trim();
    mutate.mutate(
      {
        type: 'NOTE',
        title,
        description: overflow || undefined,
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: (error) => {
          const normalized = parseAxiosApiError(error);
          Alert.alert(
            'Could not publish note',
            normalized?.message ?? 'Unexpected timeline error.',
          );
        },
      },
    );
  };

  return (
    <Screen scroll>
      <Typography variant="hero">Add note</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Sends NOTE events to POST /applications/:id/events.
      </Typography>
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        The server stores up to 120 characters as the headline and keeps the remainder as optional description text.
      </Typography>

      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Application · {applicationId}
      </Typography>

      <TextField
        label="Timeline note"
        placeholder="What happened on the call?"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={{ marginTop: theme.space.xl, minHeight: 140 }}
      />

      <Button
        label={mutate.isPending ? 'Posting…' : 'Save note'}
        variant="primary"
        block
        disabled={mutate.isPending || !apiOn || scaffold}
        style={{ marginTop: theme.space.xl }}
        onPress={() => save()}
      />

      {(scaffold || !apiOn) ? (
        <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
          This surface unlocks automatically once scaffold mode is disabled and JWT calls succeed.
        </Typography>
      ) : null}
    </Screen>
  );
}
