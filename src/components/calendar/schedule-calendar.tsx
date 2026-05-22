import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { Bell, CalendarCheck, ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import type { ScheduleEvent, ScheduleViewMode } from '../../domain/schedule-event.types';
import { useScheduleFeedQuery } from '../../query/jt-queries';
import { parseAxiosApiError } from '../../services/api';
import { useAppTheme } from '../../theme';
import { Button, Card, EmptyState, ErrorState, LoadingState, Typography } from '../ui';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function eventsForDay(events: ScheduleEvent[], day: Date): ScheduleEvent[] {
  return events.filter((event) => isSameDay(event.start, day));
}

type Props = {
  enabled: boolean;
  onEventPress: (event: ScheduleEvent) => void;
};

function ViewModeToggle(props: {
  viewMode: ScheduleViewMode;
  onChange: (mode: ScheduleViewMode) => void;
}): ReactElement {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
        borderRadius: theme.radii.lg,
        padding: 4,
        gap: 4,
      }}
    >
      {(['month', 'week'] as const).map((mode) => {
        const active = props.viewMode === mode;
        return (
          <Pressable
            key={mode}
            accessibilityRole="button"
            onPress={() => props.onChange(mode)}
            style={{
              borderRadius: theme.radii.md,
              paddingHorizontal: theme.space.md,
              paddingVertical: theme.space.xs,
              backgroundColor: active ? theme.colors.accent : 'transparent',
            }}
          >
            <Typography
              variant="caption"
              style={{
                fontWeight: '700',
                textTransform: 'capitalize',
                color: active ? theme.colors.onAccent : theme.colors.textMuted,
              }}
            >
              {mode}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

function EventDot(props: { kind: ScheduleEvent['kind'] }): ReactElement {
  return (
    <View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: props.kind === 'interview' ? '#f59e0b' : '#8b5cf6',
      }}
    />
  );
}

function DayAgenda(props: {
  events: ScheduleEvent[];
  onEventPress: (event: ScheduleEvent) => void;
}): ReactElement {
  const { theme } = useAppTheme();

  if (props.events.length === 0) {
    return (
      <Typography variant="bodySmall" muted>
        Nothing scheduled for this day.
      </Typography>
    );
  }

  return (
    <View style={{ gap: theme.space.sm }}>
      {props.events.map((event) => {
        const isInterview = event.kind === 'interview';
        return (
          <Pressable
            key={event.id}
            accessibilityRole="button"
            onPress={() => props.onEventPress(event)}
            style={{
              flexDirection: 'row',
              gap: theme.space.md,
              borderWidth: 1,
              borderColor: theme.colors.borderMuted,
              borderRadius: theme.radii.lg,
              padding: theme.space.md,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: theme.radii.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isInterview ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              }}
            >
              {isInterview ? (
                <CalendarCheck size={16} color="#d97706" />
              ) : (
                <Bell size={16} color="#7c3aed" />
              )}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Typography
                variant="bodySmall"
                style={{
                  fontWeight: '600',
                  textDecorationLine: event.completed ? 'line-through' : undefined,
                  opacity: event.completed ? 0.6 : 1,
                }}
                numberOfLines={2}
              >
                {event.title}
              </Typography>
              {event.subtitle ? (
                <Typography variant="caption" muted numberOfLines={1}>
                  {event.subtitle}
                </Typography>
              ) : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Clock size={12} color={theme.colors.textMuted} />
                <Typography variant="caption" muted>
                  {format(event.start, 'h:mm a')} · {isInterview ? 'Interview' : 'Reminder'}
                </Typography>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ScheduleCalendar(props: Props): ReactElement {
  const { theme } = useAppTheme();
  const feedQuery = useScheduleFeedQuery(props.enabled);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('month');
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const events = useMemo(() => feedQuery.data ?? [], [feedQuery.data]);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(cursorDate);
    const monthEnd = endOfMonth(cursorDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursorDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(cursorDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(cursorDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [cursorDate]);

  const selectedDayEvents = useMemo(
    () => eventsForDay(events, selectedDate),
    [events, selectedDate],
  );

  const headerLabel =
    viewMode === 'month'
      ? format(cursorDate, 'MMMM yyyy')
      : `Week of ${format(startOfWeek(cursorDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`;

  function goToday(): void {
    const today = new Date();
    setCursorDate(today);
    setSelectedDate(today);
  }

  function goPrevious(): void {
    setCursorDate((current) =>
      viewMode === 'month' ? subMonths(current, 1) : subWeeks(current, 1),
    );
  }

  function goNext(): void {
    setCursorDate((current) =>
      viewMode === 'month' ? addMonths(current, 1) : addWeeks(current, 1),
    );
  }

  if (feedQuery.isPending) {
    return <LoadingState message="Loading your schedule…" />;
  }

  if (feedQuery.isError) {
    return (
      <ErrorState
        message={parseAxiosApiError(feedQuery.error)?.message ?? 'Could not load schedule.'}
        onRetry={() => feedQuery.refetch()}
      />
    );
  }

  return (
    <View style={{ gap: theme.space.lg }}>
      <Card style={{ gap: theme.space.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md }}>
          <View style={{ flex: 1, gap: theme.space.xs }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
              Your schedule
            </Typography>
            <Typography variant="caption" muted>
              Interviews and reminders from your JobTrackr tracker.
            </Typography>
          </View>
          <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.xs }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous period"
              onPress={goPrevious}
              style={{
                width: 36,
                height: 36,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.borderMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={18} color={theme.colors.textPrimary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next period"
              onPress={goNext}
              style={{
                width: 36,
                height: 36,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.borderMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={18} color={theme.colors.textPrimary} />
            </Pressable>
            <Button label="Today" variant="ghost" onPress={goToday} />
          </View>
          <Typography variant="caption" style={{ fontWeight: '600' }}>
            {headerLabel}
          </Typography>
        </View>

        <View style={{ flexDirection: 'row', gap: theme.space.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <EventDot kind="interview" />
            <Typography variant="caption" muted>
              Interview
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <EventDot kind="reminder" />
            <Typography variant="caption" muted>
              Reminder
            </Typography>
          </View>
        </View>

        {viewMode === 'month' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 560 }}>
              <View style={{ flexDirection: 'row', marginBottom: theme.space.sm }}>
                {WEEKDAY_LABELS.map((label) => (
                  <View key={label} style={{ width: 80, alignItems: 'center' }}>
                    <Typography variant="caption" muted style={{ fontWeight: '700' }}>
                      {label}
                    </Typography>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {monthDays.map((day) => {
                  const dayEvents = eventsForDay(events, day);
                  const isSelected = isSameDay(day, selectedDate);
                  const inCurrentMonth = isSameMonth(day, cursorDate);

                  return (
                    <Pressable
                      key={day.toISOString()}
                      accessibilityRole="button"
                      onPress={() => setSelectedDate(day)}
                      style={{
                        width: 80,
                        minHeight: 88,
                        padding: theme.space.xs,
                        borderWidth: 1,
                        borderColor: theme.colors.borderMuted,
                        backgroundColor: isSelected ? `${theme.colors.accent}14` : undefined,
                        opacity: inCurrentMonth ? 1 : 0.45,
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isToday(day) ? theme.colors.accent : undefined,
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            fontWeight: '700',
                            color: isToday(day) ? theme.colors.onAccent : undefined,
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                      </View>
                      <View style={{ marginTop: 4, gap: 2 }}>
                        {dayEvents.slice(0, 2).map((event) => (
                          <View key={event.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <EventDot kind={event.kind} />
                            <Typography variant="caption" numberOfLines={1} style={{ flex: 1, fontSize: 10 }}>
                              {format(event.start, 'h:mm a')} {event.title}
                            </Typography>
                          </View>
                        ))}
                        {dayEvents.length > 2 ? (
                          <Typography variant="caption" muted style={{ fontSize: 10 }}>
                            +{dayEvents.length - 2} more
                          </Typography>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
              {weekDays.map((day) => {
                const dayEvents = eventsForDay(events, day);
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <Pressable
                    key={day.toISOString()}
                    accessibilityRole="button"
                    onPress={() => setSelectedDate(day)}
                    style={{
                      width: 120,
                      minHeight: 140,
                      borderWidth: 1,
                      borderColor: isSelected ? theme.colors.accent : theme.colors.borderMuted,
                      borderRadius: theme.radii.lg,
                      padding: theme.space.sm,
                      backgroundColor: isSelected ? `${theme.colors.accent}10` : undefined,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: theme.space.sm,
                      }}
                    >
                      <Typography variant="caption" muted style={{ fontWeight: '700' }}>
                        {format(day, 'EEE')}
                      </Typography>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isToday(day) ? theme.colors.accent : undefined,
                        }}
                      >
                        <Typography
                          variant="caption"
                          style={{
                            fontWeight: '700',
                            color: isToday(day) ? theme.colors.onAccent : undefined,
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                      </View>
                    </View>
                    <View style={{ gap: 4 }}>
                      {dayEvents.length === 0 ? (
                        <Typography variant="caption" muted>
                          —
                        </Typography>
                      ) : (
                        dayEvents.map((event) => (
                          <Typography key={event.id} variant="caption" numberOfLines={2}>
                            {format(event.start, 'h:mm a')} {event.title}
                          </Typography>
                        ))
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}

        {events.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Nothing scheduled yet"
            description="Add interviews from Applications or reminders from the Reminders tab."
          />
        ) : null}
      </Card>

      <Card style={{ gap: theme.space.md }}>
        <View style={{ gap: theme.space.xs }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Typography>
          <Typography variant="caption" muted>
            {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'item' : 'items'} scheduled
          </Typography>
        </View>
        <DayAgenda events={selectedDayEvents} onEventPress={props.onEventPress} />
      </Card>
    </View>
  );
}
