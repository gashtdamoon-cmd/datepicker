import { PersianDate } from '../components/utils/modules/core';

export function useDateUtils() {
  const now = new PersianDate().startOf('day');

  function disablePast(dateMoment: PersianDate): boolean {
    return dateMoment.isBefore(now);
  }

  function isAfterToday(date: string): boolean {
    return new PersianDate().parse(date, 'YYYY-MM-DD').isAfter(now);
  }

  return {
    now,
    disablePast,
    isAfterToday,
  };
}
