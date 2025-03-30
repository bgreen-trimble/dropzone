<script setup lang="ts">
import { ref, watch } from 'vue'
import { fromClipboard, fromDropEvent, fromTransfer, type TransferItem, type TransferImage } from '@/utils'

// Make FileList available to the template
const FileList = window.FileList

const userAgent = navigator.userAgent;

const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');

const dropZone = ref()
const eventType = ref()
const transferred = ref<TransferItem[]>()
const images = ref<TransferImage[]>()
const submitInput = ref()
const isDraggingOver = ref(false)

const handleDragOver = (event: DragEvent) => {
  console.log('handleDragOver', event)
  event.preventDefault()
  isDraggingOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  console.log('handleDragLeave', event)
  event.preventDefault()
  isDraggingOver.value = false
}


const handleDrop = (event: DragEvent) => {
  console.log('handleDrop', event)
  event.preventDefault()
  submitInput.value = undefined
  eventType.value = 'Drag Event: Drop'
  transferred.value = fromDropEvent(event)
  isDraggingOver.value = false
}

const handleClipboard = async (event: MouseEvent) => {
  console.log('handleClick', event)
  submitInput.value = undefined
  eventType.value = 'Clipboard'

  fromClipboard()
    .then((items) => {
      console.log('items', items)
      transferred.value = items
    })
    .catch((error) => {
      console.error('Error reading clipboard:', error)
    })
}

const handleFileUpload = (event: Event) => {
  console.log('handleFileUpload', event)
  submitInput.value = undefined
  eventType.value = 'File Upload'
  const target = event.target as HTMLInputElement
  if (target.files) {
    eventType.value = 'File Upload'
    transferred.value = [{ type: 'files', data: target.files }]
  }
}

const handleSubmit = (event: Event) => {
  console.log('handleSubmit', event)
  eventType.value = 'Submit'
  transferred.value = [{ type: 'text/plain', data: submitInput.value }]
}

watch(transferred, (items) => {
  if (items) {
    fromTransfer(items).then((items) => {
      console.log('blobs', items)
      images.value = items
    })
  }
})

watch(images, (_, old) => {
  if (old) {
    old.forEach((image) => {
      URL.revokeObjectURL(image.data)
    })
  }
})
</script>

