import type { ReactElement } from 'react';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

export type OptionPickerItem<T extends string = string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label: string;
  value: T | '';
  options: OptionPickerItem<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function OptionPickerField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled,
}: Props<T>): ReactElement {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View style={{ gap: theme.space.xs }}>
      <Typography variant="caption">{label}</Typography>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space.md,
          backgroundColor: theme.colors.surfaceElevated,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          paddingVertical: theme.space.md,
          paddingHorizontal: theme.space.lg,
          minHeight: 48,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Typography
          variant="body"
          style={{ flex: 1 }}
          color={selected ? theme.colors.textPrimary : theme.colors.textMuted}
        >
          {selected?.label ?? placeholder}
        </Typography>
        <ChevronDown size={18} color={theme.colors.textMuted} />
      </Pressable>

      <Modal transparent animationType="slide" visible={open} onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss picker"
            onPress={() => setOpen(false)}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.overlay }]}
          />
          <View
            style={{
              backgroundColor: theme.colors.surfaceElevated,
              paddingTop: theme.space.md,
              paddingBottom: Math.max(insets.bottom, theme.space.md),
              borderTopLeftRadius: theme.radii.lg,
              borderTopRightRadius: theme.radii.lg,
              maxHeight: '70%',
              borderTopWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Typography variant="subtitle" style={{ paddingHorizontal: theme.space.lg, marginBottom: theme.space.sm }}>
              {label}
            </Typography>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={{
                    paddingVertical: theme.space.md,
                    paddingHorizontal: theme.space.lg,
                    backgroundColor: item.value === value ? theme.colors.accentMuted : 'transparent',
                  }}
                >
                  <Typography variant="bodySmall" style={{ fontWeight: item.value === value ? '700' : '400' }}>
                    {item.label}
                  </Typography>
                </Pressable>
              )}
            />
            <View style={{ paddingHorizontal: theme.space.lg, paddingTop: theme.space.sm }}>
              <Button label="Cancel" variant="outline" block onPress={() => setOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
