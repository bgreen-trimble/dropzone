<script setup lang="ts">
import { ref } from 'vue';
import MicrophoneIcon from '@/components/Icon/MicrophoneIcon.vue';
import SearchIcon from '@/components/Icon/SearchIcon.vue';
import ImageAddIcon from '@/components/Icon/ImageAddIcon.vue';

const searchQuery = ref('');
const showDropdown = ref(false);
const showImageSearch = ref(false);
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
  showImageSearch.value = true;
};
</script>

<template>
  <div>

    <div class="search-container">
      <div class="search-bar">
        <button class="search-button" @click="performSearch">
          <span class="search-icon">
            <SearchIcon />
          </span>
        </button>
        <input type="text" v-model="searchQuery" @focus="showDropdown = true" @blur="handleBlur" placeholder="Search..."
          class="search-input" />
        <button class="search-button" @click="startVoiceSearch">
          <span class="search-icon">
            <MicrophoneIcon />
          </span>
        </button>

        <button class="search-button" @click="startImageSearch">
          <span class="search-icon">
            <ImageAddIcon />
          </span>
        </button>
      </div>
      <div class="overlay" v-if="showImageSearch">
        <div class="image-search-modal">
          <h2>Image Search</h2>
          <button @click="showImageSearch = false">Close</button>
          <!-- Image search functionality goes here -->
        </div>
      </div>
      <div class="search-dropdown" v-if="showDropdown">
        <div class="dropdown-item" v-for="(suggestion, index) in suggestions" :key="index"
          @mousedown="selectSuggestion(suggestion)">
          <span class="suggestion-icon">🔍</span>
          <span class="suggestion-text">{{ suggestion }}</span>
        </div>
      </div>
    </div>

    <div>
      <h1>General Search</h1>
      <p>Search for anything you want!</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: -0px;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  z-index: 10;
}

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
