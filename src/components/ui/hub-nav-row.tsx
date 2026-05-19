import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

type Props = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
};

export function HubNavRow(props: Props): ReactElement {
  const { theme } = useAppTheme();
  const Icon = props.icon;
  const disabled = Boolean(props.disabled);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={props.title}
      accessibilityHint={props.accessibilityHint}
      disabled={disabled}
      onPress={props.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space.md,
        paddingVertical: theme.space.md,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.md, flex: 1 }}
      >
        <Icon size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            {props.title}
          </Typography>
          {props.subtitle ? (
            <Typography variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>
              {props.subtitle}
            </Typography>
          ) : null}
        </View>
        <ChevronRight color={theme.colors.textMuted} size={22} strokeWidth={2} />
      </View>
    </Pressable>
  );
}
