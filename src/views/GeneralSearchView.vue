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
import TextCapture from '@/components/text/TextCapture.vue'
import SpeechCapture from '@/components/speech/SpeechCapture.vue'
import ImageCapture from '@/components/image/ImageCapture.vue'
import ImageCropper from '@/components/image/ImageCropper.vue'

/**
 * A search is made up of parts:
 * - Text
 * - Image
 *     - source image
 *     - cropped area
 */
/**
 * When a search occurs save that search in case the user wants to
 * change it but not submit it yet.
 *
 * Use Cases
 *
 * 1. User changes the original search image.
 *      - update the search image
 *      - clear the search text
 * 2. User clicks clear button.
 *     - if the text is not empty, clear the text
 *     - if the text is empty, clear the image
 */

// Last search query
const last = ref<Query>();

// Unsubmitted search query elements
const text = ref<string>();
const image = ref<Blob>();
const crop = ref<Coordinates>();

const thumbnail = ref<string>();

const original = ref<Blob>();
const searchInput = ref<string>();

const showSuggestionsCapture = ref(false);
const showImageCapture = ref(false);
const showVoiceCapture = ref(false);
const showImageCropper = ref(false);

// All the results of the image capture
const stringifiedImageCaptureResults = ref();


const searchResults = ref<string[]>();

const suggestions = ref(['example search 1', 'example search 2', 'example search 3']);

/**
 * Inserts any blobs of a specific type in the query with a new blob. If the
 * query already contains blobs of that type, they will be removed. If the query is
 * undefined, it will be created with the new blob.
 * @param query The current query array
 * @param blob The new blob to add
 * @param type The MIME type prefix to replace (e.g., 'text/', 'image/')
 * @returns A new query array with the replaced blob
 */
const updateQuery = (blob: Blob, query?: Query, type?: string): Query => {
  const clean = query ? query.filter(item => !item.type.startsWith(type ? type : blob.type)) : [];
  return [...clean, blob];
};

const selectSuggestion = (suggestion: string) => {
  searchInput.value = suggestion;
  showSuggestionsCapture.value = false;
};

const performSearch = () => {
  console.log('Performing search with:', text.value);

  showSuggestionsCapture.value = false;
  /*
  console.log('Searching for:', next.value);
  if (next.value) {
    search(next.value).then((results) => {
      searchResults.value = results;
    });
  }
  */
};

/*****************************************
 * TEXT CAPTURE
 */

/**
* Handle the focus event of the text input. If the input is focused, show
* suggestions. If the input is blurred (lost focus), hide the dropdown.
* @param inFocus
*/
const handleTextFocus = (inFocus: boolean) => {
  showSuggestionsCapture.value = inFocus;
};

/**
* Handle the escape event of the text input. Hide the suggestions capture.
*
* @param inFocus
*/
const handleTextEscape = () => {
  showSuggestionsCapture.value = false;
};

/**
* Handle the change event of the text input and update the suggestions.
*
* @param value The current value of the text input
*/
const handleTextChange = (value?: string) => {
  console.log('Text changed:', value);
  text.value = value;

  if (value) {
    showSuggestionsCapture.value = true;
  }
  // TODO: Update the suggestions based on the input value
};

/**
 * Handle the submit event of the text input. If a value is provided, update
 * the text and perform a search.
 *
 * @param value
 */
const handleTextSubmit = (value?: string) => {
  if (value) {
    text.value = value;
    performSearch();
  }
};

/*****************************************
 * VOICE CAPTURE
 */

const startVoiceCapture = () => {
  showVoiceCapture.value = true;
};

/**
 * Handle the result of the voice capture. If a text is provided, it will be
 * added to the query and a search is executed.
 *
 * @param value The text containing the voice capture result
 */
const handleVoiceSubmit = (value?: string) => {
  if (value) {
    text.value = value;
    performSearch()
  }

  showVoiceCapture.value = false;
};

/*****************************************
 * IMAGE CAPTURE
 */

const startImageCapture = () => {
  showImageCapture.value = true;
};

const handleImageSubmit = (result: Query) => {
  console.log('Image search result:', result);
  if (result) {
    stringify(result).then((items) => {
      console.log('Stringified query:', result);
      stringifiedImageCaptureResults.value = items;
    });

    // Find the first blob with an image type in the result array
    const imageBlob = result.find(blob => blob.type.startsWith('image/'));

    if (imageBlob) {
      //next.value = [imageBlob];
    }
  }
  showImageCapture.value = false;
};

/*****************************************
 * IMAGE CROP
 */

const startImageCrop = () => {
  console.log('Starting crop search');
  showImageCropper.value = true;
};

const handleImageCrop = (event: CropperResult) => {
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

/*****************************************
 * CONTROL HANDLERS
 */

const handleClearSearch = () => {
  if (text.value?.length) {
    text.value = undefined;
  } else {
    image.value = undefined;
  }
};

const handleDragStart = () => {
  showImageCapture.value = true;
};

/*
watch(next, (value) => {
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
*/

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
        <button class="search-button" @click="performSearch">
          <span class="search-icon">
            <SearchIcon />
          </span>
        </button>
        <button v-if="thumbnail" class="search-button" @click="startImageCrop">
          <span class="search-icon">
            <img :src="thumbnail" alt="Thumbnail" style="width: 24px; height: 24px; border-radius: 20%;" />
          </span>
        </button>

        <TextCapture :text="text" @focus="handleTextFocus" @escape="handleTextEscape" @change="handleTextChange" @submit="handleTextSubmit"/>

        <button v-if="text || image" class="search-button" @click="handleClearSearch()"
          style="border-right: 1px solid lightgray;">
          <span class="search-icon">
            <CloseIcon />
          </span>
        </button>
        <button class="search-button" @click="startVoiceCapture">
          <span class="search-icon">
            <MicrophoneIcon />
          </span>
        </button>

        <button class="search-button" @click="startImageCapture">
          <span class="search-icon">
            <ImageAddIcon />
          </span>
        </button>
      </div>
      <div class="overlay" v-if="showVoiceCapture">
        <div class="image-search-modal">
          <SpeechCapture @submit="handleVoiceSubmit" />
        </div>
      </div>
      <div class="overlay" v-if="showImageCapture">
        <div class="image-search-modal">
          <!-- Image search functionality goes here -->
          <ImageCapture @close="showImageCapture = false" :query="next" @query="handleImageSubmit" />
        </div>
      </div>
      <div class="overlay" v-if="showImageCropper && original">
        <div class="image-search-modal">
          <!-- Image search functionality goes here -->
          <ImageCropper @close="showImageCropper = false" @cropped="handleImageCrop" :blob="original" :crop="crop" />
        </div>
      </div>
      <div class="search-dropdown" v-if="showSuggestionsCapture">
        <div class="dropdown-item" v-for="(suggestion, index) in suggestions" :key="index"
          @mousedown="selectSuggestion(suggestion)">
          <span class="suggestion-icon">🔍</span>
          <span class="suggestion-text">{{ suggestion }}</span>
        </div>
      </div>
    </div>

    <div>
      <div v-if="last">
        <h2>Image Search Results:</h2>
        <pre>{{ stringifiedImageCaptureResults }}</pre>
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
