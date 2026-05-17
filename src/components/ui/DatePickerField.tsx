import { Calendar as CalendarIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format, isValid, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Typography } from './Typography';
import { useAppTheme } from '../../theme';

type Props = {
  label: string;
  /** yyyy-MM-dd or blank */
  value: string;
  onChangeYmd: (yyyyMmDd: string) => void;
  placeholder?: string;
};

function dateFromYmdOrToday(ymd: string): Date {
  const t = ymd.trim();
  if (!t) return new Date();
  const parsed = parseISO(`${t}T12:00:00`);
  return isValid(parsed) ? parsed : new Date();
}

/**
 * Parity with the web form `<Input type="date" />`: pick a calendar day, emit `yyyy-MM-dd`,
 * so `deadlineInputToIso` produces the same style of ISO timestamps for Nest as manual entry.
 */
export function DatePickerField({
  label,
  value,
  onChangeYmd,
  placeholder = 'Select deadline',
}: Props): ReactElement {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState(() => dateFromYmdOrToday(value));

  const displayLine = useMemo(() => {
    const t = value.trim();
    if (!t) return null;
    const d = parseISO(`${t}T12:00:00`);
    return isValid(d) ? format(d, 'MMM d, yyyy') : t;
  }, [value]);

  useEffect(() => {
    setIosDraft(dateFromYmdOrToday(value));
  }, [value, iosOpen]);

  const openPicker = (): void => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'date',
        value: dateFromYmdOrToday(value),
        onChange: (event, date) => {
          if (event.type !== 'set' || !date) return;
          onChangeYmd(format(date, 'yyyy-MM-dd'));
        },
      });
    } else {
      setIosDraft(dateFromYmdOrToday(value));
      setIosOpen(true);
    }
  };

  return (
    <View style={{ gap: theme.space.xs }}>
      <Typography variant="caption">{label}</Typography>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${displayLine ?? placeholder}`}
        onPress={() => openPicker()}
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
        }}
      >
        <CalendarIcon size={20} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography
          variant="body"
          style={{ flex: 1 }}
          color={displayLine ? theme.colors.textPrimary : theme.colors.textMuted}
        >
          {displayLine ?? placeholder}
        </Typography>
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal transparent animationType="slide" visible={iosOpen} onRequestClose={() => setIosOpen(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss date picker"
              onPress={() => setIosOpen(false)}
              style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.overlay }]}
            />
            <View
              style={{
                backgroundColor: theme.colors.surfaceElevated,
                paddingTop: theme.space.md,
                paddingBottom: Math.max(insets.bottom, theme.space.md),
                borderTopLeftRadius: theme.radii.lg,
                borderTopRightRadius: theme.radii.lg,
                gap: theme.space.md,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <DateTimePicker
                value={iosDraft}
                mode="date"
                display="spinner"
                themeVariant={theme.mode === 'dark' ? 'dark' : 'light'}
                onChange={(_event, d) => {
                  if (d) setIosDraft(d);
                }}
              />
              <View style={{ flexDirection: 'row', gap: theme.space.md, paddingHorizontal: theme.space.lg }}>
                <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setIosOpen(false)} />
                <Button
                  label="Done"
                  variant="primary"
                  style={{ flex: 1 }}
                  onPress={() => {
                    onChangeYmd(format(iosDraft, 'yyyy-MM-dd'));
                    setIosOpen(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
