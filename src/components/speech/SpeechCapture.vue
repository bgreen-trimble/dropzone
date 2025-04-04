<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import CloseIcon from '@/components/Icon/CloseIcon.vue';

const { isListening, isSupported, stop, result, start, error } = useSpeechRecognition({
  lang: 'en-US',
  continuous: false,
  interimResults: true,
})

// Events declaration
const emit = defineEmits<{
  (e: 'started'): void;
  (e: 'stopped', blob?: Blob): void;
  (e: 'error', error: Error): void;
}>();

const isRecognizing = ref(false);

watch(isListening, (value) => {
  console.log('Listening state changed:', value);
  if (!value) {
    stop();
    emit('stopped', new Blob([result.value], { type: 'text/plain' }));
  } else {
    isRecognizing.value = true;
  }
});

watch(result, (value) => {
  console.log('Result changed:', value);
  if (value) {
    isRecognizing.value = true;
  }
});

onMounted(() => {
  result.value = '';
  if (isSupported) {
    start();
    emit('started');
  } else {
    emit('error', new Error('Speech recognition is not supported in this browser.'));
  }
});

onUnmounted(() => {
  if (isListening) {
    stop();
  }
});
</script>

<template>
  <div class="speech-container">
    <div class="speech-row header-row">
      <!-- Header content will go here -->
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <CloseIcon @click="stop" style="cursor: pointer; margin-left: auto; padding: 10px" />
      </div>
    </div>
    <div class="speech-row content-row">
      <div v-if="isListening" style="display: flex; justify-content: center; align-items: center;">
        <div style="font-size: 32px; text-align: left; padding-left: 20px">
          <span v-if="result.length !== 0">{{ result }}</span>
          <span v-else>Listening...</span>
          <span v-if="error">Please check you microphone and audio levels.</span>
        </div>
        <div class="mic-icon" :class="{ 'pulsing': result.length !== 0 }" style="margin-left: auto;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"
              fill="currentColor" />
            <path
              d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"
              fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speech-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.speech-row {
  width: 100%;
}

.header-row {
  background-color: #ffffff;
}

.content-row {
  flex-grow: 1;
  min-height: 120px;
}

.mic-icon {
  color: #e74c3c;
  margin-top: 10px;
  margin-right: 20px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 8px;
  display: inline-flex;
  background-color: rgba(255, 255, 255, 0.9);
}

.mic-icon.pulsing {
  color: white;
  background-color: #e74c3c;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(231, 76, 60, 0.7);
  }

  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(231, 76, 60, 0.7);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(231, 76, 60, 0.7);
  }
}
</style>
