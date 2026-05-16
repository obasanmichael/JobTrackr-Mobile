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
            normalized?.message ?? 'Unexpected error while contacting the backend.',
          );
        },
      },
    );
  };

  return (
    <Screen scroll>
      <Typography variant="hero">Quick add</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Captures essentials and POST /applications after login.
      </Typography>

      <Card style={{ marginTop: theme.space.xl, gap: theme.space.lg }}>
        <TextField label="Role title" placeholder="Senior Engineer" value={role} onChangeText={setRole} />
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

      <Typography variant="caption" muted style={{ marginTop: theme.space.lg }}>
        Need remote work mode or salary rails? Extend this flow once those inputs feel necessary.
      </Typography>
    </Screen>
  );
}
