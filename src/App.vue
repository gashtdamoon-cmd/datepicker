<script lang="ts" setup>
  import DatePicker from './components/DatePicker.vue';
  import { PersianDate } from './components/utils/modules/core';
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  const windowWidth = ref(window.innerWidth);
  const modal = computed(() => windowWidth.value < 768);
  const onResize = () => {
    windowWidth.value = window.innerWidth;
  };
  onMounted(() => {
    window.addEventListener('resize', onResize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
  });
  const now = new PersianDate();
  ['hour', 'minute', 'second', 'millisecond'].forEach((key) => {
    now.d[key] = 0;
  });
  function disablePast(dateMoment: PersianDate) {
    return dateMoment.isBefore(now); // true یعنی این تاریخ غیرفعال بشه
  }
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
      locale="en,fa"
      mode="range"
      :modal="modal"
      :showPrice="true"
      placeholder="بازه اقامت"
      arrivalDateText="شروع اقامت"
      departureDateText="پایان اقامت"
      Submit-text="ثبت"
      :disable="disablePast"
    ></DatePicker>
    <DatePicker
      alt-name="rest"
      mode="single"
      :modal="modal"
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
