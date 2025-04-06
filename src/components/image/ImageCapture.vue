<script setup lang="ts">
import { ref } from 'vue'
import { fromClipboard, fromDrop, isUrl } from '@/utils';
import CloseIcon from '@/components/Icon/CloseIcon.vue';
import DropIcon from '@/components/Icon/DropIcon.vue';
import TextCapture from '@/components/text/TextCapture.vue';
import { fromText } from '@/utils/text';

// Events declaration
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', query: Blob | File): void;
}>();

const isOverDropZone = ref(false)
const text = ref<string>()
const error = ref<string>()

/**
* Handle the escape event of the text input. Hide the suggestions capture.
*
* @param inFocus
*/
const handleTextEscape = () => {
  emit('close');
};

/**
* Handle the change event of the text input and update the suggestions.
*
* @param value The current value of the text input
*/
const handleTextChange = (value?: string) => {
  text.value = value;
  error.value = undefined
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
    handleButtonSubmit();
  }
};

const close = () => {
  console.log('Close button clicked')
  emit('close')
}

const handleKeyDown = (event: KeyboardEvent) => {
  console.log('handleKeyDown', event)
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    // Ctrl+V or Cmd+V is pressed
    console.log('Paste event detected!');
    isOverDropZone.value = false
    fromClipboard().then((value) => {
      console.log('Image from clipboard:', value)
      if (value) {
        emit('submit', value)
      }
      else {
        error.value = "Can't use this. Try another image."
      }
    }).catch((event: Error) => {
      error.value = "Can't use this. Try another image."
      console.error('Error processing clipboard data:', event)
    })
  }
}

const handleDragEnter = (event: DragEvent) => {
  console.log('handleDragEnter', event)
  event.preventDefault()
  isOverDropZone.value = true
}

const handleDragLeave = (event: DragEvent) => {
  console.log('handleDragLeave', event)
  event.preventDefault()
  isOverDropZone.value = false
}

const handleDrop = (event: DragEvent) => {
  console.log('handleDrop', event)
  event.preventDefault()
  isOverDropZone.value = false

  fromDrop(event).then((value) => {
    console.log('Image from drop:', value)
    if (value) {
      emit('submit', value)
    }
    else {
      error.value = "Can't use this. Try another image."
    }
  }).catch((event: Error) => {
    error.value = "Can't use this. Try another image."
    console.error('Error processing drop data:', event)
  })
}

const handleButtonSubmit = () => {
  console.log('Search button clicked with query:', text.value)
  if (text.value) {
    if (!isUrl(text.value)) {
      error.value = "Can't use this link. Check that your link starts with 'http://' or 'https://' to try again."
      return
    }
    fromText('text/plain', text.value).then((value) => {
      console.log('Image from drop:', value)
      if (value) {
        emit('submit', value)
      }
      else {
        error.value = "Can't use this. Try another image."
      }
    }).catch((event: Error) => {
      error.value = "Can't use this. Try another image."
      console.error('Error processing drop data:', event)
    })
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('File selected:', file);
    if (file) {
      emit('submit', file)
    }
  }
}
</script>

<template>
  <div class="image-capture-container" @dropenter.prevent @dragover.prevent @dragenter="handleDragEnter"
    @dragleave="handleDragLeave" @drop="handleDrop">
    <div class="image-capture-header">
      <div style=" flex-grow: 1; text-align: center; font-size: 16px; font-weight: 400;">3DW Image Search</div>
      <CloseIcon @click="close" style="cursor: pointer; margin-left: auto; padding: 10px" />
    </div>
    <!-- this appear when there is nothing dragged over the drop zone -->
    <div v-if="!isOverDropZone" class="image-capture-body">
      <div v-if="error" class="error">
        <span>{{ error }}</span>
      </div>
      <div tabindex="0" style="display: flex; justify-content: center; align-items: center; height: 140px; width: 100%"
        @keydown="handleKeyDown">
        <DropIcon style="padding-right: 10px" />
        <span>Drag an image here or&nbsp;</span>
        <label for="fileUpload">
          <input id="fileUpload" type="file" multiple style="display: none;" @change="handleFileUpload" />
          <span tabindex="0" role="button" class="update-button">upload a file</span>
        </label>
      </div>
      <div style="display: flex; flex-direction: column; width: 100%;">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 10px;">
          <div style="display: flex; flex-direction: row; width: 100%; justify-content: center; align-items: center; ">
            <div class="bar"></div>
            <div style="color: rgb(95, 99, 104); font-size: 14px; margin-left: 20px; margin-right: 20px;">OR</div>
            <div class="bar"></div>
          </div>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; margin: 10px 10px 0 10px; ">
          <TextCapture class="search-input" :text="text" placeholder="Paste image link" @escape="handleTextEscape"
            @change="handleTextChange" @submit="handleTextSubmit"></TextCapture>
          <button class="search-button" tabindex="0" role="button" @click="handleButtonSubmit">Search</button>
        </div>
      </div>
    </div>
    <!-- this pops up when a drag enters the drop zone -->
    <div v-else class="image-capture-body" style="background: #f0f6ff;">
      <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <span>Drop image here</span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.image-capture-container {
  color-scheme: light;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.image-capture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.image-capture-body {
  display: flex;
  flex-direction: column;
  min-height: 250px;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  margin: 0 20px 20px 20px;
  border: dashed 2px #e0e0e0;
  border-radius: 20px;
}

.bar {
  display: flex;
  font-size: 14px;
  border-top: 1px solid rgb(232, 234, 237);
  flex-grow: 1;
  height: 1px;
}

.search-input-container {
  font-size: 14px;
}

.search-button {
  color-scheme: light;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  border: 1px solid rgb(218, 220, 224);
  color: rgb(26, 115, 232);
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  justify-content: center;
  letter-spacing: .25px;
  margin-left: 8px;
  padding: 8px 24px;
  outline: 0;
  height: 41px;
}

.search-input {
  background-color: #fff;
  border: 1px solid rgb(218, 220, 224);
  color: rgb(60, 64, 67);
  border-radius: 36px;
  font-size: 14px;
  height: 40px;
  padding: 0 24px;
  width: 100%;
  outline: 0;
}

.update-button {
  font-size: 16px;
  line-height: 25px;
  color: rgb(25, 103, 210);
  cursor: pointer;
  outline: 0;
}

.error {
  background-color: rgb(242, 139, 130);
  width: 100%;
  flex: 1;
  font-size: 12px;
  padding: 5px;
  text-align: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
