<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from './SvgIcon.vue';

export default defineComponent({
  name: 'SearchIcon',
  extends: SvgIcon,
  components: { SvgIcon },
});
</script>

<template>
  <SvgIcon >
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :fill="fill" view-box="0 0 24 24" v-bind="$attrs">
      <path
        d="m16.38 14.92-.66.05-.41-.41c2.44-2.81 2.28-7.1-.5-9.7S7.8 2.4 5.17 4.94a6.99 6.99 0 0 0-.08 9.98c2.61 2.61 6.77 2.72 9.52.34l.41.41-.05.65 3.89 3.89a.996.996 0 1 0 1.41-1.41l-3.88-3.88Zm-2.81-1.41a5.016 5.016 0 0 1-7.08 0c-1.95-1.95-1.95-5.13 0-7.08s5.13-1.95 7.08 0 1.95 5.13 0 7.08" />
    </svg>
  </SvgIcon>
</template>
