<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import type { CropperResult, Coordinates } from "vue-advanced-cropper";
import { search } from '@/api/warehouse';
import type { Query } from '@/utils/types';
import { stringify } from '@/utils/query';
import MicrophoneIcon from '@/components/icon/MicrophoneIcon.vue';
import SearchIcon from '@/components/icon/SearchIcon.vue';
import ImageAddIcon from '@/components/icon/ImageAddIcon.vue';
import CloseIcon from '@/components/icon/CloseIcon.vue'
import SpeechCapture from '@/components/speech/SpeechCapture.vue'
import ImageCapture from '@/components/image/ImageCapture.vue'
import ImageCropper from '@/components/image/ImageCropper.vue'

const query = ref<Query>();
const original = ref<Blob>();
const crop = ref<Coordinates>();
const thumbnail = ref<string>();
const searchInput = ref<string>();
const showDropdown = ref(false);
const showImageSearch = ref(false);
const showVoiceSearch = ref(false);
const showImageCropper = ref(false);
const suggestions = ref(['example search 1', 'example search 2', 'example search 3']);
const stringifiedQuery = ref();
const searchResults = ref<string[]>();

const handleBlur = () => {
  // Delay hiding dropdown to allow click events on suggestions
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectSuggestion = (suggestion: string) => {
  searchInput.value = suggestion;
  showDropdown.value = false;
};

const performSearch = () => {
  console.log('Searching for:', query.value);
  if (query.value) {
    search(query.value).then((results) => {
      searchResults.value = results;
    });
  }
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

const handleInputSearch = () => {
  console.log('Input search:', searchInput.value);
  if (searchInput.value) {
    const textBlob = new Blob([searchInput.value], { type: 'text/plain' });

    // If query already exists, replace any text blob with the new one
    const clean = query.value ? query.value.filter(blob => blob.type !== 'text/plain') : [];
    query.value = [...clean, textBlob];
  }

  showDropdown.value = false;
};

const handleVoiceSearch = (result?: Blob) => {
  console.log('Voice search result:', result);
  if (result) {
    const textBlob = new Blob([result], { type: 'text/plain' });

    // If query already exists, replace any text blob with the new one
    const clean = query.value ? query.value.filter(blob => blob.type !== 'text/plain') : [];
    query.value = [...clean, textBlob];
  }
  showVoiceSearch.value = false;
};

const handleImageSearch = (result: Query) => {
  console.log('Image search result:', result);
  if (result) {
    stringify(result).then((items) => {
      console.log('Stringified query:', result);
      stringifiedQuery.value = items;
    });

    // Find the first blob with an image type in the result array
    const imageBlob = result.find(blob => blob.type.startsWith('image/'));

    if (imageBlob) {
      query.value = [imageBlob];
    }
  }
  showImageSearch.value = false;
};

const handleCropSearch = () => {
  console.log('Starting crop search');
  showImageCropper.value = true;
};

const handleImageCropped = (event: CropperResult) => {
  console.log('Image cropped:', event);
  if (event) {
    const { coordinates, canvas: original} = event;
    crop.value = coordinates;
    if (original) {
      const { width, height } = coordinates;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // var canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(original, 0, 0, width, height);
        if (thumbnail.value) {
          URL.revokeObjectURL(thumbnail.value);
        }
        // Create a new object URL for the cropped image
        thumbnail.value = canvas.toDataURL("image/webp");
      }
    }
  }
};

const handleClearSearch = () => {
  console.log('Clearing search');
  searchInput.value = undefined;
  query.value = undefined;
  original.value = undefined;
  crop.value = undefined;
  thumbnail.value = undefined;
  searchResults.value = undefined;
};

const handleDragStart = (event: DragEvent) => {
  console.log('Drag started', event);
  showImageSearch.value = true;
};

watch(query, (value) => {
  if (value) {
    if (searchInput.value) {
      searchInput.value = undefined;
    }
    if (original.value) {
      original.value = undefined;
    }
    if (crop.value) {
      crop.value = undefined;
    }
    if (thumbnail.value) {
      URL.revokeObjectURL(thumbnail.value);
      thumbnail.value = undefined;
    }

    const imageBlob = value.find(blob => blob.type.startsWith('image/'));
    if (imageBlob) {
      original.value = imageBlob;
      thumbnail.value = URL.createObjectURL(imageBlob);
      showImageCropper.value = true;
    }

    const textBlob = value.find(blob => blob.type.startsWith('text/plain'));
    if (textBlob) {
      textBlob.text().then((text) => {
        console.log('Text from blob:', text);
        searchInput.value = text;
      });
    }

    performSearch();
  }
});

onUnmounted(() => {
  if (thumbnail.value) {
    URL.revokeObjectURL(thumbnail.value);
  }
});
</script>

<template>
  <div @dragstart="handleDragStart">
    <div class="search-container">
      <div class="search-bar">
        <button class="search-button" @click="handleInputSearch">
          <span class="search-icon">
            <SearchIcon />
          </span>
        </button>
        <button v-if="thumbnail" class="search-button" @click="handleCropSearch">
          <span class="search-icon">
            <img :src="thumbnail" alt="Thumbnail" style="width: 24px; height: 24px; border-radius: 20%;" />
          </span>
        </button>
        <input type="text" v-model="searchInput" @focus="showDropdown = true" @blur="handleBlur" placeholder="Search..."
          class="search-input" />
        <button v-if="thumbnail || searchInput" class="search-button" @click="handleClearSearch()"
          style="border-right: 1px solid lightgray;">
          <span class="search-icon">
            <CloseIcon />
          </span>
        </button>
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
          <ImageCapture @close="showImageSearch = false" :query="query" @query="handleImageSearch" />
        </div>
      </div>
      <div class="overlay" v-if="showImageCropper && original">
        <div class="image-search-modal">
          <!-- Image search functionality goes here -->
          <ImageCropper @close="showImageCropper = false" @cropped="handleImageCropped" :blob="original" :crop="crop" />
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
      <div v-if="query">
        <h2>Image Search Results:</h2>
        <pre>{{ stringifiedQuery }}</pre>
      </div>
    </div>
    <h2>Thumbnail:</h2>
    <img :src="thumbnail"
      style="border-radius: 24px; box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);" width="200px">

    <div v-if="searchResults">
      <h2>Search Results:</h2>
      <div style="display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap;">
        <div v-for="(result, index) in searchResults" :key="index" style="display: flex 1">
          <!-- Assuming result is a URL to an image -->
          <img :src="result" alt="Search Result"
            style="border-radius: 24px; box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);" width="200px">
        </div>
      </div>
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

.vertical-bar {
  font-size: 14px;
  color: lightgray;
  border-left: 1px solid rgba(248, 249, 250, 0.25);
  height: 65%;
  display: block;
}
</style>
