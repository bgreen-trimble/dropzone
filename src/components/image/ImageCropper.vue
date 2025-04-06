<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CloseIcon from '@/components/Icon/CloseIcon.vue';
import { Cropper, type CropperResult, type Coordinates } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = defineProps<{
  image?: Blob;
  crop?: Coordinates;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'cropped', event: CropperResult): void;
}>();

const src = ref<string>();
const ignoreChange = ref(true);
const position = ref<{
  left: number,
  top: number
}>();
const size = ref<{
  width: number,
  height: number
}>();

if (props.crop) {
    position.value = {
      left: props.crop.left,
      top: props.crop.top
    }
    size.value = {
      width: props.crop.width,
      height: props.crop.height
    }
  }

const close = () => {
  console.log('Close button clicked')
  emit('close')
}

const change = (event: CropperResult) => {
  console.log('Cropper change event', event)
  if (ignoreChange.value) {
    ignoreChange.value = false
  } else {
    emit('cropped', event);
  }
}

onMounted(() => {
  console.log('ImageCropper mounted', props.image)
  if (props.image) {
    src.value = URL.createObjectURL(props.image)
  }
})

onBeforeUnmount(() => {
  console.log('ImageCropper unmounted')
  if (src.value) {
    URL.revokeObjectURL(src.value)
  }
})
</script>

<template>
  <div class="image-cropper-container">
    <div class="image-capture-header">
      <div style=" flex-grow: 1; text-align: center; font-size: 16px; font-weight: 400;">3DW Image Search</div>
      <CloseIcon @click="close" style="cursor: pointer; margin-left: auto; padding: 10px" />
    </div>
    <div class="image-cropper-body">
      <Cropper v-if="position && size" class="cropper" :src="src" :default-position="position" :default-size="size" @change="change" />
      <Cropper v-else class="cropper" :src="src" @change="change" />
    </div>
  </div>
</template>


<style scoped>
.image-cropper-container {
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

.image-cropper-body {
  display: flex;
  flex-direction: column;
  min-height: 250px;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  margin: 0 20px 20px 20px;
}
</style>
