<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from './SvgIcon.vue';

export default defineComponent({
  name: 'MicrophoneIcon',
  extends: SvgIcon,
  components: { SvgIcon },
});
</script>

<template>
  <SvgIcon>
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :fill="fill" view-box="0 0 24 24">
      <path
      d="M18.99 12.97a.857.857 0 0 0-.85-.97c-.42 0-.77.3-.83.71-.37 2.61-2.72 4.39-5.25 4.39s-4.88-1.77-5.25-4.39a.84.84 0 0 0-.83-.71c-.52 0-.92.46-.85.97.46 2.97 2.96 5.3 5.93 5.75V20H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-1.94v-1.28c2.96-.43 5.47-2.78 5.93-5.75M12.06 15c1.66 0 2.99-1.34 2.99-3V6c.01-1.66-1.33-3-2.99-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3m-1-9c0-.55.45-1 1-1s1 .45 1 1v6c-.01.56-.44 1-1 1s-1-.45-1-1z" />
  </svg>
  </SvgIcon>
</template>
