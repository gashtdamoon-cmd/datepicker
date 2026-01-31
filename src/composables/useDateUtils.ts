import { PersianDate } from '../components/utils/modules/core';

export function useDateUtils(disablePastDays: boolean) {
  const now = new PersianDate().startOf('day');

  function disablePast(dateMoment: PersianDate): boolean {
    if(disablePastDays){
      return dateMoment.isBefore(now);
    }else{
      return false;
    }
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
