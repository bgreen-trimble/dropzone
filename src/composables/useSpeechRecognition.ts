import { ref, watch, shallowRef, unref } from 'vue'
import type { Ref } from 'vue'

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition
    webkitSpeechRecognition: SpeechRecognition
  }
}

interface UseSpeechRecognitionOptions {
  lang: Ref<string> | string
  continuous: boolean
  interimResults: boolean
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean
  isListening: Ref<boolean>
  isFinal: Ref<boolean>
  recognition: SpeechRecognition | false
  result: Ref<string>
  error: Ref<string | undefined>
  toggle: (value?: boolean) => void
  start: () => void
  stop: () => void
}

export function useSpeechRecognition({
  lang,
  continuous,
  interimResults,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  const isListening = ref(false)
  const isFinal = ref(false)

  const result = ref('')
  const error = shallowRef<string | undefined>(undefined)

  // Checks if the browser supports the API
  const isSupported = Boolean(SpeechRecognition)

  // The speech recognition constructor
  const recognition: SpeechRecognition | false = isSupported
    ? new (SpeechRecognition as unknown as new () => SpeechRecognition)()
    : false

  const toggle = (value: boolean = isListening.value) => {
    isListening.value = value
  }

  const start = () => {
    isListening.value = true
  }

  const stop = () => {
    isListening.value = false
  }

  if (isSupported && recognition) {
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = unref(lang)

    recognition.onstart = () => {
      isFinal.value = false
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // raw words that the user spoke
      const transcript = Array.from(event.results)
        .map((result) => {
          isFinal.value = result.isFinal
          return result[0]
        })
        .map((result) => result.transcript)
        .join('')

      result.value = transcript
      error.value = undefined
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      error.value = 'Speech recognition error detected: ' + event.error
    }

    recognition.onend = () => {
      isListening.value = false
    }

    watch(isListening, () => {
      if (isListening.value) {
        // Starting the speech recognition
        recognition.start()
      } else {
        // Stopping the recognition
        recognition.stop()
      }
    })
  }

  return {
    isSupported,
    isListening,
    isFinal,
    recognition,
    result,
    error,
    toggle,
    start,
    stop,
  }
}