<template>
  <main style="font-family: sans-serif;">
    <div>
      <div style="display: flex; width: 100%; gap: 8px; align-items: center; ">
        <img src="../assets/download-file-icon.svg" alt="Drop Zone" style="width: 32px; height: 32px;" />
        <h1>Drop Zone</h1>
      </div>
      <div ref="dropZone" style="padding: 32px; border-radius: 8px; background-color: lightgray;"
        :style="isDraggingOver ? 'border: 2px solid blue;' : 'border: 2px solid lightgray;'" @dragover.prevent
        @dragenter.prevent @dragleave.prevent @drop.prevent @drop="handleDrop" @dragleave="handleDragLeave"
        @dragover="handleDragOver">
        <div style="display: flex; justify-content: center; width: 100%; gap: 8px;">
          <svg width="59" height="45" viewBox="0 0 59 45" fill="none" xmlns="http://www.w3.org/2000/svg"
            style="vertical-align: middle; margin: auto 0;">
            <path d="M40.3332 13.747L1.58323 13.747L1.58323 43.4553L40.3332 43.4553L40.3332 13.747Z" class="ArIAXb">
            </path>
            <path d="M40.3332 13.747L17.0832 13.747L17.0832 33.122L40.3332 33.122L40.3332 13.747Z" class="qOFLsb">
            </path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.614479 12https://www.wired.com/story/natal-conference-matchmaking/.7783L6.74988 12.7783L6.74988 14.7158L2.55198 14.7158L2.55198 18.9137L0.614479 18.9137L0.614479 12.7783Z"
              fill="#BDC1C6"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M39.3644 42.4866L39.3644 38.2887L41.3019 38.2887L41.3019 44.4241L35.1665 44.4241L35.1665 42.4866L39.3644 42.4866Z"
              fill="#BDC1C6"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.614479 38.2887L2.55198 38.2887L2.55198 42.4866L6.74987 42.4866L6.74987 44.4241L0.614479 44.4241L0.614479 38.2887Z"
              fill="#BDC1C6"></path>
            <path d="M19.6665 30.2531H58.4165L58.4165 0.544722H19.6665L19.6665 30.2531Z" fill="#AECBFA"></path>
            <path
              d="M19.6665 21.8429L19.6665 30.2525L58.4168 30.2525L58.4168 19.7406L49.6667 12.4069C48.6234 11.5342 47.2931 11.0699 45.9272 11.1018C44.5614 11.1337 43.2547 11.6596 42.2542 12.5801L33.4166 20.7918L28.4166 17.2548C27.7332 16.7781 26.9013 16.5563 26.0684 16.6288C25.2354 16.7012 24.4554 17.0632 23.8666 17.6505L19.6665 21.8429Z"
              fill="#669DF6"></path>
            <path
              d="M30.0056 12.9386C31.7315 12.9386 33.1306 11.5395 33.1306 9.8136C33.1306 8.08773 31.7315 6.68863 30.0056 6.68863C28.2798 6.68863 26.8807 8.08773 26.8807 9.8136C26.8807 11.5395 28.2798 12.9386 30.0056 12.9386Z"
              fill="#E8F0FE"></path>
          </svg>
          <div style="display: flex; justify-content: center; ">
            <h2 v-if="!isSafari">Drop here, </h2>
            <h2 v-else>Drop here or </h2>
            <label for="fileUpload" style="display: flex; align-items: center; cursor: pointer;">
              <input id="fileUpload" type="file" multiple style="display: none;" @change="handleFileUpload" />
              <h2 style="color: #1a73e8; margin: 0 8px; text-decoration: none;">upload a file</h2>
            </label>

            <h2 v-if="!isSafari">or copy from clipboard&nbsp;</h2>
            <svg v-if="!isSafari" @pointerdown="handleClipboard" xmlns="http://www.w3.org/2000/svg" width="32"
              height="32" fill="currentColor" viewBox="0 0 24 24"
              style="cursor: pointer; vertical-align: middle; margin: auto 0;">
              <path
                d="M4 6h2v1h8V6h2v3c0 .55.45 1 1 1s1-.45 1-1V6c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S7 2.34 7 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5c.55 0 1-.45 1-1s-.45-1-1-1H4zm8 7v9c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1h-8c-.55 0-1 .45-1 1m8 8h-6v-1h6zm0-3h-6v-1h6zm0-3h-6v-1h6z" />
            </svg>
          </div>
        </div>
        <div style="display: flex; align-items: center; width: 100%; gap: 8px;">
          <div class="bar"></div>
          <h3 class="or-label">OR</h3>
          <div class="bar"></div>
        </div>
        <div style="display: flex; justify-content: center; width: 100%; margin-top: 16px;">
          <input v-model="submitInput" type="text" placeholder="Paste URL here"
            style="padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; width: 199%;"
            @keyup.enter="handleSubmit" />
          <button @click="handleSubmit"
            style="padding: 8px 16px; background-color: #1a73e8; color: white; border: none; border-radius: 4px; margin-left: 8px; cursor: pointer;">
            Submit
          </button>
        </div>
      </div>

      <div v-if="images">
        <h2>Images</h2>
        <h3 v-if="images.length === 0" style="color: red;">Unable to retrieve images.</h3>
        <div v-else style="display: flex; flex-wrap: wrap; gap: 16px;">
          <div v-for="(image, index) in images" :key="index"
            style="display: flex; flex-direction: column; align-items: center; overflow: hidden;">
            <img :src="image.data as string" alt="Image" style="object-fit: cover;" height="256px" />
            <h4>{{ image.type }}</h4>
          </div>
        </div>
      </div>

      <div v-if="eventType">
        <h2>{{ eventType }}</h2>
        <div v-if="transferred">
          <h3>Items</h3>
          <ul>
            <li v-for="(item, index) in transferred" :key="index">
              <div v-if="item.data instanceof FileList">
                <strong> {{ item.type }} </strong>
                <ul>
                  <li v-for="(file, fileIndex) in item.data as FileList" :key="fileIndex">
                    {{ file.name }} ({{ file.type || 'unknown' }}, {{ (file.size / 1024).toFixed(2) }} KB)
                  </li>
                </ul>
              </div>
              <div v-else>
                <strong>{{ item.type }}: </strong>{{ item.data }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bar {
  border-top: 1px solid rgb(60, 64, 67);
  flex-grow: 1;
  height: 0;
}

.or-label {
  cursor: default;
  flex-shrink: 0;
  font-size: 14px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
