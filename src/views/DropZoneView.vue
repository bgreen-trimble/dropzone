<script setup lang="ts">
import { ref, watch } from 'vue'
import { fromClipboard, fromDropEvent, fromTransfer, type TransferItem, type TransferImage } from '@/utils'

// Make FileList available to the template
const FileList = window.FileList

const dropZone = ref()
const eventType = ref()
const transferred = ref<TransferItem[]>()
const images = ref<TransferImage[]>()
const submitInput = ref()
const isDraggingOver = ref(false)
const error = ref(false)

const handleDragEnter = (event: DragEvent) => {
  console.log('handleDragEnter', event)
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

const handleKeyDown = (event: KeyboardEvent) => {
  console.log('handleKeyDown', event)
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    // Ctrl+V or Cmd+V is pressed
    // Your code to handle the paste event goes here
    console.log('Paste event detected!');
    submitInput.value = undefined
    eventType.value = 'Clipboard'

    // To access the pasted data, you can use the 'paste' event
    fromClipboard()
      .then((items) => {
        console.log('items', items)
        transferred.value = items
      })
      .catch((error) => {
        console.error('Error reading clipboard:', error)
        transferred.value = undefined
      })
  }
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

/**
 * Handle the submit event
 * This is an artificial form of data transfer. It transforms the input value
 * into a text/plain data type and sets it as the data of the transfer.
 */
const handleSubmit = (event: Event) => {
  console.log('handleSubmit', event)
  eventType.value = 'Submit'
  transferred.value = [{ type: 'text/plain', data: submitInput.value }]
}

watch(transferred, (items) => {
  console.log('watch transferred in:', items?.length)
  if (items?.length) {
    // convert the new transfer items to images
    fromTransfer(items).then((items) => {
      console.log('transfer item', items)
      console.log('watch transferred out:', items?.length)
      images.value = items

      if (items?.length) {
        error.value = false
      } else {
        error.value = true
      }
    })
  }
})

watch(images, (_, old) => {
  if (old) {
    // Revoke the old object URLs to free up memory
    old.forEach((image) => {
      URL.revokeObjectURL(image.data)
    })
  }
})

</script>

<template>
  <div>
    <div ref="dropZone" tabindex="0" class="image-search-base NzSfif" @dropenter.prevent @dragover.prevent
      @dragenter="handleDragEnter" @dragleave="handleDragLeave" @drop="handleDrop" @keydown="handleKeyDown">
      <div class="KoWHpd">
        <div>
          <div style="text-align: center; font-size: 16px; font-weight: 400; margin-bottom: 14px">3DW Image Search
          </div>
        </div>
        <div class="NrdQVe">
          <div v-if="error" class="alTBQe">
            <div class="OHzWjb">
              <span>Can't use this link. Check for typos or use another link to try again.</span>
            </div>
          </div>
          <div v-if="isDraggingOver === false" class="f6GA0">
            <div class="BH9rn">
              <div class="RaoUUe">
                <svg width="59" height="45" viewBox="0 0 59 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40.3332 13.747L1.58323 13.747L1.58323 43.4553L40.3332 43.4553L40.3332 13.747Z"
                    class="ArIAXb"></path>
                  <path d="M40.3332 13.747L17.0832 13.747L17.0832 33.122L40.3332 33.122L40.3332 13.747Z" class="qOFLsb">
                  </path>
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.614479 12.7783L6.74988 12.7783L6.74988 14.7158L2.55198 14.7158L2.55198 18.9137L0.614479 18.9137L0.614479 12.7783Z"
                    fill="#BDC1C6"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M39.3644 42.4866L39.3644 38.2887L41.3019 38.2887L41.3019 44.4241L35.1665 44.4241L35.1665 42.4866L39.3644 42.4866Z"
                    fill="#BDC1C6"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.614479 38.2887L2.55198 38.2887L2.55198 42.4866L6.74987 42.4866L6.74987 44.4241L0.614479 44.4241L0.614479 38.2887Z"
                    fill="#BDC1C6"></path>
                  <path d="M19.6665 30.2531H58.4165L58.4165 0.544722H19.6665L19.6665 30.2531Z" fill="#AECBFA">
                  </path>
                  <path
                    d="M19.6665 21.8429L19.6665 30.2525L58.4168 30.2525L58.4168 19.7406L49.6667 12.4069C48.6234 11.5342 47.2931 11.0699 45.9272 11.1018C44.5614 11.1337 43.2547 11.6596 42.2542 12.5801L33.4166 20.7918L28.4166 17.2548C27.7332 16.7781 26.9013 16.5563 26.0684 16.6288C25.2354 16.7012 24.4554 17.0632 23.8666 17.6505L19.6665 21.8429Z"
                    fill="#669DF6"></path>
                  <path
                    d="M30.0056 12.9386C31.7315 12.9386 33.1306 11.5395 33.1306 9.8136C33.1306 8.08773 31.7315 6.68863 30.0056 6.68863C28.2798 6.68863 26.8807 8.08773 26.8807 9.8136C26.8807 11.5395 28.2798 12.9386 30.0056 12.9386Z"
                    fill="#E8F0FE"></path>
                </svg>
              </div>
              <div class="ZeVBtc">
                <span>Drag an image here or </span>
                <label for="fileUpload">
                  <input  ref="fileInput" id="fileUpload" type="file" name="" multiple style="display: none;" @change="handleFileUpload" />
                  <span tabindex="0" role="button" class="DV7the">upload a file</span>
                </label>
              </div>
            </div>
            <div class="e8Eule" jsname="Awucdb">
              <div class="YJx25">
                <div class="diOlIe"></div>
                <div class="aHK1bd">OR</div>
                <div class="diOlIe"></div>
              </div>
              <div class="PXT6cd">
                <input class="cB9M7" v-model="submitInput" placeholder="Paste image link" autocomplete="false"
                  autocorrect="false" text="text">
                <button class="Qwbd3" tabindex="0" role="button" @click="handleSubmit">Search</button>
              </div>
            </div>
          </div>
          <div v-else class="CacfB">
            <div class="ZeVBtc" style="text-align: center;">Drop an image here</div>
          </div>
        </div>
      </div>
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
</template>

<style scoped>
.image-search-base {
  color-scheme: light;
  font-family: Roboto, Arial, sans-serif;
}

.NzSfif {
  font-size: 14px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 4px 6px rgba(32, 33, 36, 0.28);
  width: 100%;
  z-index: 989;
}

.KoWHpd {
  color-scheme: light;
  font-family: Roboto, Arial, sans-serif;
  font-size: 14px;
  padding: 20px;
}

.NrdQVe {
  font-size: 14px;
  background: rgb(248, 249, 250);
  border: 1px dashed #c0c0c0;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 280px;
}

.alTBQe {
  font-size: 14px;
  align-items: center;
  background-color: rgb(252, 232, 230);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  justify-content: space-between;
}

.OHzWjb {
  color: rgb(179, 20, 18);
  flex: 1;
  font-size: 12px;
  padding: 5px;
  text-align: center;
}

.CacfB {
  font-size: 14px;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #f0f6ff;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.ZeVBtc {
  color: rgb(95, 99, 104);
  font-size: 16px;
  line-height: 25px;
  max-width: 300px;
  width: 100%;
}

.DV7the {
  font-size: 16px;
  line-height: 25px;
  color: rgb(25, 103, 210);
  cursor: pointer;
  outline: 0;
}

.f6GA0 {
  font-size: 14px;
  height: 100%;
  justify-content: center;
  margin-top: 0;
  align-items: center;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  flex-grow: 1;
}

.BH9rn {
  font-size: 14px;
  align-items: center;
  display: inline-flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: normal;
  padding-top: 16px;
}

.RaoUUe {
  font-size: 14px;
  display: inline-flex;
  margin-right: 18px;
}

.e8Eule {
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  width: 100%;
}

.YJx25 {
  font-size: 14px;
  align-items: center;
  display: flex;
}

.diOlIe {
  font-size: 14px;
  border-top: 1px solid rgb(232, 234, 237);
  flex-grow: 1;
  height: 0;
}

.aHK1bd {
  color: rgb(95, 99, 104);
  cursor: default;
  flex-shrink: 0;
  font-size: 14px;
  margin-left: 20px;
  margin-right: 20px;
}

.PXT6cd {
  font-size: 14px;
  display: flex;
  margin-top: 14px;
}

.cB9M7 {
  background-color: #fff;
  border: 1px solid rgb(218, 220, 224);
  color: rgb(60, 64, 67);
  border-radius: 36px;
  display: inline-flex;
  flex-grow: 1;
  font-size: 14px;
  height: 40px;
  padding: 0 24px;
  width: 100%;
  outline: 0;
}

.Qwbd3 {
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
}

.Qwbd3:hover {
  background: rgb(232, 234, 237);
}

.Qwbd3:active {
  background: rgb(232, 234, 237);
}
</style>
