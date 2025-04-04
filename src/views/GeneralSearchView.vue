<script setup lang="ts">
import { ref } from 'vue';
import MicrophoneIcon from '@/components/Icon/MicrophoneIcon.vue';
import SearchIcon from '@/components/Icon/SearchIcon.vue';
import ImageAddIcon from '@/components/Icon/ImageAddIcon.vue';
import SpeechCapture from '@/components/speech/SpeechCapture.vue'
import ImageCapture from '@/components/image/ImageCapture.vue'
import type { SearchQuery } from '@/utils/types';

const searchInput = ref('');
const showDropdown = ref(false);
const showImageSearch = ref(false);
const showVoiceSearch = ref(false);
const suggestions = ref(['example search 1', 'example search 2', 'example search 3']);
const searchQuery = ref<SearchQuery>({});

const handleBlur = () => {
  // Delay hiding dropdown to allow click events on suggestions
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectSuggestion = (suggestion: string) => {
  searchInput.value = suggestion;
  showDropdown.value = false;
  performSearch();
};

const performSearch = () => {
  console.log('Searching for:', searchInput.value);
  // Implement actual search functionality here
};

const startVoiceSearch = () => {
  console.log('Starting voice search');
  showVoiceSearch.value = true;
  // Implement voice search functionality here
};

const startImageSearch = () => {
  console.log('Starting image search');
  // Implement image search functionality here
  showImageSearch.value = true;
};

const handleVoiceSearch = (blob?: Blob) => {
  console.log('Voice search result:', blob);
  if (blob) {
    blob.text().then((text) => {
      searchInput.value = text;
      performSearch();
    });
  }
  showVoiceSearch.value = false;
};

const handleImageSearch = (query: SearchQuery) => {
  console.log('Image search result:', query);
  searchQuery.value = query;
  if (query) {
    Object.keys(query).forEach((key) => {
      if (query[key] instanceof Blob) {
        const blob = query[key] as Blob;
        console.log(key, blob);
      } else if (query[key] instanceof FileList) {
        const fileList = query[key] as FileList;
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          console.log(key, file);
        }
      }
    });
  }
  showImageSearch.value = false;
};

const handleDragStart = (event: DragEvent) => {
  console.log('Drag started', event);
  showImageSearch.value = true;
};
</script>

<template>
  <div @dragstart="handleDragStart">
    <div class="search-container">
      <div class="search-bar">
        <button class="search-button" @click="performSearch">
          <span class="search-icon">
            <SearchIcon />
          </span>
        </button>
        <input type="text" v-model="searchInput" @focus="showDropdown = true" @blur="handleBlur" placeholder="Search..."
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
      <div class="overlay" v-if="showVoiceSearch">
        <div class="image-search-modal">
          <SpeechCapture @stopped="handleVoiceSearch" />
        </div>
      </div>
      <div class="overlay" v-if="showImageSearch">
        <div class="image-search-modal">
          <!-- Image search functionality goes here -->
          <ImageCapture @close="showImageSearch = false" @query="handleImageSearch" />
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
      <div v-if="searchQuery">
        <h2>Search Results:</h2>
        <div v-for="(value, key) in searchQuery" :key="key">
          <pre>{{`${key}: ${async () => await (value as Blob).text()}`}}</pre>
        </div>
      </div>
      <img src="/living-room.jpg" alt="Living Room" style="border-radius: 24px; box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);" width="200px">
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
