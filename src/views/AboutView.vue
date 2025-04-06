<script setup lang="ts">
// Imports go here
const buildDate = import.meta.env.VITE_BUILD_DATE ? import.meta.env.VITE_BUILD_DATE : new Date().toISOString();

// Reactive state
</script>

<template>
  <div class="about">
    <h1>About</h1>
    <p>Build Date: {{ buildDate }}</p>
  </div>
</template>


<style scoped>
.about {
  font-family: sans-serif;
  padding: 20px;
}

</style>
