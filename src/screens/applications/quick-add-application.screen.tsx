import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Screen, TextField, Typography } from '../../components/ui';
import { parseAxiosApiError } from '../../services/api';
import { useCreateApplicationMutation } from '../../query/jt-queries';
import type { QuickAddStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

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

  const trimmedRole = role.trim();
  const trimmedCompany = company.trim();
  const trimmedUrl = jobUrl.trim();

  const save = (): void => {
    if (!trimmedRole || !trimmedCompany) {
      Alert.alert('Missing fields', 'Add a role title and company name before saving.');
      return;
    }
    create.mutate(
      {
        jobTitle: trimmedRole,
        companyName: trimmedCompany,
        jobUrl: trimmedUrl || undefined,
      },
      {
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
      },
    );
  };

  return (
    <Screen scroll>
      <Typography variant="hero">Add application</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Capture the essentials on the go. Open JobTrackr on the web anytime to edit status, salary, location, and the rest.
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
