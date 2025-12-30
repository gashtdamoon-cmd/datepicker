<script lang="ts" setup>
  import { type PropType, computed, toRefs } from 'vue';

  type Direction = 'up' | 'down' | 'right' | 'left';

  const props = defineProps({
    direction: {
      default: 'up',
      type: String as PropType<Direction>,
    },
    inverse: {
      default: false,
      type: Boolean,
    },
  });
  const { direction, inverse } = toRefs(props);

  const rotate = computed(() => {
    const directions = {
      up: -90,
      down: 90,
      right: 0,
      left: 180,
    };
    const deg = directions[direction.value] + (inverse.value ? 180 : 0);

    return `rotate(${deg} 0 0)`;
  });
</script>

<template>
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :transform="rotate"
  >
    <metadata>Arrow icon</metadata>
    <path
      d="M1 13L7 7L1 1"
      stroke="#193660"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
