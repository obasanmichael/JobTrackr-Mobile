import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Screen, TextField, Typography } from '../../components/ui';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'AddTimelineNote'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function AddTimelineNoteScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const [body, setBody] = useState('');

  return (
    <Screen scroll>
      <Typography variant="hero">Add note</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Application · {route.params.applicationId}
      </Typography>
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        Mirror web timeline validation before enabling POST.
      </Typography>

      <View style={{ marginTop: theme.space.xl }}>
        <TextField
          label="Note"
          placeholder="What happened on the call?"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{ minHeight: 140 }}
        />
      </View>

      <Button label="Save note (disabled · UI-only)" variant="primary" block disabled style={{ marginTop: theme.space.xl }} onPress={() => undefined} />
    </Screen>
  );
}
