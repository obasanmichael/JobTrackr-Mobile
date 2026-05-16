import type { ReactElement } from 'react';
import { View } from 'react-native';
import type { ApplicationStatus } from '../../constants/application-status';
import { STATUS_LABELS } from '../../constants/application-status';
import { Typography } from '../ui/Typography';
import { useAppTheme } from '../../theme';

type BadgeTone = 'positive' | 'active' | 'neutral' | 'negative';

function toneForStatus(status: ApplicationStatus): BadgeTone {
  switch (status) {
    case 'OFFER':
    case 'APPLIED':
      return 'positive';
    case 'REJECTED':
      return 'negative';
    case 'WITHDRAWN':
      return 'neutral';
    case 'SCREENING':
    case 'INTERVIEW':
    case 'TECHNICAL_ASSESSMENT':
    case 'FINAL_INTERVIEW':
      return 'active';
    default:
      return 'neutral';
  }
}

export function StatusBadge({ status }: { status: ApplicationStatus }): ReactElement {
  const { theme } = useAppTheme();
  const tone = toneForStatus(status);

  const fg =
    tone === 'positive'
      ? theme.colors.success
      : tone === 'negative'
        ? theme.colors.danger
        : tone === 'active'
          ? theme.colors.accent
          : theme.colors.textSecondary;

  const bg =
    tone === 'positive'
      ? theme.mode === 'dark'
        ? '#34D39933'
        : '#05966922'
      : tone === 'negative'
        ? theme.mode === 'dark'
          ? '#F8717133'
          : '#DC262622'
        : tone === 'active'
          ? theme.colors.accentMuted
          : theme.colors.borderMuted;

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: theme.space.sm,
        paddingVertical: theme.space.xs,
        borderRadius: theme.radii.pill,
        backgroundColor: bg,
      }}
    >
      <Typography variant="caption" style={{ fontWeight: '600', color: fg }}>
        {STATUS_LABELS[status]}
      </Typography>
    </View>
  );
}
