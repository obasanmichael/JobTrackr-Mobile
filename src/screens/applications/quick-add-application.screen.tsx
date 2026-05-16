import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Screen, TextField, Typography } from '../../components/ui';
import type { QuickAddStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<QuickAddStackParamList, 'QuickAddApplication'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function QuickAddApplicationScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');

  return (
    <Screen scroll>
      <Typography variant="hero">Quick add</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Minimal capture · validation mirrors web Zod schemas when wired.
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

      <Button label="Save application (disabled · UI-only)" variant="primary" block disabled style={{ marginTop: theme.space.xl }} onPress={() => undefined} />
    </Screen>
  );
}
