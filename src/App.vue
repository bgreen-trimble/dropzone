<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main style="font-family: sans-serif;">
    <div style="display: flex; width: 100%; gap: 8px; align-items: center; ">
      <div style="display: flex; gap: 8px; align-items: center; ">
        <img src="./assets/download-file-icon.svg" alt="Drop Zone" style="width: 32px; height: 32px;" />
        <h1>Drop Zone</h1>
      </div>
      <div style="display: flex; gap: 4px; margin-left: auto;">
        <RouterLink to="/" class="nav-link" style="text-decoration: none; background: none; border: none; cursor: pointer; padding: 8px 12px;">Search</RouterLink>
        <RouterLink to="/clipboard" class="nav-link" style="text-decoration: none; background: none; border: none; cursor: pointer; padding: 8px 12px;">Clipboard</RouterLink>
        <RouterLink to="/about" class="nav-link" style="text-decoration: none; background: none; border: none; cursor: pointer; padding: 8px 12px;">About</RouterLink>
      </div>
    </div>
    <div>
      <RouterView />
    </div>
  </main>
</template>
