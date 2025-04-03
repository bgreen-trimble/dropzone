<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
    fill: {
      type: String,
      default: 'currentColor',
    },
    classes: {
      type: [String, Array, Object],
      default: '',
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
})
</script>

<template>
  <slot />
</template>
