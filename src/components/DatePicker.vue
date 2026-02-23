<template>
  <div
    ref="root"
    :class="[
      'pdp',
      { 'pdp-range': mode === 'range' },
      { 'pdp-modal': modal },
      { 'pdp-dual': dualInput },
      lang.dir.input,
    ]"
  >
    <slot name="before">
      <label v-if="label" :for="attrs.firstInput.id" v-bind="attrs.label">
        {{ label }}
      </label>
    </slot>
    <div v-bind="attrs.div">
      <template v-for="(input, index) in inputs" :key="input"
        ><div
          v-if="!$slots.hasOwnProperty('icon') || $slots?.icon?.()?.length"
          :key="`icon-${input}`"
          :class="[
            'pdp-icon',
            { 'pdp-pointer': ['all', 'icon'].includes(clickOn) },
            { 'pdp-inside': iconInside },
          ]"
          @click="showPicker('icon', index)"
        >
          <slot name="icon">
            <PDPIcon :icon="type" width="23" height="23"></PDPIcon>
          </slot>
        </div>
        <div class="fieldContainer" @click="showPicker('input', index)">
          <span ref="calendarPlaceHolder" class="placeHolder">
            {{ placeholder ?? lang.translations.placeholder }}
          </span>
          <div ref="selectedDatesText" class="selectedDatesText hidden">
            <div
              v-if="mode == 'range' && selectedDates.length == 2"
              class="truncate max-w-[200px]"
              :title="`${arrivalDateText ?? lang.translations.arrivalDate}:  ${selectedDates[0].toString(formats.display)}  |  ${departureDateText ?? lang.translations.departureDate}:  ${selectedDates[1].toString(formats.display)}`"
            >
              {{
                `${arrivalDateText ?? lang.translations.arrivalDate}:  ${selectedDates[0].toString(formats.display)}  |  ${departureDateText ?? lang.translations.departureDate}:  ${selectedDates[1].toString(formats.display)}`
              }}
            </div>
            <div
              v-if="mode == 'single' && selectedDates.length == 1"
              class="truncate max-w-[200px]"
              :title="`${arrivalDateText ?? lang.translations.arrivalDate}:  ${selectedDates[0].toString(formats.display)}`"
            >
              {{
                `${arrivalDateText ?? lang.translations.arrivalDate}:  ${selectedDates[0].toString(formats.display)}`
              }}
            </div>
          </div>
          <input
            ref="inputsRef"
            v-model="displayValue[index]"
            autocomplete="off"
            v-bind="attrs[input]"
            readonly="true"
            @keydown="selectWithArrow"
          /><button
            v-if="clearable"
            :key="`clear-${input}`"
            class="pdp-clear"
            type="button"
            @click="clear(input)"
          >
            <slot name="clear"><PDPIcon icon="clear"></PDPIcon></slot>
          </button>
        </div>
      </template>
    </div>
    <slot name="after"></slot>
    <PDPAlt
      v-if="attrs.alt.name"
      :name="attrs.alt.name"
      :format="formats.alt"
      :dates="submitedValue"
    />
    <div v-if="showDatePicker">
      <div class="pdp-overlay" @click="hideDatePicker()"></div>
      <div v-bind="attrs.picker" ref="pdpPicker">
        <div class="pdp-auto">
          <div v-if="type.includes('date')">
            <ul v-show="showMonthSelect" class="pdp-select-month">
              <li
                v-for="(month, index) in months"
                :key="index"
                :class="[
                  { selected: month.selected },
                  { disabled: month.disabled },
                ]"
                @click="changeSelectedMonth(index)"
              >
                {{ month.label }}
              </li>
            </ul>
            <ul
              v-show="showYearSelect"
              ref="pdpSelectYear"
              class="pdp-select-year"
            >
              <li
                v-for="(year, index) in years"
                :key="index"
                :class="{ selected: onDisplay.year() == year }"
                @click="changeSelectedYear(year)"
              >
                {{ year }}
              </li>
            </ul>
          </div>
          <div v-if="type.includes('date')" class="pdp-header md:h-[109px]">
            <div v-if="locale.includes(',')" class="top">
              <button
                v-if="checkDate(core, 'date')"
                class="pdp-today boldTitle"
                type="button"
                :tabindex="tabIndex"
                @click="goToToday"
              >
                {{ currentDayBtnText ?? lang.translations.now }}
              </button>
              <button
                v-if="
                  symbols.length == 0 ||
                  (symbols.length > 0 && documentWidth >= 768)
                "
                type="button"
                :tabindex="tabIndex"
                :class="[
                  { changeLocaleBtn: color == undefined },
                  { ltr: defaultLang == 'en' },
                ]"
                :style="
                  !ableToChangeCalendar
                    ? 'filter: grayscale(1);cursor: not-allowed;'
                    : null
                "
                @click="
                  () => {
                    if (ableToChangeCalendar) changeLocale();
                  }
                "
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 11.5V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22H12.5M21 10H3M16 2V6M8 2V6M18 21V15M15 18H21"
                    :stroke="color == undefined ? '#2E90FA' : ''"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ calendarTypeChangeBtnText ?? lang.translations.text }}
              </button>
              <img
                v-if="symbols.length > 0 && documentWidth < 768"
                ref="verticalDotsBtn"
                src="/images/icons/dots-vertical.svg"
                alt="dots-vertical"
                class="dotsMenu"
                @click="showMoreBox()"
              />
            </div>
            <ul
              v-if="symbols.length > 0 && documentWidth < 768"
              ref="moreBox"
              class="moreBox hideBox"
            >
              <li
                :class="[
                  { 'text-left': defaultLang == 'en' },
                  { rtl: defaultLang != 'en' },
                ]"
              >
                <button
                  type="button"
                  :tabindex="tabIndex"
                  :class="[{ changeLocaleBtn: color == undefined }]"
                  :style="
                    !ableToChangeCalendar
                      ? 'filter: grayscale(1);cursor: not-allowed;'
                      : null
                  "
                  @click="
                    () => {
                      if (ableToChangeCalendar) changeLocale();
                    }
                  "
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 11.5V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22H12.5M21 10H3M16 2V6M8 2V6M18 21V15M15 18H21"
                      :stroke="color == undefined ? '#2E90FA' : ''"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ calendarTypeChangeBtnText ?? lang.translations.text }}
                </button>
              </li>
              <li
                ref="symbolsGuideBtn"
                :class="['symbolsGuideBtn', { rtl: defaultLang != 'en' }]"
                @click="showSymbolsExplanation()"
              >
                <div class="infoIcon">!</div>
                {{ symbolsGuide ?? lang.translations.symbolsGuide }}
              </li>
            </ul>
            <div class="bottom max-md:hidden h-[50px]">
              <button
                tabindex="-1"
                type="button"
                :class="[
                  'pdp-arrow',
                  {
                    disabled: shouldPrevent,
                  },
                ]"
                :title="lang.translations.prevMonth"
                :disabled="shouldPrevent"
                @click="changeSelectedMonth('sub')"
              >
                <slot name="right-arrow"
                  ><PDPArrow
                    direction="right"
                    width="10"
                    height="10"
                    :inverse="lang.dir.picker == 'ltr'"
                  ></PDPArrow
                ></slot>
              </button>
              <transition :name="transitionName" mode="out-in">
                <div :key="currentMonthKey">
                  <div v-for="(item, i) in columnCount" :key="i">
                    <button
                      class="pdp-month boldTitle"
                      type="button"
                      tabindex="-1"
                      @click="showPart('month')"
                    >
                      {{ months[onDisplay.clone().addMonth(i).month()].label }}
                    </button>
                    <button
                      class="pdp-year boldTitle"
                      type="button"
                      tabindex="-1"
                      @click="showPart('year')"
                    >
                      {{ onDisplay.clone().addMonth(i).year() }}
                    </button>
                  </div>
                </div>
              </transition>
              <button
                tabindex="-1"
                type="button"
                :class="[
                  'pdp-arrow',
                  {
                    disabled: !checkDate(onDisplay.clone().addMonth(), 'month'),
                  },
                ]"
                :title="lang.translations.nextMonth"
                @click="changeSelectedMonth('add')"
              >
                <slot name="left-arrow"
                  ><PDPArrow
                    direction="left"
                    width="10"
                    height="10"
                    :inverse="lang.dir.picker == 'ltr'"
                  ></PDPArrow
                ></slot>
              </button>
            </div>
          </div>
          <div ref="pdpMain" class="pdp-main" @scroll="changeMonth()">
            <div v-if="type.includes('date')" class="pdp-date">
              <template v-for="(item, i) in columnCount" :key="i">
                <transition :name="transitionName" mode="out-in">
                  <div :key="currentMonthKey" class="md:w-[300px] lg:w-[340px]">
                    <div class="pdp-header md:hidden">
                      <div class="bottom">
                        <div>
                          <div>
                            <button
                              class="pdp-month boldTitle"
                              type="button"
                              tabindex="-1"
                              @click="showPart('month')"
                            >
                              {{
                                months[onDisplay.clone().addMonth(i).month()]
                                  .label
                              }}
                            </button>
                            <button
                              class="pdp-year boldTitle"
                              type="button"
                              tabindex="-1"
                              @click="showPart('year')"
                            >
                              {{ onDisplay.clone().addMonth(i).year() }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="pdp-column" :data-column="i">
                      <div class="pdp-week textLightGray">
                        <div
                          v-for="(weekday, index) in lang.weekdays"
                          :key="index"
                          class="pdp-weekday"
                        >
                          {{ weekday }}
                        </div>
                      </div>
                      <div class="days textDominant">
                        <div
                          v-for="(week, wIndex) in monthDays[i]"
                          :key="wIndex"
                          class="max-md:flex max-md:justify-between h-[50px]"
                        >
                          <div
                            v-for="day in week"
                            :key="day.raw ? day.raw.toString() : undefined"
                            :class="[
                              'pdp-day',
                              { empty: day.empty },
                              { friday: day.friday && color != undefined },
                              {
                                'friday textError':
                                  day.friday && color == undefined,
                              },
                              {
                                'vacation friday':
                                  vacations.length > 0 &&
                                  vacations.includes(dayToKey(day)) &&
                                  color != undefined,
                              },
                              {
                                'vacation textError':
                                  vacations.length > 0 &&
                                  vacations.includes(dayToKey(day)) &&
                                  color == undefined,
                              },
                              { today: day.today },
                              { 'start-range': day.startRange },
                              { 'end-range': day.endRange },
                              { disabled: day.disabled },
                              { 'in-range': day.inRange },
                              {
                                'suggested-dates':
                                  !day.disabled &&
                                  suggestedDates.length > 0 &&
                                  suggestedDates.includes(dayToKey(day)) &&
                                  ((mode == 'single' &&
                                    selectedDates.length == 0) ||
                                    (mode == 'range' &&
                                      selectedDates.length <= 1)),
                              },
                            ]"
                            :value="day.val"
                            :style="
                              !toolTip.enabled
                                ? 'border-radius: 50% !important;'
                                : null
                            "
                            @click="selectDate(day.raw, 'date')"
                          >
                            <div
                              v-if="!day.disabled && resolvedToolTip.enabled"
                              ref="tooltip"
                              :class="[
                                'tooltip',
                                { showSection: day.startRange || day.endRange },
                              ]"
                            >
                              {{ getTooltipText(day) }}
                            </div>
                            <template v-for="symbol in symbols">
                              <div
                                v-if="
                                  symbols.length > 0 &&
                                  symbol.icon.type == 'img' &&
                                  symbol.date == dayToKey(day)
                                "
                                :key="symbol.icon.src"
                                class="symbolWrapper"
                              >
                                <img
                                  :src="symbol.icon.src"
                                  alt=""
                                  :width="symbol.icon.width"
                                  :height="symbol.icon.height"
                                />
                              </div>
                            </template>
                            <div :class="[{ 'text-xs': day.today }]">
                              {{
                                day.today
                                  ? (todayText ?? lang.translations.today)
                                  : day.val
                              }}
                            </div>
                            <div
                              v-if="
                                pricing.show &&
                                !day.disabled &&
                                pricing.byDay != null &&
                                pricing.byDay.get(dayToKey(day))
                              "
                              :class="[
                                'dayPrice',
                                {
                                  textSuccess:
                                    pricing.min != null &&
                                    pricing.min.value ==
                                      pricing.byDay.get(dayToKey(day)).value,
                                },
                              ]"
                              :style="
                                pricing.min != null &&
                                pricing.min.color != undefined &&
                                pricing.min.value ==
                                  pricing.byDay.get(dayToKey(day)).value
                                  ? `color: ${pricing.min.color} !important;`
                                  : null
                              "
                            >
                              {{ pricing.byDay.get(dayToKey(day)).value }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </template>
            </div>
            <div v-if="type.includes('time')" class="pdp-time inline">
              <div v-if="type == 'time'" class="pdp-column">
                <div v-for="(c, i) in columnCount" :key="i"></div>
              </div>
              <div
                :class="[
                  'pdp-moment',
                  { 'column-direction': mode == 'range' && columnCount == 1 },
                ]"
              >
                <div
                  v-for="(n, i) in mode == 'range' ? 2 : 1"
                  :key="n"
                  :class="[
                    {
                      disabled:
                        selectedTimes[i] &&
                        (!checkDate(selectedTimes[i], 'time') ||
                          isInDisable(selectedTimes[i])),
                    }, // FIXME: go to method
                  ]"
                >
                  <div class="hour">
                    <button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'hour', 'add')"
                      @mousedown.prevent="startChangeTime(i, 'hour', 'add')"
                      @keydown.enter.prevent="startChangeTime(i, 'hour', 'add')"
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="up-arrow"><PDPArrow></PDPArrow></slot></button
                    >{{
                      selectedTimes[i]
                        ? selectedTimes[i].hour('HH')
                        : core.hour('HH')
                    }}<button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'hour', 'sub')"
                      @mousedown.prevent="startChangeTime(i, 'hour', 'sub')"
                      @keydown.enter.prevent="startChangeTime(i, 'hour', 'sub')"
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="down-arrow"
                        ><PDPArrow direction="down"></PDPArrow
                      ></slot>
                    </button>
                  </div>
                  :
                  <div class="minute">
                    <button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'minute', 'add')"
                      @mousedown.prevent="startChangeTime(i, 'minute', 'add')"
                      @keydown.enter.prevent="
                        startChangeTime(i, 'minute', 'add')
                      "
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="up-arrow"><PDPArrow></PDPArrow></slot></button
                    >{{
                      selectedTimes[i]
                        ? selectedTimes[i].minute('mm')
                        : core.minute('mm')
                    }}<button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'minute', 'sub')"
                      @mousedown.prevent="startChangeTime(i, 'minute', 'sub')"
                      @keydown.enter.prevent="
                        startChangeTime(i, 'minute', 'sub')
                      "
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="down-arrow"
                        ><PDPArrow direction="down"></PDPArrow
                      ></slot>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="symbols.length > 0"
            ref="symbolsExplanation"
            :class="[
              'symbolsExplanation max-md:hideBox',
              { rtl: defaultLang != 'en' },
            ]"
          >
            <ul class="symbols list">
              <li v-for="symbol in symbols" :key="symbol.icon.src" class="item">
                <span v-if="symbol.icon.type == 'img'">
                  <img
                    :src="symbol.icon.src"
                    alt=""
                    :width="symbol.icon.width"
                    :height="symbol.icon.height"
                  />
                </span>
                <span v-else>{{ symbol.icon.text }}</span>
                <span>{{ symbol.describtion }}</span>
              </li>
            </ul>
          </div>
          <ul
            v-if="Object.keys(errorList).length > 0"
            :class="['errors list', { rtl: defaultLang != 'en' }]"
          >
            <li
              v-for="error in Object.keys(errorList)"
              :key="error"
              :id="`ErrorBox-${error}`"
              ref="errorItem"
            >
              <div class="err">
                <div class="box">
                  <div class="infoIcon">!</div>
                  <div>{{ errorList[error] }}</div>
                </div>
                <div class="close" @click="removedError(error)">
                  &times;
                </div>
              </div>
              <div class="barTime"></div>
            </li>
          </ul>
          <div class="pdp-footer rtl">
            <div>
              <slot name="footer"></slot>
              <div>
                <span class="boldTitle">{{
                  arrivalDateText ?? lang.translations.arrivalDate
                }}</span>
                <small v-if="selectedDates[0]" class="smallContent">
                  {{ selectedDates[0].toString(formats.display) }}
                </small>
              </div>
              <div v-if="mode == 'range'">|</div>
              <div v-if="mode == 'range'">
                <span class="boldTitle">{{
                  departureDateText ?? lang.translations.departureDate
                }}</span>
                <small v-if="selectedDates.length == 2" class="smallContent">
                  {{ selectedDates[1].toString(formats.display) }}
                </small>
              </div>
            </div>
            <div class="max-md:min-w-full">
              <button
                v-if="
                  !autoSubmit &&
                  !selectedDates.some((date) => isInDisable(date))
                "
                ref="pdpSubmit"
                class="pdp-submit max-md:min-w-full"
                type="button"
                :tabindex="tabIndex"
                @click="submitDate()"
              >
                {{ submitText ?? lang.translations.submit }}&nbsp;
                <span v-if="selectedDates.length > 1">
                  {{ stayDuration + ' ' + lang.translations.night }}
                </span>
              </button>
            </div>
          </div>
        </div>
        <ul
          v-if="shortcuts && Object.keys(shortcuts).length > 0"
          class="pdp-shortcut"
        >
          <li
            v-for="(dates, name) in shortcuts"
            :key="name"
            :class="{
              selected: !dates.some(
                (date, i) =>
                  !date.isSame(
                    selectedDates[i] && selectedDates[i].toString('datetime'),
                  ),
              ),
            }"
            @click="selectShorcut(dates)"
          >
            {{ name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //TODO: use scoped slots
  //TODO: add time config
  //TODO: add tip for days
  //TODO: test the project with attention and test in nuxt
  //TODO: refactor and write comment --> pay a high attention

  // ************************ Core ************************
  import {
    type PropType,
    ref,
    computed,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
    nextTick,
    watch,
  } from 'vue';
  import { PersianDate, Core } from './utils/modules/core';
  import { CalendarList } from './utils/modules/calendar';
  import { Translations } from './utils/modules/lang';
  // ************************ Types ************************
  import type {
    Obj,
    Attrs,
    Langs,
    RecursivePartial,
    Styles,
    Inputs,
    PickerPlace,
    TypePart,
    CalendarPart,
    Disable,
    // Formats,
    MonthDays,
    Months,
    Shortcuts,
    // DefaultDate,
  } from './utils/modules/types';
  // ************************ Components ************************
  import PDPArrow from './utils/components/PDPArrow.vue';
  import PDPIcon from './utils/components/PDPIcon.vue';
  import PDPAlt from './utils/components/PDPAlt.vue';
  // import { method } from 'cypress/types/bluebird';
  const isClient = typeof window !== 'undefined';
  const props = defineProps({
    /**
     * default language of site
     * @default "fa"
     * @type String
     * @values fa | en | ar
     */
    defaultLang: {
      type: String,
      default: 'fa',
    },
    /**
     * placeholder of calendar field.
     * If not set, the default value from core file is used.
     * @type String
     */
    placeholder: {
      type: String,
    },
    /**
     * arrival date label
     * If not set, the default value from core file is used.
     * @type String
     */
    arrivalDateText: {
      type: String,
    },
    /**
     * departure date label
     * If not set, the default value from core file is used.
     * @type String
     */
    departureDateText: {
      type: String,
    },
    /**
     * current day button label
     * If not set, the default value from core file is used.
     * @type String
     */
    currentDayBtnText: {
      type: String,
    },
    /**
     * changed type of calendar(Jalali to Gregorian or inverse)
     * @default true
     * @type Boolean
     */
    ableToChangeCalendar: {
      type: Boolean,
      default: true,
    },
    /**
     * calendar type change button label
     * If not set, the default value from core file is used.
     * @type String
     */
    calendarTypeChangeBtnText: {
      type: String,
    },
    /**
     * Show symbols guide button label
     * If not set, the default value from core file is used.
     * @type String
     */
    symbolsGuide: {
      type: String,
    },
    /**
     * current day text(today text)
     * If not set, the default value from core file is used.
     * @type String
     */
    todayText: {
      type: String,
    },
    /**
     * date price - show/hide price - min price
     * @default {show:false,byDay:null,min:null}
     * @type Object
     */
    pricing: {
      type: Object,
      default: () => ({
        show: false,
        byDay: null,
        min: null,
      }),
    },
    /**
     * list of days that are vacations. these dates must be with YYYY/jM/jD format (like this: ['1404-12-1','1404-12-2',...]).
     * @type Object
     * @default []
     */
    vacations: {
      type: Array,
      default: () => [],
    },
    /**
     * list of symbols.the structure like this:
     * [{
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
     *  }]
     * @type Object
     * @default []
     */
    symbols: {
      type: Array,
      default: () => [],
    },
    /**
     * list of days that are Suggested to the user. these dates must be with YYYY/jM/jD format (like this: ['1404-12-1','1404-12-2',...]).
     * @type Object
     * @default []
     */
    suggestedDates: {
      type: Array,
      default: () => [],
    },
    /**
     * list of tooltip. the structure like this: {enabled: true, labels: ['شروع', 'پایان']}.
     * if labels not set or not valid, the default value from core file is used.
     * @type Object
     * @default {enabled:false,labels:[]}
     */
    toolTip: {
      type: Object,
      default: () => ({
        enabled: false,
        labels: [],
      }),
    },
    /**
     * preventSameDates error. the structure like this: {enabled: true, message: 'my massage...'}.
     * if message not set, the default value from core file is used.
     * @type Object
     * @default {enabled:false,message:null}
     */
    preventSameDates: {
      type: Object,
      default: () => ({
        enabled: false,
        message: null,
      }),
    },
    /**
     * minStay error. the structure like this: {enabled: true, duration: 5, message: 'my massage...'}.
     * duration must be set & if message not set, the default value from core file is used.
     * @type Object
     * @default {enabled:false,duration:0,message:null}
     */
    minStay: {
      type: Object,
      default: () => ({
        enabled: false,
        duration: 0,
        message: null,
      }),
    },
    /**
     * the format of the model value
     * @type String
     * @see https://alireza-ab.ir/persian-date/formats#
     * @desc default value in "date" type is "YYYY-MM-DD"
     * 		default value in "datetime" type is "YYYY-MM-DD HH:mm"
     * 		default value in "time" type is "HH:mm"
     */
    format: {
      type: String,
    },
    /**
     * the format of the input value
     * @type String
     * @see https://alireza-ab.ir/persian-date/formats#
     * @desc default value equal to the value of "type" prop
     */
    inputFormat: {
      type: String,
    },
    /**
     * the format of the value that shows in the footer of picker
     * @type String
     * @see https://alireza-ab.ir/persian-date/formats#
     * @desc default value in "date" type is "?D ?MMMM"
     * 		default value in "datetime" type is "?D ?MMMM HH:mm"
     * 		default value in "time" type is "HH:mm"
     */
    displayFormat: {
      type: String,
    },
    /**
     * the type of picker
     * @default "date"
     * @type String
     * @values date | time | datetime
     * @since 2.0.0
     */
    type: {
      type: String as PropType<'date' | 'time' | 'datetime'>,
      default: 'date',
      validator: (val: string) => ['date', 'time', 'datetime'].includes(val),
    },
    /**
     * the date of start of the picker
     * @type String
     * @example 1400/7/1 | 1400-7
     */
    from: {
      type: String,
      default: (props: Obj) => (props.type === 'time' ? '' : '1300'),
    },
    /**
     * the date of end of the picker
     * @type String
     * @example 1400/7/1 | 1400-7
     */
    to: {
      type: String,
      default: (props: Obj) => (props.type === 'time' ? '23:59' : '1499'),
    },
    /**
     * show or hide the picker
     * @default false
     * @type Boolean
     */
    show: {
      default: false,
      type: Boolean,
    },
    /**
     * show the picker with click on the some sections
     * @default "all"
     * @type String
     * @values all | input | icon | none
     */
    clickOn: {
      default: 'all',
      type: String as PropType<'all' | 'input' | 'icon' | 'none'>,
      validator: (val: string) =>
        ['all', 'input', 'icon', 'none'].includes(val),
    },
    /**
     * text for label tag
     * @type String
     */
    label: {
      type: String,
    },
    /**
     * number of column
     * @default "{ 576: 3 }"
     * @type Object | Number
     * @desc 1. you can send the number of column
     *  	or send the object of the number of
     *  	column in the breakpoint.
     * 		2. if the breaking point in the object
     * 		is not specified, the default value it's 2
     */
    column: {
      default: () => ({ 576: 3 }),
      type: [Number, Object] as PropType<number | Record<number, number>>,
    },
    /**
     * confirm button text
     * If not set, the default value from core file is used.
     * @type String
     */
    submitText: {
      type: String,
    },
    /**
     * submit when date selected or not
     * @default true
     * @type Boolean
     */
    autoSubmit: {
      default: false,
      type: Boolean,
    },
    /**
     * mode of select date
     * @default "range"
     * @type String
     * @values range | single
     */
    mode: {
      default: 'range',
      type: String as PropType<'single' | 'range'>,
      validator: (val: string) => ['single', 'range'].includes(val),
    },
    /**
     * the locale of datepicker
     * @default "fa"
     * @type String
     * @values fa | en | fa,en | en,fa
     * @desc Except above values, you can add
     *  	the language in "localeConfig" prop and use it.
     * @since 2.0.0
     */
    locale: {
      type: String,
      default: 'fa,en',
    },
    /**
     * user can clear the selected dates or not
     * @default false
     * @type Boolean
     * @since 2.0.0
     */
    clearable: {
      default: false,
      type: Boolean,
    },
    /**
     * prevent to disable past days or not
     * @type Boolean
     */
    disablePastDays: {
      type: Boolean,
    },
    /**
     * disable some dates or time
     * @type [Array, String, Function, RegExp]
     * @since 2.0.0
     */
    disable: {
      type: [Array, String, Function, RegExp] as PropType<Disable>,
    },
    /**
     * the config for locales
     * @type Object
     * @since 2.0.0
     */
    localeConfig: {
      type: Object as PropType<RecursivePartial<Langs>>,
    },
    /**
     * the styles of the picker
     * @type Object
     * @since 2.0.0
     */
    styles: {
      type: Object as PropType<Styles>,
    },
    /**
     * the color of the picker
     * @type String
     * @values red | pink | orange | green | purple | gray
     * @since 2.0.0
     */
    color: {
      type: String as PropType<
        'blue' | 'red' | 'pink' | 'orange' | 'green' | 'purple' | 'gray'
      >,
      validator: (val: string) =>
        ['blue', 'red', 'pink', 'orange', 'green', 'purple', 'gray'].includes(
          val,
        ),
    },
    /**
     * use two input for dispaly
     * @type Boolean
     * @default false
     * @since 2.2.0
     */
    dualInput: {
      type: Boolean,
      default: false,
    },
    /**
     * show icon inside of input
     * @type Boolean
     * @default false
     * @since 2.2.0
     */
    iconInside: {
      type: Boolean,
      default: false,
    },
    /**
     * shortcut for select date and time quickly
     * @type Boolean | Object
     * @since 2.2.0
     */
    shortcut: {
      type: [Boolean, Object] as PropType<boolean | Shortcuts>,
      default: false,
    },
  });
  const emit = defineEmits([
    'open',
    'close',
    'select',
    'submit',
    'clear',
    'update:modelValue',
  ]);

  const core = ref(new PersianDate());
  const onDisplay = ref<PersianDate | undefined>(undefined);
  const fromDate = ref<PersianDate | undefined>(undefined);
  const toDate = ref<PersianDate | undefined>(undefined);
  const slideDirection = ref<string | null>(null); // 'left' | 'right' | null
  const selectedDates = ref<PersianDate[]>([]);
  const confirmSelectedDates = ref<boolean>(false);
  const selectedTimes = ref<PersianDate[]>([]);
  const showDatePicker = ref<boolean>(false);
  const showYearSelect = ref<boolean>(false);
  const showMonthSelect = ref<boolean>(false);
  // const showTopOfInput = ref(false);
  const displayValue = ref<string[]>([]);
  const inputName = ref<Inputs>('firstInput');
  const pickerPlace = ref<PickerPlace>({});
  const documentWidth = ref(isClient ? window.innerWidth : Infinity);
  const langs = ref(Core.langs);
  const entryLocale = ref(props.locale);
  const currentLocale = ref(entryLocale.value.split(',')[0]);
  const interval = ref<ReturnType<typeof setInterval> | null>(null);
  const submitedValue = ref<PersianDate[]>([]);
  const todayObj = ref<PersianDate | object | null>(null);
  const shouldPrevent = ref<boolean>(false);
  const lastScrollTop = ref<number>(0);
  const stayDuration = ref<number | null>(null);
  const errorList = ref<Record<string, string>>({});
  // نگهداری تایمر هر خطا
  const errorTimers = new Map<string, number>();
  const ERROR_DURATION = 5000;
  // start refs
  const root = ref<HTMLElement | null>(null);
  const inputsRef = ref<HTMLElement | null>(null);
  const calendarPlaceHolder = ref<HTMLElement | null>(null);
  const pdpPicker = ref<HTMLElement | null>(null);
  const moreBox = ref<HTMLElement | null>(null);
  const symbolsExplanation = ref<HTMLElement | null>(null);
  const symbolsGuideBtn = ref<HTMLElement | null>(null);
  const verticalDotsBtn = ref<HTMLElement | null>(null);
  const pdpSelectYear = ref<HTMLElement | null>(null);
  const pdpMain = ref<HTMLElement | null>(null);
  const selectedDatesText = ref<HTMLElement | null>(null);
  const pdpSubmit = ref<HTMLElement | null>(null);
  const errorItem = ref<HTMLElement | null>(null);
  // end refs

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    errorTimers.forEach((timer) => clearTimeout(timer));
    errorTimers.clear();
  });
  onBeforeMount(() => {
    langs.value = Core.mergeObject(langs.value, props.localeConfig) as Langs;
  });
  onMounted(() => {
    window.addEventListener('resize', onResize);
    Core.setColor(props.color, root.value);
    Core.setStyles(props.styles, root.value);

    const calendar = lang.value.calendar;
    fromDate.value = core.value
      .clone()
      .parse(defaultDate.value.from)
      .calendar(calendar);
    toDate.value = core.value
      .clone()
      .parse(defaultDate.value.to)
      .endOf(Core.getLastUnit(props.to, props.type))
      .calendar(calendar);
    core.value.calendar(calendar);

    const val = attrs.value.modelValue as string | string[];
    if (val) {
      setDate(val);
    } else {
      const today = core.value.clone();
      if (props.type == 'date') today.startOf('date');
      if (checkDate(today, 'date')) {
        onDisplay.value = today;
      } else {
        onDisplay.value = nearestDate(today).startOf('date');
      }
    }
    window.addEventListener('resize', () => {
      documentWidth.value = window.innerWidth;
      moreBox.value?.classList.add('hideBox');
      moreBox.value?.removeAttribute('style');
      symbolsExplanation.value?.classList.add('max-md:hideBox');
      symbolsExplanation.value?.removeAttribute('style');
    });
    if (props.type != 'date') {
      onDisplay.value!.time(core.value as PersianDate);
    }
    showDatePicker.value = props.show;
    todayObj.value = monthDays.value[0]
      ?.flat()
      ?.find((item) => item.today === true);
    preventChangedMonth();
    document.addEventListener('keyup', (e) => {
      if (
        ['Escape'].includes(e.key) ||
        (window.innerWidth < 768 && ['ArrowLeft', 'ArrowRight'].includes(e.key))
      ) {
        hideDatePicker();
        showYearSelect.value = false;
        showMonthSelect.value = false;
      }
    });
    document.addEventListener('click', (e) => {
      if (documentWidth.value < 768) {
        if (
          e.target != symbolsGuideBtn.value &&
          symbolsExplanation.value != undefined
        ) {
          symbolsExplanation.value.classList.add('max-md:hideBox');
          symbolsExplanation.value.removeAttribute('style');
        }
        if (
          moreBox.value != undefined &&
          !moreBox.value.classList.value.includes('hideBox') &&
          e.target != verticalDotsBtn.value &&
          e.target != moreBox.value &&
          e.target?.offsetParent != moreBox.value &&
          e.target != symbolsExplanation.value
        ) {
          moreBox.value.classList.add('hideBox');
          moreBox.value.removeAttribute('style');
        }
      }
    });

    const default_translations = Translations[props.defaultLang];
    if (!Object.keys(Translations).includes(props.defaultLang)) {
      Core.langs = {
        en: {
          ...CalendarList.gregorian,
          translations: { ...default_translations },
        },
        fa: {
          ...CalendarList.solar,
          translations: { ...default_translations },
        },
      };
      entryLocale.value = 'en,fa';
      currentLocale.value = 'fa';
    } else {
      if (props.defaultLang == 'fa') {
        Core.langs = {
          fa: {
            ...CalendarList.solar,
            translations: { ...default_translations },
          },
          en: {
            ...CalendarList.gregorian,
            translations: { ...default_translations },
          },
        };
        entryLocale.value = 'fa,en';
        currentLocale.value = 'en';
      } else {
        Core.langs = {
          en: {
            ...CalendarList.gregorian,
            translations: { ...default_translations },
          },
          fa: {
            ...CalendarList.solar,
            translations: { ...default_translations },
          },
        };
        entryLocale.value = 'en,fa';
        currentLocale.value = 'fa';
      }
    }
    langs.value = Core.langs;
    changeLocale();
  });

  // start watch
  watch(props.show, (val: boolean) => {
    showDatePicker.value = val;
  });
  watch(props.showDatePicker, (val) => {
    if (val) emit('open');
    else {
      if (!modal.value) document.removeEventListener('scroll', locate);
      emit('close');
    }
  });
  watch(props.from, (val) => {
    fromDate.value!.fromJalali(val);
  });
  watch(props.to, (val) => {
    toDate.value!.fromJalali(val);
  });
  watch(props.mode, (val) => {
    if (val == 'single' && selectedDates.value.length == 2)
      selectedDates.value.pop();
  });
  watch(props.locale, (val, oldVal) => {
    const index = oldVal.split(',').indexOf(currentLocale.value);
    currentLocale.value = val.split(',')[index];
  });
  watch(
    props.localeConfig,
    (val) => {
      langs.value = Core.mergeObject(langs.value, val) as Langs;
    },
    { deep: true },
  );
  watch(
    props.styles,
    (val) => {
      Core.setStyles(val, root.value);
    },
    { deep: true },
  );
  watch(props.color, (val) => {
    Core.setColor(val, root.value);
  });
  watch(
    errorList,
    (newErrors) => {
      Object.keys(newErrors).forEach((key) => {
        if (!errorTimers.has(key)) {
          const timer = window.setTimeout(() => {
            removedError(key);
          }, ERROR_DURATION);

          errorTimers.set(key, timer);
        }
      });
    },
    { deep: true },
  );
  // end watch

  // start computed
  const modal = computed(() => documentWidth.value < 768);
  const lang = computed(() => {
    return langs.value[currentLocale.value];
  });
  const attrs = computed(() => {
    const attrs: Attrs = {
      div: { class: 'pdp-group' },
      label: { class: 'pdp-label' },
      alt: {},
      picker: { class: 'pdp-picker' },
      firstInput: { class: 'pdp-input' },
      secondInput: { class: 'pdp-input' },
    };
    for (const key in attrs) {
      try {
        // @ts-expect-error type
        const [, group, attr] = key.match(
          /(div|label|alt|picker|firstInput|secondInput)-(.*)/,
        ) as [void, keyof Attrs, string];
        attrs[group][attr] = attrs[key];
      } catch {
        attrs['firstInput'][key] = attrs[key] as string;
      }
    }
    attrs.picker.class = [
      attrs.picker.class,
      {
        'pdp-top': pickerPlace.value.top,
        'pdp-left': pickerPlace.value.left,
        'pdp-right': pickerPlace.value.right,
      },
      lang.value.dir.picker,
    ];
    if (props.mode == 'single' && props.dualInput) {
      attrs['secondInput'].disabled = 'disabled';
    }
    if (showDatePicker.value) {
      attrs[inputName.value].class += ' pdp-focus';
    }
    return attrs;
  }); //: Attrs
  const years = computed(() => {
    let start: number = fromDate.value!.year();
    const end: number = toDate.value!.year();
    return Array(end - start + 1)
      .fill(null)
      .map(() => start++);
  }); //: number[]
  const columnCount = computed(() => {
    let column = 2;
    if (Core.isNumber(props.column)) {
      column = props.column as number;
    } else {
      const breakpoint = Object.keys(props.column)
        .sort((a, b) => +a - +b)
        .find((bp) => documentWidth.value <= +bp);
      if (breakpoint) column = (props.column as Obj)[breakpoint] as number;
    }
    if (props.type.includes('time')) {
      const scale = column / (props.mode == 'single' ? 1 : 2);
      root.value?.style.setProperty(
        '--time-scale',
        (scale > 1 ? scale : 1) + '',
      );
    }
    return column;
  }); //: number
  const monthDays = computed(() => {
    const months: MonthDays[][] = [];
    for (let i = 0; i < columnCount.value; i++) {
      let emptyCells;
      const selectedYear = onDisplay.value!.clone().addMonth(i).year();
      const selectedMonth = onDisplay.value!.clone().addMonth(i).month();
      emptyCells = +onDisplay
        .value!.clone()
        .parse(selectedYear, selectedMonth, 1)
        .toString('?d');
      let daysOfMonthNumber = onDisplay.value!.getDaysInMonth(
        selectedYear,
        selectedMonth,
      );
      const numberOfWeek = Math.ceil((daysOfMonthNumber + emptyCells) / 7);
      const month: MonthDays[] = [];
      let showDay = 1;
      for (let week = 0; week < numberOfWeek; week++) {
        month[week] = [];
        for (let day = 0; day < 7; day++) {
          if (emptyCells) {
            month[week][day] = { empty: true };
            --emptyCells;
          } else if (daysOfMonthNumber) {
            //FIXME: refactor
            month[week][day] = {
              friday: day == 6,
              raw: onDisplay.value!.clone().addMonth(i).date(showDay),
              startRange:
                selectedDates.value[0] &&
                selectedDates.value[0].isSame(
                  selectedYear,
                  selectedMonth,
                  showDay,
                ),
              endRange:
                selectedDates.value[1] &&
                selectedDates.value[1].isSame(
                  selectedYear,
                  selectedMonth,
                  showDay,
                ),
              inRange:
                selectedDates.value.length == 2 &&
                core.value
                  .clone()
                  .parse(selectedYear, selectedMonth, showDay)
                  .isBetween(
                    ...(selectedDates.value.map((date) => date.toString()) as [
                      string,
                      string,
                    ]),
                  ),
              disabled:
                !checkDate(
                  onDisplay.value!.clone().addMonth(i).date(showDay),
                  'date',
                ) ||
                isInDisable(onDisplay.value!.clone().addMonth(i).date(showDay)),
              today: core.value
                .clone()
                .isSame(selectedYear, selectedMonth, showDay),
              val: showDay++,
            };
            --daysOfMonthNumber;
          } else month[week][day] = { empty: true };
        }
      }
      months.push(month);
    }
    return months;
  }); //: MonthDays[][]
  const months = computed(() => {
    const months: Months = {};
    for (let i = 1; i <= 12; i++) {
      months[i] = {
        label: lang.value.months[i - 1],
        selected: onDisplay.value!.month() == i,
        disabled: !checkDate(onDisplay.value!.clone().month(i), 'month'),
      };
    }
    return months;
  }); //: Months
  // const nextLocale = computed(() => {
  //   const locales = entryLocale.value.split(',');
  //   const index = locales.indexOf(currentLocale.value);
  //   const locale = locales[index + 1] || locales[0];
  //   return langs.value[locale].translations.label;
  // }); //: string
  const formats = computed(() => {
    const displayFormat: Obj<string, TypePart | 'datetime'> = {
      date: '?D ?MMMM',
      datetime: '?D ?MMMM HH:mm',
      time: 'HH:mm',
    };
    const format: Obj<string, TypePart | 'datetime'> = {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm',
      time: 'HH:mm',
    };
    return {
      model: props.format || format[props.type],
      input: props.inputFormat || lang.value.inputFormat || props.type,
      display:
        props.displayFormat ||
        lang.value.displayFormat ||
        displayFormat[props.type],
      alt:
        (attrs.value.alt.format as string) ||
        props.format ||
        format[props.type],
    };
  }); //: Formats
  const defaultDate = computed(() => {
    const prefix =
      props.type === 'time' ? core.value.toString('jYYYY/jMM/jDD') + ' ' : '';
    return {
      from: prefix + props.from,
      to: prefix + props.to,
    };
  }); //: DefaultDate
  const inputs = computed(() => {
    return !props.dualInput ? ['firstInput'] : ['firstInput', 'secondInput'];
  }); //: Inputs[]
  const tabIndex = computed(() => {
    return (
      +(attrs.value.secondInput.tabindex || attrs.value.firstInput.tabindex) +
        1 || undefined
    );
  }); //: number | undefined
  const shortcuts = computed(() => {
    if (!props.shortcut) {
      return false;
    }
    const shortcuts: Shortcuts = {};
    const part = props.type.includes('date') ? 'date' : 'time';
    let d = core.value.clone().now();
    if (part == 'time' && !validate(d, part))
      d = toDate.value!.clone().subDay().now();

    const checkDate = (dates: PersianDate[]) => {
      return props.mode === 'single'
        ? validate(dates[0], part)
        : dates.some((d) => validate(d, part)) &&
            !isDisableBetween(...(dates as [PersianDate, PersianDate]));
    };
    const setShortcut = (obj: Shortcuts, fromProps = false) => {
      for (const phrase in obj) {
        const dates = fromProps
          ? obj[phrase].map((date: PersianDate) =>
              part == 'date'
                ? d.clone().fromJalali(date)
                : d.clone().time(date),
            )
          : obj[phrase];
        if (checkDate(dates)) {
          shortcuts[phrase] =
            props.type == 'date'
              ? dates.map((d: PersianDate) => d.startOf('date'))
              : dates;
        }
      }
    };

    if (props.shortcut === true) {
      setShortcut(
        Core.getShortcuts(d, `${part}-${props.mode}`, lang.value.translations)!,
      );
    } else {
      setShortcut(props.shortcut, true);
    }
    return shortcuts;
  }); //: Shortcuts | false
  const transitionName = computed(() => {
    if (slideDirection.value === 'left') return 'slide-left';
    if (slideDirection.value === 'right') return 'slide-right';
    return 'fade';
  }); //: string
  const currentMonthKey = computed(() => {
    return `${onDisplay.value?.year()}-${onDisplay.value?.month()}`;
  }); //: string
  const resolvedToolTip = computed(() => {
    const t = props.toolTip;
    const isRange = props.mode === 'range';
    const minLabels = isRange ? 2 : 1;

    // آیا labels معتبر از سمت props اومده؟
    const hasValidCustomLabels =
      t?.labels && Array.isArray(t.labels) && t.labels.length >= minLabels;

    if (hasValidCustomLabels) {
      return t;
    }

    // fallback
    const defaultLabels =
      langs.value[currentLocale.value].translations.selectedDateToolTip;

    return {
      enabled: t?.enabled ?? false,
      labels: isRange
        ? [defaultLabels[0], defaultLabels[1]]
        : [defaultLabels[0]],
    };
  });

  // end computed

  // start methods
  function getTooltipText(day: Obj) {
    if (!resolvedToolTip.value?.enabled) return '';

    if (props.mode === 'single') {
      return resolvedToolTip.value.labels[0];
    }

    if (selectedDates.value.length > 1 && !day.startRange && !day.endRange) {
      return resolvedToolTip.value.labels[0];
    }

    if (selectedDates.value.length < 1 || day.startRange) {
      return resolvedToolTip.value.labels[0];
    }

    return resolvedToolTip.value.labels[1];
  }
  function onResize() {
    documentWidth.value = window.innerWidth;
  }
  function preventChangedMonth() {
    const display = onDisplay.value;
    const today = todayObj.value?.raw?.d;

    // پیش‌شرط‌ها
    if (!props.disablePastDays || !display || !today) {
      shouldPrevent.value = false;
      return;
    }

    // گرفتن سال و ماه نمایشی به فرم جلالی (برای یکسان‌سازی مقایسه)
    let displayYear, displayMonth;

    if (display.c === 'gregorian') {
      const { year, month, date } = display.d;
      const j = core.value
        .clone()
        .calendar('jalali')
        .fromGregorian({ year, month, date });

      displayYear = j.d.year;
      displayMonth = j.d.month;
    } else {
      displayYear = display.year();
      displayMonth = display.month();
    }

    const todayYear = today.year;
    const todayMonth = today.month;

    // منطق نهایی مقایسه
    shouldPrevent.value =
      displayYear < todayYear ||
      (displayYear === todayYear && displayMonth <= todayMonth);
  }
  function showPart(part: CalendarPart): void {
    if (part == 'year') {
      showMonthSelect.value = false;
      showYearSelect.value = !showYearSelect.value;
      if (showYearSelect.value) {
        nextTick(() => {
          const selectedYearTop = (
            pdpSelectYear.value?.querySelector('li.selected') as HTMLLIElement
          ).offsetTop;
          pdpSelectYear.value?.scroll({
            top: selectedYearTop,
            behavior: 'smooth',
          });
        });
      }
    } else if (part == 'month') {
      showYearSelect.value = false;
      showMonthSelect.value = !showMonthSelect.value;
    }
  }
  function changeSelectedMonth(month: 'add' | 'sub' | number): void {
    const clone = onDisplay.value!.clone();
    if (month == 'add') {
      onDisplay.value!.addMonth();
      slideDirection.value = 'left';
    } else if (month == 'sub') {
      onDisplay.value!.subMonth();
      slideDirection.value = 'right';
    } else onDisplay.value!.month(month);
    if (checkDate(onDisplay.value, 'month')) showMonthSelect.value = false;
    else onDisplay.value = clone;
    preventChangedMonth();
  }
  function changeMonth() {
    preventChangedMonth();
    const el = pdpMain.value as HTMLElement;
    const currentScrollTop = el.scrollTop;
    if (currentScrollTop > lastScrollTop.value) {
      shouldPrevent.value = false;
    }
    lastScrollTop.value = currentScrollTop;
    if (shouldPrevent.value) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
    if (isBottom) {
      changeSelectedMonth('add');
      el.scrollTop = el.scrollHeight - el.clientHeight - 2;
    } else if (el.scrollTop < 1) {
      changeSelectedMonth('sub');
      el.scrollTop = 2;
    }
  }
  function changeSelectedYear(year: number): void {
    onDisplay.value!.year(year);
    if (!checkDate(onDisplay.value, 'date'))
      onDisplay.value = nearestDate(onDisplay.value as PersianDate);
    showYearSelect.value = false;
  }
  function validate(date: PersianDate, part: TypePart): boolean {
    if (!checkDate(date, part) || isInDisable(date)) return false;
    return true;
  }
  function isDisableBetween(first: PersianDate, second: PersianDate): boolean {
    if (!props.disable) return false;
    if (props.type != 'datetime' && Core.isString(props.disable)) {
      const date =
        props.type == 'time'
          ? second.clone().time(props.disable as string)
          : props.disable;
      return core.value
        .clone()
        .parse(date as PersianDate | string)
        .isBetween(first.toString(), second.toString());
    } else if (
      props.type != 'datetime' &&
      Array.isArray(props.disable) &&
      props.disable.some((date) => Core.isString(date))
    ) {
      return props.disable.some((date) => {
        if (props.type == 'time')
          date = second
            .clone()
            .time(date as string)
            .toString();
        return core.value
          .clone()
          .parse(date as string)
          .isBetween(first, second);
      });
    } else if (props.type != 'time') {
      const inRangeDate = second.clone().startOf('date').subDay();
      while (!inRangeDate.isSameOrBefore(first)) {
        if (isInDisable(inRangeDate)) return true;
        inRangeDate.subDay();
      }
    }
    return false;
  }
  function selectDate(date: PersianDate, part: TypePart): number {
    let isValid = validate(date, part);
    confirmSelectedDates.value = false;
    if (!isValid) {
      return -1;
    } else if (props.mode == 'range' && selectedDates.value.length == 1) {
      isValid = !isDisableBetween(selectedDates.value[0] as PersianDate, date);
      if (!isValid) {
        return -2;
      }
    }
    if (props.type == 'date') {
      date.startOf('date');
    }
    if (props.mode == 'single') {
      selectedDates.value = [date];
      selectedDatesText.value[0].classList.remove('hidden');
      pdpSubmit.value?.classList.remove('disabledBtn');
      pdpSubmit.value?.removeAttribute('disabled');
      confirmSelectedDates.value = true;
    } else if (props.mode == 'range') {
      selectedDatesText.value[0].classList.add('hidden');
      if (selectedDates.value.length === 0) {
        selectedDates.value[0] = date;
        inputName.value = 'secondInput';
      } else if (inputName.value === 'secondInput') {
        inputName.value = 'firstInput';
        if (
          props.preventSameDates.enabled &&
          date.isSame(selectedDates.value[0] as PersianDate)
        ) {
          confirmSelectedDates.value = false;
          selectedDates.value = [];
          selectedDatesText.value[0].classList.add('hidden');
          pdpSubmit.value?.classList.add('disabledBtn');
          pdpSubmit.value?.setAttribute('disabled', 'disabled');
          errorList.value.preventSameDates =
            props.preventSameDates.message != undefined &&
            props.preventSameDates.message != null
              ? props.preventSameDates.message
              : lang.value.translations.preventSameDates;
        } else if (!date.isBefore(selectedDates.value[0] as PersianDate)) {
          selectedDates.value[1] = date;
        } else {
          if (selectedDates.value.length === 1)
            selectedDates.value.unshift(date);
          else {
            selectedDates.value = [date];
            inputName.value = 'secondInput';
          }
        }
      } else {
        selectedDates.value = [date];
        inputName.value = 'secondInput';
      }
      if (selectedDates.value.length == 2) {
        errorList.value = {};
        stayDuration.value = Math.round(
          (new Date(
            selectedDates.value[1].d.year,
            selectedDates.value[1].d.month - 1,
            selectedDates.value[1].d.date,
          ) -
            new Date(
              selectedDates.value[0].d.year,
              selectedDates.value[0].d.month - 1,
              selectedDates.value[0].d.date,
            )) /
            86400000,
        );
        if (
          props.minStay.enabled &&
          stayDuration.value < props.minStay.duration
        ) {
          selectedDates.value = [];
          pdpSubmit.value?.classList.add('disabledBtn');
          pdpSubmit.value?.setAttribute('disabled', 'disabled');
          errorList.value.minStay =
            props.minStay.message != undefined && props.minStay.message != null
              ? props.minStay.message
              : `${lang.value.translations.minStay} ${props.minStay.duration} ${lang.value.translations.day}`;
          return 0;
        }

        pdpMain.value?.removeEventListener('mouseover', this.selectInRangeDate);
        selectedDatesText.value[0].classList.remove('hidden');
        pdpSubmit.value?.classList.remove('disabledBtn');
        pdpSubmit.value?.removeAttribute('disabled');
        confirmSelectedDates.value = true;
      }
    }

    if (props.type == 'datetime') {
      selectedDates.value = selectedDates.value.map((d, i) => {
        if (selectedTimes.value[i]) {
          d.time(selectedTimes.value[i] as PersianDate);
        }
        selectedTimes.value[i] = d;
        return d;
      });
      selectedDatesText.value[0].classList.remove('hidden');
      pdpSubmit.value?.classList.remove('disabledBtn');
      pdpSubmit.value?.removeAttribute('disabled');
      confirmSelectedDates.value = true;
    }

    emit('select', date);
    if (
      props.autoSubmit &&
      (props.mode !== 'range' ||
        (props.mode === 'range' && selectedDates.value.length == 2))
    ) {
      // errorList.value = {};
      submitDate();
      return 1;
    }
    return 0;
  }
  const removingKeys = new Set<string>();
  async function removedError(key: string) {
    if (removingKeys.has(key)) return; // جلوگیری از اجرای همزمان
    removingKeys.add(key);

    const el = document.getElementById(`ErrorBox-${key}`);
    if (!el) {
      removingKeys.delete(key);
      return;
    }

    const animationClass =
      lang.value.language === 'english'
        ? 'fadeOutLeft'
        : 'fadeOutRight';

    el.classList.add(animationClass);

    await new Promise(resolve => setTimeout(resolve, 500));

    delete errorList.value[key];
    errorList.value = { ...errorList.value };

    removingKeys.delete(key);
    errorTimers.delete(key);
  }
  function dayToKey(day: PersianDate | object) {
    if (day.empty) return null;
    let { year, month, date } = day.raw.d;
    // اگر تاریخ گریگورین بود → تبدیل به شمسی
    if (day.raw.c === 'gregorian') {
      const j = core.value
        .clone()
        .calendar('jalali')
        .fromGregorian({ year, month, date });
      year = j?.d.year;
      month = j?.d.month;
      date = j?.d.date;
    }
    return `${year}-${month}-${date}`;
  }
  function setModel(
    date?: PersianDate | PersianDate[] | string | string[],
  ): void {
    if (date === undefined) {
      date = selectedDates.value.map((el) => {
        return el.toString(props.formats.model);
      });
      if (props.mode == 'single') date = date[0];
    }
    emit('update:modelValue', date);
  }
  function goToToday(): void {
    slideDirection.value = 'right';
    showMonthSelect.value = showYearSelect.value = false;
    onDisplay.value = core.value.now().clone();
    if (props.type.includes('time') && selectedDates.value.length) {
      const lastIndex = selectedDates.value.length - 1;
      const time = selectedDates.value[lastIndex];
      time.time(onDisplay.value as PersianDate);
      if (selectedTimes.value[lastIndex]) {
        selectedTimes.value[lastIndex] = time.clone();
      }
      if (
        props.autoSubmit &&
        checkDate(time, 'time') &&
        !isInDisable(time as PersianDate)
      )
        submitDate(false);
    }
    if (props.type.includes('date'))
      nextTick(() => {
        document.querySelector('.pdp-day.today')?.classList.add('tada');
        setTimeout(() => {
          document.querySelector('.pdp-day.today')!.classList.remove('tada');
        }, 1000);
      });
    preventChangedMonth();
  }
  function checkDate(date: unknown, part: CalendarPart | TypePart): boolean {
    let from, to;
    if (!Core.isPersianDate(date))
      date = core.value.clone().parse(date as PersianDate);
    switch (part) {
      case 'year':
        from = fromDate.value!.toString('?YYYY');
        to = toDate.value!.toString('?YYYY');
        break;
      case 'month':
        from = fromDate.value!.toString('?YYYY/?MM');
        to = toDate.value!.toString('?YYYY/?MM');
        break;
      case 'date':
        from = fromDate.value!.toString();
        to = toDate.value!.toString();
        break;
      case 'time':
        from = fromDate.value!.toString(
          props.type.includes('time') ? 'datetime' : 'date',
        );
        to = toDate.value!.toString(
          props.type.includes('time') ? 'datetime' : 'date',
        );
        break;
    }
    return (date as PersianDate).isBetween(from, to, '[]');
  }
  function isInDisable(date: PersianDate, disable?: Disable): boolean {
    if (!props.disable) return false;
    disable = disable || props.disable;
    date = Core.isPersianDate(date)
      ? date.clone()
      : core.value.clone().parse(date);
    if (Core.isString(disable)) {
      if (props.type == 'time') disable = date.toString() + ' ' + disable;
      return date.calendar('jalali').isSame(disable as string);
    } else if (disable instanceof RegExp) {
      const format = {
        date: 'jYYYY/jM/jD',
        datetime: 'jYYYY/jM/jD H:m',
        time: 'H:m',
      };
      return disable.test(date.toString(format[props.type]));
    } else if (Core.isFunction(disable)) {
      return (disable as (date: PersianDate) => boolean)(date);
    } else if (Array.isArray(disable)) {
      return disable.some((val) => {
        if (Core.isString(val)) {
          if (props.type == 'time') val = date.toString() + ' ' + val;
          return date.calendar('jalali').isSame(val as string);
        } else if (val instanceof RegExp) {
          const format = {
            date: 'jYYYY/jM/jD',
            datetime: 'jYYYY/jM/jD H:m',
            time: 'H:m',
          };
          return val.test(date.toString(format[props.type]));
        }
      });
    } else {
      return false;
    }
  }
  function showPicker(el: 'icon' | 'input', index: 0 | 1): void {
    const placeHolder = calendarPlaceHolder.value[index];
    placeHolder.classList.add('moveUp');
    setTimeout(() => {
      if (!confirmSelectedDates.value) {
        selectedDatesText.value[0].classList.add('hidden');
        pdpSubmit.value?.classList.add('disabledBtn');
        pdpSubmit.value?.setAttribute('disabled', 'disabled');
      }
    }, 10);
    if (props.clickOn == 'all' || props.clickOn == el) {
      const inputName = inputs.value[index];
      if (props.dualInput) inputName.value = inputName;
      inputsRef.value[index].focus();
      showDatePicker.value = true;
      if (!modal.value) {
        nextTick(() => {
          locate();
        });
        document.addEventListener('scroll', locate);
      }
    }
    preventChangedMonth();
  }
  function hideDatePicker(): void {
    const placeHolders = calendarPlaceHolder.value;
    if (!confirmSelectedDates.value) {
      placeHolders[0].classList.remove('moveUp');
      selectedDates.value = [];
      selectedDatesText.value[0].classList.add('hidden');
      pdpSubmit.value?.classList.add('disabledBtn');
      pdpSubmit.value?.setAttribute('disabled', 'disabled');
    }
    showDatePicker.value = false;
  }
  async function selectWithArrow(e: KeyboardEvent): Promise<void> {
    //FIXME: refactor
    //FIXME: when up arraw press go to last date
    // [37, 38, 39, 40] are key codes of arrow keys
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
      const arrow = {
        ArrowLeft: 1, // for left arrow must one day add in rtl picker
        ArrowUp: -7, // for up arrow must seven day subtract in rtl picker
        ArrowRight: -1, // for right arrow must one day subtract in rtl picker
        ArrowDown: 7, // for down arrow must seven day add in rtl picker
      };
      let numberOfDay = arrow[e.key as keyof typeof arrow];
      if (
        lang.value.dir.picker == 'ltr' &&
        ['ArrowLeft', 'ArrowRight'].includes(e.key)
      )
        numberOfDay = -numberOfDay;

      let focusedDay: HTMLElement | NodeListOf<HTMLElement> =
        document.querySelectorAll('.pdp .pdp-day.hover');
      if (!focusedDay.length) {
        focusedDay = document.querySelectorAll(
          '.pdp .pdp-day.start-range,.pdp .pdp-day.end-range',
        );
      }
      focusedDay = focusedDay[focusedDay.length - 1];
      if (focusedDay) {
        let column = getColumn(focusedDay);
        focusedDay.classList.remove('hover');
        const firstColumnMonth = onDisplay.value!.toString();
        const focusedMonth = onDisplay.value!.clone().addMonth(column);
        let nextElementValue: PersianDate | number = focusedMonth
          .date(focusedDay.innerText)
          .addDay(numberOfDay);
        if (!checkDate(nextElementValue, 'date'))
          return focusedDay.classList.add('hover');
        nextElementValue = (nextElementValue as PersianDate).date();
        column = focusedMonth.diff(firstColumnMonth, 'month');
        if (column < 0) {
          onDisplay.value!.subMonth(columnCount.value);
          column = columnCount.value - 1;
        } else if (column >= columnCount.value) {
          onDisplay.value!.addMonth(columnCount.value);
          column = 0;
        }
        await nextTick();
        focusedDay = document.querySelector(
          `.pdp .pdp-main .pdp-column[data-column='${column}'] .pdp-day[value='${nextElementValue}']`,
        ) as HTMLElement;
        focusedDay.classList.add('hover');
      } else {
        focusedDay = document.querySelector(
          '.pdp .pdp-day:not(.empty):not(.disabled)',
        ) as HTMLElement;
        if (focusedDay) focusedDay.classList.add('hover');
        else {
          focusedDay = document.querySelector(
            `.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${fromDate.value!.date()}"]`,
          ) as HTMLElement;
          focusedDay.classList.add('hover');
        }
      }
      if (props.mode === 'range' && selectedDates.value.length == 1) {
        selectInRangeDate({ target: focusedDay });
      }
    } else if (e.key == 'Enter') {
      // 13 is key code of Enter key
      e.preventDefault();
      const focusedDay = document.querySelector(
        '.pdp .pdp-day.hover',
      ) as HTMLElement;
      if (focusedDay) {
        selectDate(
          onDisplay
            .value!.clone()
            .addMonth(getColumn(focusedDay) || 0)
            .date(focusedDay.innerText),
          'date',
        );
      } else {
        let onDisplay;
        displayValue.value.forEach((value, index) => {
          if (!value) return false;
          if (props.type == 'time') {
            const time = value.split(/[/ -.,:\\]/);
            if (checkDate(core.value.clone(), 'time'))
              onDisplay = core.value.clone();
            else onDisplay = fromDate.value!.clone();
            onDisplay.time(time as [string]);
          } else {
            onDisplay = core.value.clone().parse(value);
          }
          if (selectDate(onDisplay, 'time') === 0) {
            const diff = onDisplay.diff(
              onDisplay.value as PersianDate,
              'month',
            );
            if (diff < 0 || diff >= columnCount.value)
              onDisplay.value = onDisplay.clone();
            displayValue.value[index] = '';
          }
        });
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function selectInRangeDate(e: any): void {
    const target = e.target;
    if (!target.classList.contains('pdp-day')) return;
    document.querySelectorAll(`.pdp .pdp-day`).forEach((el) => {
      el.classList.remove('in-range');
    });

    let column = getColumn(target);
    const hoveredDate = onDisplay
      .value!.clone()
      .startOf('date')
      .addMonth(column)
      .date(target.innerText);
    const selectedDate = selectedDates.value[0].clone().startOf('date');
    const number = hoveredDate.isAfter(selectedDate) ? 1 : -1;
    const selectedDateDOM = document.querySelector(
      '.pdp-day.start-range,.pdp-day.end-range',
    ) as HTMLElement;
    if (selectedDateDOM) {
      column = +getColumn(selectedDateDOM);
      selectedDateDOM.classList.replace(
        ...((hoveredDate.isBefore(selectedDate)
          ? ['start-range', 'end-range']
          : ['end-range', 'start-range']) as [string, string]),
      );
    } else {
      selectedDate.parse(onDisplay.value as PersianDate);
      if (number === 1) {
        selectedDate.startOf('month').subDay();
        column = -1;
      } else {
        selectedDate
          .addMonth(columnCount.value - 1)
          .endOf('month')
          .addDay()
          .startOf('date');
        column = columnCount.value;
      }
    }
    while (!hoveredDate.isSame(selectedDate)) {
      const oldMonth = selectedDate.month();
      selectedDate.addDay(number);
      if (oldMonth != selectedDate.month()) {
        column += number;
      }
      if (checkDate(selectedDate, 'date') && !isInDisable(selectedDate)) {
        document
          .querySelector(
            `.pdp-column[data-column='${column}'] .pdp-day[value='${selectedDate.date()}']`,
          )!
          .classList.add('in-range');
      } else {
        break;
      }
    }
  }
  function submitDate(close = true): void {
    const displayDate = selectedDates.value.map((el) => {
      return el.toString(props.formats.input);
    });
    if (props.dualInput) displayValue.value = displayDate;
    else displayValue.value[0] = displayDate.join(' - ');

    submitedValue.value = selectedDates.value.slice();
    setModel();
    emit(
      'submit',
      props.mode === 'range' ? selectedDates.value : selectedDates.value[0],
    );
    if (close) {
      showDatePicker.value = false;
    }
  }
  function getColumn({ parentNode }: HTMLElement): number | string {
    return (parentNode!.parentNode!.parentNode as HTMLElement).dataset.column!;
  }
  function nearestDate(date: PersianDate): PersianDate {
    return Math.abs(date.diff(fromDate.value as PersianDate)) <=
      Math.abs(date.diff(toDate.value as PersianDate))
      ? fromDate.value!.clone()
      : toDate.value!.clone();
  }
  function locate(): void {
    pickerPlace.value = {
      top: false,
      left: false,
      right: false,
    };
    nextTick(() => {
      const input = inputsRef.value[0];
      const inputOffset =
        input.offsetHeight + input.getBoundingClientRect().top;
      const picker = pdpPicker.value;
      const pickerHeight = picker.offsetHeight + 10;
      const pickerOffset = picker.getBoundingClientRect();
      pickerPlace.value = {
        top:
          inputOffset >= pickerHeight &&
          window.innerHeight - (inputOffset + pickerHeight) < 0,
        left: pickerOffset.left <= 0,
        right:
          window.innerWidth - (pickerOffset.left + pickerOffset.width) <= 0,
      };
    });
  }
  function changeLocale(): void {
    const locales = entryLocale.value.split(',');
    const index = locales.indexOf(currentLocale.value);
    currentLocale.value = locales[index + 1] || locales[0];
    const calendar = lang.value.calendar;
    core.value.calendar(calendar);
    fromDate.value!.calendar(calendar);
    toDate.value!.calendar(calendar);
    onDisplay.value!.calendar(calendar);
    for (const date of selectedDates.value) {
      date.calendar(calendar);
    }
    submitDate(false);
  }
  function showMoreBox(): void {
    moreBox.value?.classList.toggle('hideBox');
    moreBox.value.style.top = '2.5rem';
    if (moreBox.value?.className.includes('hideBox')) {
      moreBox.value?.removeAttribute('style');
    }
    symbolsExplanation.value?.classList.add('max-md:hideBox');
    symbolsExplanation.value?.removeAttribute('style');
  }
  function showSymbolsExplanation(): void {
    symbolsExplanation.value?.classList.toggle('max-md:hideBox');
    symbolsExplanation.value.style.bottom = 0;
    if (symbolsExplanation.value?.className.includes('max-md:hideBox')) {
      symbolsExplanation.value.removeAttribute('style');
    }
  }
  function clear(inputName: Inputs): void {
    const inputIndex = inputName === 'firstInput' ? 0 : 1;

    displayValue.value[inputIndex] = '';
    emit('clear');
    if (props.dualInput) {
      const values = attrs.value;
      if (values && Array.isArray(values))
        return setModel(values.map((val, i) => (i == inputIndex ? null : val)));
    }
    setModel('');
  }
  function startChangeTime(
    timeIndex: number,
    unit: 'minute' | 'hour',
    operator: 'add' | 'sub',
  ) {
    let time = selectedTimes.value[timeIndex];
    if (!time) {
      time = core.value.clone();
      if (!checkDate(time, 'time')) {
        time = toDate
          .value!.clone()
          .subDay()
          .time(core.value as PersianDate);
      }
      if (timeIndex == 1 && !selectedTimes.value.length)
        selectedTimes.value.push(time.clone());
      selectedTimes.value.push(time);
    }
    stopChangeTime();
    const maxAmount = unit == 'hour' ? 23 : 59;
    let currentAmount = time[unit]();
    const changeTime = () => {
      if (operator == 'add') {
        currentAmount++;
        if (currentAmount > maxAmount) currentAmount = 0;
      } else {
        currentAmount--;
        if (currentAmount < 0) currentAmount = maxAmount;
      }
      if (!checkDate(time[unit](currentAmount), 'time')) {
        time.parse(
          time.isSameOrAfter(toDate.value!.clone())
            ? toDate.value!.clone()
            : fromDate.value!.clone(),
        );
      } else if (
        selectedTimes.value.length == 2 &&
        selectedTimes.value[0].isAfter(selectedTimes.value[1] as PersianDate)
      ) {
        time.parse(
          (timeIndex == 0
            ? selectedTimes.value[1]
            : selectedTimes.value[0]) as PersianDate,
        );
      }
      if (!isInDisable(time as PersianDate)) {
        if (props.type == 'time') {
          selectedDates.value[timeIndex] = time;
        } else if (selectedDates.value[timeIndex]) {
          selectedDates.value[timeIndex].time(time as PersianDate);
        }
        emit('select', time);
        if (
          props.autoSubmit &&
          !selectedTimes.value.some((sTime) =>
            isInDisable(sTime as PersianDate),
          )
        )
          submitDate(false);
      }
    };
    changeTime();
    interval.value = setInterval(changeTime, 100);
  }
  function stopChangeTime() {
    clearInterval(interval.value!);
  }
  function selectShorcut(dates: PersianDate[]) {
    selectedDates.value = dates.map((date, i) => {
      if (i == 0) onDisplay.value = date.clone();
      emit('select', date);
      return date.clone();
    });
    if (props.autoSubmit) {
      submitDate();
    }
  }
  function setDate(dates: string | string[]) {
    if (!dates) return;
    if (props.mode == 'single' && typeof dates === 'string') dates = [dates];
    selectedDates.value = [];
    (dates as string[]).some((d, index) => {
      const date = core.value
        .clone()
        .fromGregorian(
          (props.type == 'time'
            ? core.value.toString('YYYY-MM-DD') + ' '
            : '') + d,
        );
      if (Core.isPersianDate(date)) {
        selectedDates.value.push(date.clone());
        selectedTimes.value.push(date.clone());
        if (index == 0) onDisplay.value = date.clone();
      } else {
        selectedDates.value = selectedTimes.value = [];
        return true;
      }
    });
    if (selectedDates.value.length) submitDate();
  }
  // end methods

  // export { PersianDate };
</script>

<style lang="scss">
  @use './assets/sass/app.scss';
</style>
