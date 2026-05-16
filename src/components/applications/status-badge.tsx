import type { ReactElement } from 'react';
import { View } from 'react-native';
import type { ApplicationStatus } from '../../constants/application-status';
import { STATUS_LABELS } from '../../constants/application-status';
import {
  APPLICATION_STATUS_CHART_FG,
  applicationStatusMutedSurface,
} from '../../constants/application-status-colors';
import { Typography } from '../ui/Typography';
import { useAppTheme } from '../../theme';

export function StatusBadge({ status }: { status: ApplicationStatus }): ReactElement {
  const { theme } = useAppTheme();
  const fg = APPLICATION_STATUS_CHART_FG[status];
  const bg = applicationStatusMutedSurface(fg, theme.mode);

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
