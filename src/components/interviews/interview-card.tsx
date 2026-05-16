import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import type { InterviewFormat, InterviewListItem } from '../../domain/interview-display';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { useAppTheme } from '../../theme';

type Props = {
  interview: InterviewListItem;
  onPress?: () => void;
};

const FORMAT_LABEL: Record<InterviewFormat, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
};

export function InterviewCard({ interview, onPress }: Props): ReactElement {
  const { theme } = useAppTheme();

  const inner = (
    <Card style={{ gap: theme.space.sm }}>
      <View style={{ flexDirection: 'row', gap: theme.space.md }}>
        <CalendarDays color={theme.colors.accent} size={22} strokeWidth={2} />
        <View style={{ flex: 1 }}>
          <Typography variant="subtitle" numberOfLines={2}>
            {interview.roleTitle}
          </Typography>
          <Typography variant="caption" muted style={{ marginTop: theme.space.xs }}>
            {interview.companyName}
          </Typography>
          <Typography variant="bodySmall" style={{ marginTop: theme.space.sm }}>
            {interview.startLabel}
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginTop: theme.space.xs }}>
            <Typography variant="caption" muted>
              {interview.durationLabel}
            </Typography>
            <Typography variant="caption" color={theme.colors.accent}>
              {FORMAT_LABEL[interview.format]}
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}
