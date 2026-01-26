import { computed } from 'vue';
import { PersianDate } from '../components/utils/modules/core';

interface CalendarItem {
  key: string;
  value: number;
}

export function useCalendar(daysCount: number, startDate: PersianDate) {
  const calendarData: CalendarItem[] = Array.from(
    { length: daysCount },
    (_, i) => {
      const d = startDate.clone().addDay(i);

      return {
        key: `${d.year()}-${d.month()}-${d.date()}`,
        value: Math.floor(Math.random() * 9000) + 1000,
      };
    },
  );

  const calendarMap = computed(
    () => new Map(calendarData.map((item) => [item.key, item])),
  );

  const minValue = computed(() =>
    Math.min(...calendarData.map((item) => item.value)),
  );

  return {
    calendarData,
    calendarMap,
    minValue,
  };
}
