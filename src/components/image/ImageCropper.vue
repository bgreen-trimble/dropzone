<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Crop } from '@/utils/types';
import CloseIcon from '@/components/icon/CloseIcon.vue';
import { Cropper, Preview } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

type ChangeEvent = {
  coordinates: {
    width: number,
    height: number,
    left: number,
    top: number
  }
};

const props = defineProps<{
  blob: Blob;
  crop?: Crop;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'cropped', crop: Crop): void;
}>();

const src = ref<string>();
const cropper = ref<string>();
const ignoreChange = ref(true);

const close = () => {
  console.log('Close button clicked')
  emit('close')
}

const change = (event: ChangeEvent) => {
  console.log('Cropper change event', event)
  if (ignoreChange.value) {
    ignoreChange.value = false
  } else {
    const { coordinates } = event;
    const crop: Crop = coordinates;
    emit('cropped', crop);
  }
}

onMounted(() => {
  console.log('ImageCropper mounted', props.blob)
  if (props.blob) {
    src.value = URL.createObjectURL(props.blob)
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
      <h3>{{ crop }}</h3>
      <Cropper ref="cropper" class="cropper" :src="src" :default-position="{
        width: props.crop?.width || 400,
        height: props.crop?.height || 400,
      }" :default-size="{
        left: props.crop?.left || 0,
        top: props.crop?.top || 0,
      }" @change="change" />
      <Preview ref="preview" class="preview" />
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
