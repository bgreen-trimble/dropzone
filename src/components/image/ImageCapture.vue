<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SearchQuery } from '@/utils/types';
import { fromDropEventX } from '@/utils/drag';
import CloseIcon from '@/components/Icon/CloseIcon.vue';
import DropIcon from '@/components/Icon/DropIcon.vue';

// Events declaration
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'query', query: SearchQuery): void;
}>();

const isOverDropZone = ref(false)
const searchInput = ref('')

// functions
const close = () => {
  console.log('Close button clicked')
  // Add your close logic here
  emit('close')

}

const handleKeyDown = (event: KeyboardEvent) => {
  console.log('handleKeyDown', event)
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    // Ctrl+V or Cmd+V is pressed
    // Your code to handle the paste event goes here
    console.log('Paste event detected!');

    close()
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
  const query = fromDropEventX(event)
  emit('query', query)
}

const handleSubmit = () => {
  console.log('Search button clicked with query:', searchInput.value)
  const query = { 'text/plain': new Blob([searchInput.value], { type: 'text/plain' }) }
  emit('query', query)
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('File selected:', file);
    // Handle the file upload logic here
  }
}
// lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="image-capture-container"  @dropenter.prevent @dragover.prevent
  @dragenter="handleDragEnter" @dragleave="handleDragLeave" @drop="handleDrop">
    <div class="image-capture-header">
      <div style=" flex-grow: 1; text-align: center; font-size: 16px; font-weight: 400;">3DW Image Search</div>
      <CloseIcon @click="close" style="cursor: pointer; margin-left: auto; padding: 10px" />
    </div>
    <div v-if="!isOverDropZone" class="image-capture-body">
      <div tabindex="0" style="display: flex; justify-content: center; align-items: center; height: 140px; width: 100%" @keydown="handleKeyDown">
        <DropIcon style="padding-right: 10px" />
        <span>Drag an image here or&nbsp;</span>
        <input id="fileUpload" type="file" multiple style="display: none;" @change="handleFileUpload" />
        <span tabindex="0" role="button" class="update-button">upload a file</span>
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
          <input class="search-input" v-model="searchInput" placeholder="Paste image link" autocomplete="false"
            autocorrect="false" text="text">
          <button class="search-button" tabindex="0" role="button" @click="handleSubmit">Search</button>
        </div>
      </div>
    </div>
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
</style>
