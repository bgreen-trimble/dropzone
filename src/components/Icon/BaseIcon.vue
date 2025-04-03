<script lang="ts">
export default {
  name: 'BaseIcon',
  props: {
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
    customClass: {
      type: [String, Array, Object],
      default: '',
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    }
  },
  methods: {
  }
}
</script>

<template>
  <slot></slot>
</template>



<style scoped>
i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
