<script lang="ts" setup>
  import DatePicker from './components/DatePicker.vue';
  import { ref, computed } from 'vue';
  import { useDateUtils } from './composables/useDateUtils';
  import { useCalendar } from './composables/useCalendar';

  /* prevent disable past days or not */
  const disablePastDays = true;
  const { now, disablePast, isAfterToday } = useDateUtils(disablePastDays);
  /* suggested dates */
  const suggestedDates = ref<string[]>([
    '1404-12-1',
    '1404-12-2',
    '1404-12-3',
    '1404-12-4',
    '1404-11-22',
    '1404-11-23',
    '1404-11-24',
    '1404-12-19',
    '1404-12-20',
    '1404-12-21',
    '1404-12-22',
  ]);
  const vacations = ref<string[]>(['1404-11-15', '1404-11-22', '1404-12-20']);
  /* symbols */
  const symbols = computed(() =>
    [
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
      },
    ].filter((item) => isAfterToday(item.date)),
  );
  /* calendar */
  const { calendarMap, minValue } = useCalendar(60, now);
</script>
<!-- test -->
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
      :tool-tip="{ enabled: true, labels: ['شروع', 'پایان'] }"
      :prevent-same-dates="{
        enabled: true,
      }"
      :min-stay="{
        enabled: true,
        duration: 5,
      }"
      :vacations="vacations"
      :disable-past-days="disablePastDays"
      :suggested-dates="suggestedDates"
      :symbols="symbols"
      :pricing="{
        show: true,
        byDay: calendarMap,
        min: {
          value: minValue,
          color: '#ff0097',
        },
      }"
      :disable="disablePast"
    ></DatePicker>
    <DatePicker
      alt-name="rest"
      label="تقویم سینگل"
      mode="single"
      :vacations="vacations"
      :suggested-dates="suggestedDates"
      :pricing="{
        show: true,
        byDay: calendarMap,
        min: {
          value: minValue,
          color: '#ff0097',
        },
      }"
      color="green"
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
