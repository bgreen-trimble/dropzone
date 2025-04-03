<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

enum CaptureState {
  STARTED = 'started',
  STOPPED = 'stopped',
}

// Props definition
const props = withDefaults(defineProps<{
  autoStop?: boolean;
  maxDuration?: number; // in milliseconds
  deviceId?: string;
}>(), {
  autoStop: false,
  maxDuration: 60000, // default to 60 seconds
  deviceId: undefined
});

// Events declaration
const emit = defineEmits<{
  (e: 'started'): void;
  (e: 'stopped'): void;
  (e: 'error', error: Error): void;
  (e: 'audioData', blob: Blob): void;
}>();

// Reactive state
const isRecording = ref(false);
const errorMessage = ref('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);

// Computed properties
const buttonText = computed(() => isRecording.value ? 'Stop Recording' : 'Start Recording');

// Methods
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
};

const startRecording = async () => {
  audioChunks.value = [];
  errorMessage.value = '';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: props.deviceId ? { deviceId: { exact: props.deviceId } } : true
    });

    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      emit('audioData', audioBlob);
      emit('stopped');
      isRecording.value = false;
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    emit('started');

    // Auto-stop recording after maxDuration if specified
    if (props.autoStop && props.maxDuration) {
      setTimeout(() => {
        if (isRecording.value) {
          stopRecording();
        }
      }, props.maxDuration);
    }

  } catch (error) {
    errorMessage.value = 'Failed to access microphone';
    emit('error', error instanceof Error ? error : new Error(String(error)));
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
};

// Lifecycle hooks
onMounted(() => {
  // Check if browser supports mediaDevices
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    errorMessage.value = 'Your browser does not support audio recording';
  }
});

onUnmounted(() => {
  if (isRecording.value) {
    stopRecording();
  }
});
</script>

<template>
  <div class="voice-capture">
    <button
      class="capture-button"
      @click="toggleRecording"
      :class="{ 'recording': isRecording }"
    >
      {{ buttonText }}
    </button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.voice-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.capture-button {
  padding: 12px 24px;
  border-radius: 50px;
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.capture-button.recording {
  background-color: #e74c3c;
  animation: pulse 1.5s infinite;
}

.error-message {
  color: #e74c3c;
  margin-top: 10px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
  }
}
</style>
