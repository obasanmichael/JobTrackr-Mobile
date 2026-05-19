import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { STATUS_LABELS } from '../../constants/application-status';
import type { ApplicationListItem } from '../../domain/application-display';
import { StatusBadge } from './status-badge';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { WORK_MODE_LABELS } from '../../constants/work-mode';
import { useAppTheme } from '../../theme';

type Props = {
  application: ApplicationListItem;
  onPress?: () => void;
};

export function ApplicationCard({ application, onPress }: Props): ReactElement {
  const { theme } = useAppTheme();
  const meta = [WORK_MODE_LABELS[application.workMode], application.location].filter(Boolean).join(' · ');
  const statusLabel = STATUS_LABELS[application.status];
  const accessibilitySummary = `${application.jobTitle}, ${application.companyName}. Status ${statusLabel}.${meta ? ` ${meta}` : ''}`;

  const inner = (
    <Card style={{ gap: theme.space.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.space.sm }}>
        <View style={{ flex: 1 }}>
          <Typography variant="title" numberOfLines={2}>
            {application.jobTitle}
          </Typography>
          <Typography variant="subtitle" muted numberOfLines={1}>
            {application.companyName}
          </Typography>
        </View>
        <StatusBadge status={application.status} />
      </View>
      {meta ? (
        <Typography variant="caption" muted numberOfLines={2}>
          {meta}
        </Typography>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.md }}>
        {application.salaryRange ? (
          <Typography variant="caption" color={theme.colors.accent}>
            {application.salaryRange}
          </Typography>
        ) : null}
        {application.appliedLabel ? (
          <Typography variant="caption" muted>
            {application.appliedLabel}
          </Typography>
        ) : null}
      </View>
      {application.deadlineLabel ? (
        <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.warning }}>
          {application.deadlineLabel}
        </Typography>
      ) : null}
    </Card>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilitySummary}
        accessibilityHint="Opens application details."
        onPress={onPress}
      >
        <View accessible={false} importantForAccessibility="no-hide-descendants">
          {inner}
        </View>
      </Pressable>
    );
  }

  return inner;
}
