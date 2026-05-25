import { CalendarClock } from 'lucide-react-native';
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
  /** ISO datetime string or blank */
  valueIso: string;
  onChangeIso: (iso: string) => void;
  placeholder?: string;
};

function dateFromIsoOrNow(iso: string): Date {
  const t = iso.trim();
  if (!t) return new Date();
  const parsed = parseISO(t);
  return isValid(parsed) ? parsed : new Date();
}

export function DateTimePickerField({
  label,
  valueIso,
  onChangeIso,
  placeholder = 'Select date & time',
}: Props): ReactElement {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState(() => dateFromIsoOrNow(valueIso));

  const displayLine = useMemo(() => {
    const t = valueIso.trim();
    if (!t) return null;
    const d = parseISO(t);
    return isValid(d) ? format(d, 'MMM d, yyyy · h:mm a') : t;
  }, [valueIso]);

  useEffect(() => {
    setIosDraft(dateFromIsoOrNow(valueIso));
  }, [valueIso, iosOpen]);

  const openPicker = (): void => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'date',
        value: dateFromIsoOrNow(valueIso),
        onChange: (dateEvent, date) => {
          if (dateEvent.type !== 'set' || !date) return;
          DateTimePickerAndroid.open({
            mode: 'time',
            value: date,
            onChange: (timeEvent, time) => {
              if (timeEvent.type !== 'set' || !time) return;
              const merged = new Date(date);
              merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
              onChangeIso(merged.toISOString());
            },
          });
        },
      });
    } else {
      setIosDraft(dateFromIsoOrNow(valueIso));
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
        <CalendarClock size={20} color={theme.colors.textMuted} strokeWidth={2} />
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
              accessibilityLabel="Dismiss date time picker"
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
                borderColor: theme.colors.border,
              }}
            >
              <DateTimePicker
                value={iosDraft}
                mode="datetime"
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
                    onChangeIso(iosDraft.toISOString());
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
