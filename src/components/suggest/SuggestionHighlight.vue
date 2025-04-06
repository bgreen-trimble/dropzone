
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  suggestion: {
    type: String,
    default: undefined
  },
  text: {
    type: String,
    default: undefined
  },
});

const html = computed(() => {
  if (props.text) {
    const text = props.text || '';
    const suggestion = props.suggestion || '';

    if (text.trim() === '') {
      return suggestion;
    }

    // Create regex that matches all instances, case insensitive
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    // Replace all matches with the highlighted version
    return suggestion.replace(regex, match =>
      `<span style="font-weight: normal">${match}</span>`
    );
  } else {
    return props.suggestion;
  }
});

</script>

<template>
    <span v-html="html"></span>
</template>

<style scoped>
</style>
