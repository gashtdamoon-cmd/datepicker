<script lang="ts" setup>
  import DatePicker from './components/DatePicker.vue';
  import { PersianDate } from './components/utils/modules/core';
  import { ref, computed } from 'vue';
  const now = new PersianDate().startOf('day');
  const suggestedDates = ref([
    '1404-10-24',
    '1404-10-25',
    '1404-10-26',
    '1404-10-27',
    '1404-11-8',
    '1404-11-9',
    '1404-11-10',
    '1404-11-19',
    '1404-11-20',
    '1404-11-21',
    '1404-11-22',
  ]);
  const symbols = computed(()=>{
    let tmp = [
      {
        icon: {
          type: 'img',
          src: '/images/icons/icons8-discount.gif',
          width: 20,
          height: 20,
        },
        describtion: 'تخفیف کلون',
        date: '1404-10-26',
      },
      {
        icon: {
          type: 'img',
          src: '/images/icons/icons8-fire.gif',
          width: 20,
          height: 20,
        },
        describtion: '4شنبه سوزی',
        date: '1404-12-27',
      },
      {
        icon: {
          type: 'symbol',
          text: 'آیکن3',
        },
        describtion: 'توضیح آیکن3',
        date: '1404-12-19',
      },
      {
        icon: {
          type: 'symbol',
          text: 'آیکن4',
        },
        describtion: 'توضیح آیکن4',
        date: '1404-11-15',
      }
    ];
    tmp = tmp.filter(item => {
      const itemDate = new PersianDate().parse(item.date, 'YYYY-MM-DD');
      return itemDate.isAfter(now);
    });
    return tmp;
  });
  function disablePast(dateMoment: PersianDate) {
    return dateMoment.isBefore(now); // true یعنی این تاریخ غیرفعال بشه
  }
  function generateCalendarData(
    daysCount: number,
    startPersianDate: PersianDate,
  ) {
    return Array.from({ length: daysCount }, (_, i) => {
      const d = startPersianDate.clone().addDay(i);

      const year = d.year();
      const month = d.month();
      const day = d.date();

      return {
        key: `${year}-${month}-${day}`,
        value: Math.floor(Math.random() * 9000) + 1000,
      };
    });
  }
  const calendarData = generateCalendarData(60, now);
  const calendarMap = computed(
    () => new Map(calendarData.map((item) => [item.key, item])),
  );
  const minValue = computed(() =>
    Math.min(...calendarData.map((item) => item.value)),
  );
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3rem;
      flex-wrap: wrap;
    "
  >
    <DatePicker
      alt-name="rest"
      label="تقویم بازه‌ای"
      mode="range"
      :modal="modal"
      :windowWidth="windowWidth"
      site-language="ar"
      :selected-date-tool-tip="{
        display: true,
        values: ['ورود', 'خروج'],
      }"
      :dates-not-be-same="{
        value: true,
        massage: 'تاریخ ورود و خروج، نباید  یکسان باشند',
      }"
      :minimum-duration-stay="{
        duration: 5,
        massage: `خطای حداقل مدت اقامت. حداقل مدت اقامت مجاز برابره با 5 روز`,
      }"
      :suggested-dates="suggestedDates"
      :symbols="symbols"
      :showPrice="true"
      :dayPrice="calendarMap"
      :minNumber="minValue"
      :disable="disablePast"
    ></DatePicker>
    <DatePicker
      alt-name="rest"
      label="تقویم سینگل"
      mode="single"
      :modal="modal"
      :windowWidth="windowWidth"
      :suggested-dates="suggestedDates"
      :selected-date-tool-tip="{
        display: true,
        values: ['ورود', 'خروج'],
      }"
      :showVacation="false"
      :showPrice="true"
      placeholder="تاریخ رفت"
      arrivalDateText="رفت"
      departureDateText=""
      nowBtnText="الآن"
      langBtnText="تغییر نوع تقویم"
      todayText="امروز"
      color="green"
      :disable="disablePast"
    ></DatePicker>
  </div>
</template>

<style>
  @import url('./components/assets/fonts/vazirmatn/misc/Farsi-Digits-Non-Latin/Vazirmatn-FD-NL-font-face.css');
  @import url('./components/assets/fonts/vazirmatn/misc/UI/Vazirmatn-UI-font-face.css');
  #app {
    font-family:
      Vazirmatn FD NL,
      Vazirmatn UI;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
