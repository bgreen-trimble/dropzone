<script setup lang="ts">
import { computed } from 'vue'
import { useSuggestionsStore } from '@/store/suggestions';
import SearchIcon from '@/components/Icon/SearchIcon.vue';
import RefreshIcon from '@/components/Icon/RefreshIcon.vue';
import SuggestionHighlight from './SuggestionHighlight.vue';

const props = defineProps({
  text: {
    type: String,
    default: undefined
  },
});

const emit = defineEmits<{
  (e: 'submit', text?: string): void;
}>();

const suggestionsStore = useSuggestionsStore()
const { searches, suggestions } = suggestionsStore

const selectSuggestion = (suggestion: string) => {
  console.log('Selected suggestion:', suggestion);
  emit('submit', suggestion);
};

const hasText = computed(() => props.text?.length);
const hasSearches = computed(() => searches().length !== 0);

const getSuggestions = computed(() => {
  if (hasText.value) {
    return suggestions(props.text);
  } else if (hasSearches.value) {
    console.log('No text, showing searches:', searches());
    return searches();
  } else {
    return [] as string[];
  }
});

</script>

<template>
  <div v-if="getSuggestions.length" class="search-dropdown">
    <div class="dropdown-item" v-for="(suggestion, index) in getSuggestions" :key="index"
      @mousedown="selectSuggestion(suggestion)">
      <span vi-if="hasText" class="search-icon">
        <SearchIcon v-if="hasText"/>
        <RefreshIcon v-else/>
      </span>
      <SuggestionHighlight style="padding-left: 8px;" :suggestion="suggestion" :text="text" />
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
  padding: 4px;
}

.dropdown-item {
  padding-left: 8px;
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

.search-icon {
  color: #5f6368;
}
</style>
