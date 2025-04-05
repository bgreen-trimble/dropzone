<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
});

// Events declaration
const emit = defineEmits<{
  (e: 'focus', inFocus: boolean ): void;
  (e: 'change', text?: string): void;
  (e: 'escape'): void;
  (e: 'submit', text?: string): void;
}>();

const input = ref<string>();

const handleFocus = () => emit('focus', true)
const handleBlur = () => emit('focus', false)
const handleChange = () => emit('change', input.value)

watch(() => props.text, (newText) => {
  input.value = newText
}, { immediate: true })
</script>

<template>
  <input
    type="text"
    class="search-input"
    v-model="input"
    :placeholder="placeholder"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleChange"
    @keyup.enter="emit('submit', input)"
    @keyup.esc="emit('escape')"
  />
</template>

<style scoped>
.search-input {
  flex: 1;
  border: none;
  padding: 0 16px;
  font-size: 16px;
  outline: none;
  border-radius: 24px 0 0 24px;
}
</style>
