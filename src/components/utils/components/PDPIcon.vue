<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>
<script lang="ts" setup>
  import { type PropType, toRefs } from 'vue';

  const props = defineProps({
    icon: {
      type: String as PropType<'clear' | 'date' | 'datetime' | 'time'>,
      required: true,
    },
  });

  const { icon } = toRefs(props);
</script>

<template>
  <svg
    v-if="icon === 'clear'"
    viewBox="0 0 512 512"
    width="1rem"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <metadata>Clear icon</metadata>
    <path
      d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"
    />
  </svg>
  <svg
    v-else-if="icon === 'date'"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <metadata>Calendar icon</metadata>
    <path
      d="M17.5 9.58317V7.33317C17.5 5.93304 17.5 5.23297 17.2275 4.69819C16.9878 4.22779 16.6054 3.84534 16.135 3.60565C15.6002 3.33317 14.9001 3.33317 13.5 3.33317H6.5C5.09987 3.33317 4.3998 3.33317 3.86502 3.60565C3.39462 3.84534 3.01217 4.22779 2.77248 4.69819C2.5 5.23297 2.5 5.93304 2.5 7.33317V14.3332C2.5 15.7333 2.5 16.4334 2.77248 16.9681C3.01217 17.4386 3.39462 17.821 3.86502 18.0607C4.3998 18.3332 5.09987 18.3332 6.5 18.3332H10.4167M17.5 8.33317H2.5M13.3333 1.6665V4.99984M6.66667 1.6665V4.99984M15 17.4998V12.4998M12.5 14.9998H17.5"
      stroke="#181D27"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <svg
    v-else-if="icon === 'datetime'"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    viewBox="7.146755218505859 47.93895721435547 195.70648193359375 201.1220703125"
    version="1.1"
  >
    <metadata>Calendar And Clock Icon</metadata>
    <g
      id="g915"
      inkscape:label="calendar"
      inkscape:groupmode="layer"
      style="display: inline"
    >
      <g
        id="g907"
        transform="matrix(3.2971191,0,0,3.2971191,-61.13988,-15.80425)"
      >
        <path
          id="path893"
          d="m 30.35,19.333 v 2.76 h -9.639 v 10.697 3.4 36.625 h 44.781 c 3.595,0 6.519,-2.926 6.519,-6.52 V 36.19 32.79 22.093 h -9.64 v -2.76 h -3.399 v 2.76 H 48.061 v -2.76 h -3.399 v 2.76 H 33.75 v -2.76 z m 38.26,46.963 c 0,1.719 -1.398,3.119 -3.118,3.119 H 24.111 V 36.19 H 68.61 Z M 44.661,25.493 v 2.906 h 3.399 v -2.906 h 10.911 v 2.906 h 3.399 v -2.906 h 6.239 V 32.79 H 24.111 v -7.297 h 6.239 v 2.906 h 3.4 v -2.906 z"
        ></path>
        <path
          id="path895"
          d="M 38.073,40.157 H 27.448 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
        ></path>
        <path
          id="path897"
          d="M 51.673,40.157 H 41.048 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
        ></path>
        <path
          id="path899"
          d="M 65.273,40.157 H 54.648 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
        ></path>
        <path
          id="path901"
          d="M 38.073,54.476 H 27.448 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
        ></path>
        <path
          id="path903"
          d="M 51.673,54.476 H 41.048 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
        ></path>
        <path
          id="path905"
          d="M 65.273,54.476 H 54.648 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
        ></path>
      </g>
    </g>
    <g inkscape:groupmode="layer">
      <circle
        id="path918"
        style="fill: #ffffff; fill-opacity: 1; stroke-width: 2.46968"
        cx="156.58038"
        cy="201.26753"
        r="44.96637"
      ></circle>
    </g>
    <g inkscape:groupmode="layer">
      <g
        id="g932"
        style="clip-rule: evenodd; fill-rule: evenodd"
        transform="matrix(3.8598712,0,0,3.8598712,110.21634,156.42414)"
      >
        <path
          id="path921"
          d="M 12,0 C 18.623,0 24,5.377 24,12 24,18.623 18.623,24 12,24 5.377,24 0,18.623 0,12 0,5.377 5.377,0 12,0 Z m 0,1 C 18.071,1 23,5.929 23,12 23,18.071 18.071,23 12,23 5.929,23 1,18.071 1,12 1,5.929 5.929,1 12,1 Z m 0,11 h 6 v 1 H 11 V 4 h 1 z"
        ></path>
      </g>
    </g>
  </svg>
  <svg
    v-else-if="icon === 'time'"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    fill-rule="evenodd"
    clip-rule="evenodd"
    viewBox="0 0 24 24"
  >
    <metadata>Clock Icon</metadata>
    <path
      d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z"
    ></path>
  </svg>
</template>
