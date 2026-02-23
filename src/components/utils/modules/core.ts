import PersianDate from '@alireza-ab/persian-date';
import { Obj, Units, Langs, Shortcuts } from './types';
import { Translations } from './lang'
import { CalendarList } from './calendar'

export const Core = {
  langs: {
    fa: {
      language: CalendarList.solar.language,
      calendar: CalendarList.solar.calendar,
      weekdays: CalendarList.solar.weekdays,
      months: CalendarList.solar.months,
      dir: CalendarList.solar.dir,
      inputFormat: CalendarList.solar.inputFormat,
      displayFormat: CalendarList.solar.displayFormat,
      // translation 
      translations: Translations.fa,
    },
    en: {
      language: CalendarList.gregorian.language,
      calendar: CalendarList.gregorian.calendar,
      weekdays: CalendarList.gregorian.weekdays,
      months: CalendarList.gregorian.months,
      dir: CalendarList.gregorian.dir,
      inputFormat: CalendarList.gregorian.inputFormat,
      displayFormat: CalendarList.gregorian.displayFormat,
      // translation 
      translations: Translations.en,
    },
    ar: {
      language: CalendarList.gregorian.language,
      calendar: CalendarList.gregorian.calendar,
      weekdays: CalendarList.gregorian.weekdays,
      months: CalendarList.gregorian.months,
      dir: CalendarList.gregorian.dir,
      inputFormat: CalendarList.gregorian.inputFormat,
      displayFormat: CalendarList.gregorian.displayFormat,
      // translation 
      translations: Translations.ar,
    },
  } as Langs,
  mergeObject: function (original: Obj, changed: Obj | undefined): Obj {
    const newObject = JSON.parse(JSON.stringify(original));
    for (const key in changed) {
      if (
        original[key] &&
        Object.prototype.toString.call(changed[key]) === '[object Object]'
      )
        newObject[key] = this.mergeObject(
          original[key] as Obj,
          changed[key] as Obj,
        );
      else newObject[key] = changed[key];
    }
    return newObject;
  },
  setStyles: function (styles: Obj | undefined, root: HTMLElement): void {
    for (const name in styles) {
      root.style.setProperty('--' + name, styles[name] as string);
    }
  },
  setColor: function (color: string | undefined, root: HTMLElement): void {
    if (!color) return;
    let colors = {};
    switch (color) {
      case 'red':
        colors = {
          'suggested-date-color': '#c7004c1a',
          'primary-color': '#c7004c',
          'secondary-color': '#ffaaaa',
          'in-range-background': '#ffd2d2',
        };
        break;
      case 'pink':
        colors = {
          'suggested-date-color': '#e56ab31a',
          'primary-color': '#e56ab3',
          'secondary-color': '#ef87be',
          'in-range-background': '#fcbcd7',
        };
        break;
      case 'orange':
        colors = {
          'suggested-date-color': '#ffa5001a',
          'primary-color': '#ffa500',
          'secondary-color': '#ffbe47',
          'in-range-background': '#ffe0a6',
        };
        break;
      case 'green':
        colors = {
          'suggested-date-color': '#38a1691a',
          'primary-color': '#38a169',
          'secondary-color': '#89dda3',
          'in-range-background': '#c6f6d5',
        };
        break;
      case 'purple':
        colors = {
          'suggested-date-color': '#7825d01a',
          'primary-color': '#7825d0',
          'secondary-color': '#c196ed',
          'in-range-background': '#d4baf3',
        };
        break;
      case 'gray':
        colors = {
          'suggested-date-color': '#4948481a',
          'primary-color': '#494848',
          'secondary-color': '#909090',
          'in-range-background': '#b4b4b4',
        };
        break;
      default:
        break;
    }
    this.setStyles(colors, root);
  },
  getLastUnit: function (
    date: string,
    type: 'time' | 'datetime' | 'date',
  ): Units {
    const unitsCount =
      date.split(/[/ \-.,:\\]/).length + (type == 'time' ? 3 : 0);
    switch (unitsCount) {
      case 1:
        return 'year';
      case 2:
        return 'month';
      case 3:
        return 'date';
      case 4:
        return 'hour';
      case 5:
        return 'minute';
      case 6:
        return 'second';
      default:
        return 'millisecond';
    }
  },
  getShortcuts(
    date: PersianDate,
    part: string,
    translate: Record<string, string>,
  ): Shortcuts {
    const c = (): PersianDate => date.clone();
    switch (part) {
      case 'date-single':
        return {
          [translate.now]: [c()],
          [translate.yesterday]: [c().subDay()],
          [translate.tomorrow]: [c().addDay()],
          [translate.firstOfWeek]: [c().startOf('week')],
          [translate.lastOfWeek]: [c().endOf('week')],
        };
      case 'date-range':
        return {
          [translate.thisWeek]: [c().startOf('week'), c().endOf('week')],
          [translate.prevWeek]: [
            c().subWeek().startOf('week'),
            c().subWeek().endOf('week'),
          ],
          [translate.nextWeek]: [
            c().addWeek().startOf('week'),
            c().addWeek().endOf('week'),
          ],
          [translate.thisMonth]: [c().startOf('month'), c().endOf('month')],
          [translate.prevMonth]: [
            c().subMonth().startOf('month'),
            c().subMonth().endOf('month'),
          ],
          [translate.nextMonth]: [
            c().addMonth().startOf('month'),
            c().addMonth().endOf('month'),
          ],
        };
      case 'time-single':
        return {
          [translate.now]: [c()],
          [translate.oneHourAgo]: [c().subHour()],
          [translate.oneHourLater]: [c().addHour()],
          [translate.midnight]: [c().startOf('date')],
          [translate.midday]: [c().time(12)],
        };
      case 'time-range':
        return {
          [translate.thisHour]: [c().startOf('hour'), c().endOf('hour')],
          [translate.prevHour]: [
            c().subHour().startOf('hour'),
            c().subHour().endOf('hour'),
          ],
          [translate.nextHour]: [
            c().addHour().startOf('hour'),
            c().addHour().endOf('hour'),
          ],
          [translate.allDay]: [c().startOf('date'), c().endOf('date')],
        };
      default:
        return {};
    }
  },
  isString: function (val: unknown): boolean {
    return typeof val == 'string';
  },
  isNumber: function (val: unknown): boolean {
    return typeof val == 'number';
  },
  isFunction: function (val: unknown): boolean {
    return typeof val == 'function';
  },
  isPersianDate: function (val: unknown): boolean {
    return PersianDate.isPersianDate(val);
  },
};

export { PersianDate };
