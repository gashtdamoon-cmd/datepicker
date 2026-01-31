import PersianDate from '@alireza-ab/persian-date';
import { Obj, Units, Langs, Shortcuts } from './types';

export const Core = {
  langs: {
    fa: {
      language: 'persian',
      calendar: 'jalali',
      weekdays: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
      months: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
      dir: {
        input: 'rtl',
        picker: 'rtl',
      },
      translations: {
        placeholder: 'تاریخ (ورود و خروج)',
        label: 'شمسی',
        text: 'ماه میلادی',
        symbolsGuide: 'راهنمای نمادها',
        prevMonth: 'ماه قبل',
        nextMonth: 'ماه بعد',
        now: 'برو به امروز',
        submit: 'تایید',
        arrivalDate: 'ورود',
        departureDate: 'خروج',
        /* use in shourcuts */
        // date-single
        today: 'امروز',
        yesterday: 'دیروز',
        tomorrow: 'فردا',
        firstOfWeek: 'اول هفته',
        lastOfWeek: 'آخر هفته',
        // date-range
        thisWeek: 'این هفته',
        prevWeek: 'هفته قبل',
        nextWeek: 'هفته بعد',
        thisMonth: 'این ماه',
        // time-single
        oneHourAgo: 'یک ساعت قبل',
        oneHourLater: 'یک ساعت بعد',
        night: 'شب',
        midnight: 'نیمه شب',
        day: 'روز',
        midday: 'نیمروز',
        // time-range
        thisHour: 'این ساعت',
        prevHour: 'ساعت قبل',
        nextHour: 'ساعت بعد',
        allDay: 'تمام روز',
        // range-error-massage
        datesNotBeSame: 'تاریخ ابتدا و انتهای بازه نباید یکسان باشند',
        minimumDurationStay: 'حداقل مدت بازه انتخابی مجاز برابر است با:',
        // toolTip
        selectedDateToolTip: ['رفت', 'برگشت'],
      },
      inputFormat: '',
      displayFormat: '',
    },
    en: {
      language: 'english',
      calendar: 'gregorian',
      weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      dir: {
        input: 'rtl',
        picker: 'ltr',
      },
      translations: {
        placeholder: 'Date (in and out)',
        label: 'میلادی',
        text: 'jalali month',
        symbolsGuide: 'symbols guide',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        now: 'Go to today',
        submit: 'Confirm',
        arrivalDate: 'dateIn',
        departureDate: 'dateOut',
        /* use in shourcuts */
        // date-single
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        firstOfWeek: 'First of Week',
        lastOfWeek: 'Last of Week',
        // date-range
        thisWeek: 'This Week',
        prevWeek: 'Previous Week',
        nextWeek: 'Next Week',
        thisMonth: 'This Month',
        // time-single
        oneHourAgo: 'One Hour ago',
        oneHourLater: 'One Hour later',
        night: 'Night',
        midnight: 'Midnight',
        day: 'Day',
        midday: 'Midday',
        // time-range
        thisHour: 'This Hour',
        prevHour: 'Previous Hour',
        nextHour: 'Next Hour',
        allDay: 'All Day',
        // range-error-massage
        datesNotBeSame: 'start & end dates not be same',
        minimumDurationStay: 'minimum selected range date is equal to:',
        // toolTip
        selectedDateToolTip: ['Went', 'Returned'],
      },
      inputFormat: '',
      displayFormat: '',
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
