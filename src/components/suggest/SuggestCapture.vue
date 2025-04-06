<script setup lang="ts">
import { ref, watch } from 'vue'
import { faker } from '@faker-js/faker';
import SearchIcon from '@/components/Icon/SearchIcon.vue';

const props = defineProps({
  text: {
    type: String,
    default: undefined
  },
});

const emit = defineEmits<{
  (e: 'submit', text?: string): void;
}>();

const suggestions = ref(['example search 1', 'example search 2', 'example search 3']);

const selectSuggestion = (suggestion: string) => {
  console.log('Selected suggestion:', suggestion);
  emit('submit', suggestion);
};

watch(() => props.text, (value) => {
  if (value) {
    suggestions.value = Array.from({ length: 10 }, () => `${value} ${faker.word.adjective()}`);
  } else {
    suggestions.value = [];
  }
}, { immediate: true });

</script>

<template>
  <div class="search-dropdown">
    <div class="dropdown-item" v-for="(suggestion, index) in suggestions" :key="index"
      @mousedown="selectSuggestion(suggestion)">
      <SearchIcon style="padding-right: 4px" />
      <span>{{ suggestion }}</span>
    </div>
  </div>
</template>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  z-index: 10;
}


.dropdown-item {
  padding-left: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 30px;
}

.dropdown-item:hover {
  background-color: #f1f3f4;
}
</style>
