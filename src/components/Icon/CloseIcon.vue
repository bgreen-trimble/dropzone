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
      <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.6 7.11 5.71A.996.996 0 1 0 5.7 7.12l4.89 4.89L5.7 16.9a.996.996 0 1 0 1.41 1.41L12 13.42l4.89 4.89a.996.996 0 1 0 1.41-1.41l-4.89-4.89 4.89-4.89a.996.996 0 0 0 0-1.41"/>
    </svg>
  </SvgIcon>
</template>

