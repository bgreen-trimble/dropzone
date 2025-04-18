<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import type { CropperResult, Coordinates } from "vue-advanced-cropper";
import { search } from '@/api/warehouse';
import { useSuggestionsStore } from '@/store/suggestions';

import SearchIcon from '@/components/Icon/SearchIcon.vue';
import MicrophoneIcon from '@/components/Icon/MicrophoneIcon.vue';
import ImageAddIcon from '@/components/Icon/ImageAddIcon.vue';
import CloseIcon from '@/components/Icon/CloseIcon.vue'
import TextCapture from '@/components/text/TextCapture.vue'
import SpeechCapture from '@/components/speech/SpeechCapture.vue'
import SuggestionCapture from '@/components/suggest/SuggestionCapture.vue';
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

const suggestionsStore = useSuggestionsStore()

const text = ref<string>();
const image = ref<Blob>();
const crop = ref<Coordinates>();

const thumbnail = ref<string>();

const showSuggestionsCapture = ref(false);
const showImageCapture = ref(false);
const showVoiceCapture = ref(false);
const showImageCropper = ref(false);

const searchResults = ref<string[]>();

const placeholder = computed(() => image.value ? 'Add to your search' : 'Search...');

const performSearch = () => {
  console.log('Performing search with:', text.value);
  if (text.value) {
    const { updateSearches } = suggestionsStore;
    updateSearches(text.value);
    search(text.value, image.value, crop.value).then((results) => {
      searchResults.value = results;
    });
  }
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
    showSuggestionsCapture.value = false;
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

const handleImageSubmit = (value: Blob | File) => {
  if (value) {
    image.value = value as Blob;
  }
  showImageCapture.value = false;
};

/*****************************************
 * IMAGE CROP
 */

const startImageCrop = () => {
  showImageCropper.value = true;
};

const handleImageCrop = (event: CropperResult) => {
  if (event) {
    const { coordinates, canvas: original } = event;
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
 * SUGGESTION CAPTURE
 */

/**
 * Handle the submit event of the suggestions. If a value is provided, update
 * the text and perform a search.
 *
 * @param value
 */
const handleSuggestionSubmit = (value?: string) => {
  if (value) {
    text.value = value;
    showSuggestionsCapture.value = false;
    performSearch();
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
  showSuggestionsCapture.value = false;
};

watch(thumbnail, (_, old) => {
  if (old) {
    URL.revokeObjectURL(old);
  }
});

watch(image, (value) => {
  if (value === undefined) {
    text.value = undefined;
    crop.value = undefined;
    thumbnail.value = undefined;
  }
  else {
    text.value = undefined;
    crop.value = undefined;
    thumbnail.value = URL.createObjectURL(value);

    performSearch();
    showImageCropper.value = true;
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
        <button class="search-button" @click="performSearch">
          <span class="search-icon">
            <SearchIcon />
          </span>
        </button>
        <button v-if="thumbnail" class="search-button" @click="startImageCrop">
          <span class="search-icon">
            <img :src="thumbnail" alt="Thumbnail" style="height: 32px; border-radius: 20%;" />
          </span>
        </button>

        <TextCapture :text="text" :placeholder="placeholder" @focus="handleTextFocus" @escape="handleTextEscape"
          @change="handleTextChange" @submit="handleTextSubmit" />

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
        <div>
          <SpeechCapture @submit="handleVoiceSubmit" />
        </div>
      </div>

      <div class="overlay" v-if="showImageCapture">
        <div>
          <ImageCapture @close="showImageCapture = false" @submit="handleImageSubmit" />
        </div>
      </div>

      <div class="overlay" v-if="showImageCropper">
        <div class="image-search-modal">
          <ImageCropper @close="showImageCropper = false" @cropped="handleImageCrop" :image="image" :crop="crop" />
        </div>
      </div>

      <div v-if="showSuggestionsCapture">
        <SuggestionCapture :text="text" @submit="handleSuggestionSubmit" @close="showSuggestionsCapture = false" />
      </div>
    </div>

    <div>
    </div>
    <div v-if="thumbnail">
      <h2>Cropped Image:</h2>
      <img :src="thumbnail" style="border-radius: 24px; box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);" width="200px">
    </div>

    <div v-if="searchResults">
      <h2>Fake Search Results:</h2>
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

.search-icon {
  color: #5f6368;
}
</style>
