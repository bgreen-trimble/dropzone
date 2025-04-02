<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const showDropdown = ref(false);
const suggestions = ref(['example search 1', 'example search 2', 'example search 3']);

const handleBlur = () => {
  // Delay hiding dropdown to allow click events on suggestions
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  showDropdown.value = false;
  performSearch();
};

const performSearch = () => {
  console.log('Searching for:', searchQuery.value);
  // Implement actual search functionality here
};

const startVoiceSearch = () => {
  console.log('Starting voice search');
  // Implement voice search functionality here
};

const startImageSearch = () => {
  console.log('Starting image search');
  // Implement image search functionality here
};
</script>

<template>
  <div>
    <div class="search-container">
      <div class="search-bar">
        <button class="search-button" @click="performSearch">
          <span class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="mi-outline mi-search" viewBox="0 0 24 24">
  <path d="m16.38 14.92-.66.05-.41-.41c2.44-2.81 2.28-7.1-.5-9.7S7.8 2.4 5.17 4.94a6.99 6.99 0 0 0-.08 9.98c2.61 2.61 6.77 2.72 9.52.34l.41.41-.05.65 3.89 3.89a.996.996 0 1 0 1.41-1.41l-3.88-3.88Zm-2.81-1.41a5.016 5.016 0 0 1-7.08 0c-1.95-1.95-1.95-5.13 0-7.08s5.13-1.95 7.08 0 1.95 5.13 0 7.08"/>
</svg>          </span>
        </button>
        <input
          type="text"
          v-model="searchQuery"
          @focus="showDropdown = true"
          @blur="handleBlur"
          placeholder="Search..."
          class="search-input"
        />
        <button class="search-button" @click="startVoiceSearch">
            <span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="mi-outline mi-mic" viewBox="0 0 24 24">
  <path d="M18.99 12.97a.857.857 0 0 0-.85-.97c-.42 0-.77.3-.83.71-.37 2.61-2.72 4.39-5.25 4.39s-4.88-1.77-5.25-4.39a.84.84 0 0 0-.83-.71c-.52 0-.92.46-.85.97.46 2.97 2.96 5.3 5.93 5.75V20H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-1.94v-1.28c2.96-.43 5.47-2.78 5.93-5.75M12.06 15c1.66 0 2.99-1.34 2.99-3V6c.01-1.66-1.33-3-2.99-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3m-1-9c0-.55.45-1 1-1s1 .45 1 1v6c-.01.56-.44 1-1 1s-1-.45-1-1z"/>
</svg></span>
        </button>
        <button class="search-button" @click="startImageSearch">
            <span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="mi-outline mi-image-add" viewBox="0 0 24 24">
  <path d="M9.22 10.9c.92 0 1.67-.75 1.67-1.67s-.75-1.67-1.67-1.67-1.67.75-1.67 1.67.75 1.67 1.67 1.67"/>
  <path d="M19.98 1.96H3.94c-1.1 0-2 .9-2 2V20c0 1.1.9 2 2 2h8.436a6.5 6.5 0 0 1-1.062-2H3.94V3.96h16.04v8.03a6.5 6.5 0 0 1 2 1.3V3.96c0-1.1-.9-2-2-2"/>
  <path d="M21.98 15.777a5 5 0 0 0-2-2.12A5 5 0 0 0 17.5 13a5 5 0 0 0-4.956 5.67l.001.005c.063.465.19.91.371 1.325a5 5 0 0 0 1.583 2c.836.628 1.875 1 3.001 1a4.98 4.98 0 0 0 3.133-1.103l.016-.013a5 5 0 0 0 1.34-1.68A5 5 0 0 0 22.5 18a5 5 0 0 0-.5-2.182l-.02-.04Zm-7.064 2.893a.748.748 0 0 1 .334-1.419h1.503v-1.503A.745.745 0 0 1 17.5 15c.414 0 .749.335.749.748v1.504h1.503A.747.747 0 0 1 20.5 18a.75.75 0 0 1-.748.748H18.25v1.503a.748.748 0 1 1-1.497 0v-1.503H15.25a.75.75 0 0 1-.334-.078m-3.882 0a6.6 6.6 0 0 1 .008-1.41l-.162.18-2.36-2.63a.553.553 0 0 0-.83 0l-2.64 2.93c-.32.36-.07.93.41.93z"/>
</svg></span>
        </button>

      </div>

      <div class="search-dropdown" v-if="showDropdown">
        <div class="dropdown-item" v-for="(suggestion, index) in suggestions" :key="index" @mousedown="selectSuggestion(suggestion)">
          <span class="suggestion-icon">🔍</span>
          <span class="suggestion-text">{{ suggestion }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.search-container {
  position: relative;
  max-width: 600px;
  margin: 20px auto;
}

.search-bar {
  display: flex;
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-radius: 24px;
  height: 44px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  border: none;
  padding: 0 16px;
  font-size: 16px;
  outline: none;
  border-radius: 24px 0 0 24px;
}

.search-button {
  background: #f8f9fa;
  border: none;
  padding: 0 8px;
  cursor: pointer;
  border-radius: 0 0px 0px 0;
}

.search-button:hover {
  background: #f1f3f4;
}

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
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f1f3f4;
}

.suggestion-icon {
  margin-right: 10px;
  color: #5f6368;
}

.search-icon {
  color: #5f6368;
}
</style>
