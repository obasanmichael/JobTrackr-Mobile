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
  const headline = route.params.headline;
  const mutate = useCreateTimelineEventMutation(applicationId);

  const save = (): void => {
    if (scaffold || !apiOn) {
      Alert.alert('Not signed in', 'Connect your account (and turn off offline UI preview mode) to save notes.');
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
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Notes appear on this application&apos;s timeline. The first line is shown as the summary; anything after that stays as extra detail.
      </Typography>

      {headline ? (
        <Typography variant="bodySmall" style={{ marginTop: theme.space.lg, fontWeight: '600' }}>
          {headline}
        </Typography>
      ) : null}

      <TextField
        label="Note"
        placeholder="What happened on the call?"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={{ marginTop: theme.space.xl, minHeight: 140 }}
      />

      <Button
        label={mutate.isPending ? 'Saving…' : 'Save note'}
        variant="primary"
        block
        disabled={mutate.isPending || !apiOn || scaffold}
        style={{ marginTop: theme.space.xl }}
        onPress={() => save()}
      />

      {scaffold || !apiOn ? (
        <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
          Save is available when you&apos;re signed in with a linked JobTrackr account.
        </Typography>
      ) : null}
    </Screen>
  );
}
