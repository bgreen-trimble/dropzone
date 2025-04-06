
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
const hasText = computed(() => props.text?.length);

const html = computed(() => {
  if (hasText.value) {
    const text = props.text || '';
    const suggestion = props.suggestion || '';
    const suggestionLower = suggestion.toLowerCase();
    const textLower = text.toLowerCase();
    const textIndex = suggestionLower.indexOf(textLower);

    if (textIndex !== -1) {
      const prefix = suggestion.substring(0, textIndex);
      const match = suggestion.substring(textIndex, textIndex + text.length);
      const suffix = suggestion.substring(textIndex + text.length);
      return `${prefix}<span style="font-weight: normal">${match}</span>${suffix}`;
    } else {
      return suggestion;
    }
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
