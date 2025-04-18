<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { dumpClipboard, isImageMimeType } from '@/utils';

type Item = {
  type: string;
  data: string;
};

const items = ref<Item[][]>();

const getItems = (item: ClipboardItem) => Promise.all(item.types.map((type) => item.getType(type)))
  .then((blobs) => blobs.map(async (blob) => isImageMimeType(blob.type) ? ({ type: blob.type, data: URL.createObjectURL(blob) } as Item) : blob.text().then((text) => ({ type: blob.type, data: text } as Item))));

const revokeObjectURLs = () => {
  if (items.value) {
    for (const itemGroup of items.value) {
      for (const item of itemGroup) {
        if (isImageMimeType(item.type)) {
          URL.revokeObjectURL(item.data);
        }
      }
    }
  }
};

const readClipboard = () => {
  dumpClipboard()
  revokeObjectURLs()

  items.value = [];
  navigator.clipboard.read()
    .then((clipboardItems) => clipboardItems.map((clipboardItem) => {
      getItems(clipboardItem)
        .then((value) => Promise.all(value).then((values) => items.value?.push(values)))
    }))
};

onMounted(() => {
  readClipboard();
  if (navigator.clipboard) {
    navigator.clipboard.addEventListener("clipboardchange", readClipboard);
  }
});

onUnmounted(() => {
  revokeObjectURLs();
  if (navigator.clipboard) {
    navigator.clipboard.removeEventListener("clipboardchange", readClipboard);
  }
});
</script>

<template>
  <div class="about">
    <h1>Clipboard</h1>
    <button @click="readClipboard">Refresh</button>
    <table v-for="(item, index) in items" :key="index">
      <caption>
        <h3>Clipboard Item: {{ index + 1 }}</h3>
      </caption>
      <thead>
        <tr class="head-row">
          <th>Type</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(media, index) in item" :key="index" :class="{ 'gray-row': index % 2 !== 0 }">
          <td class="fixed">{{ media.type }}</td>
          <td v-if="isImageMimeType(media.type)"><img :src="media.data" height="200px" /></td>
          <td v-else>{{ media.data }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.gray-row {
  background-color: #f2f2f2;
}

.head-row {
  background-color: rgb(227, 227, 227);
  font-weight: bold;
}

.fixed {
  width: 0px;
  text-align: left;
}

table {
  border-collapse: collapse;
  margin-bottom: 20px;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 4px;
  text-align: left;
}

caption {
  margin-bottom: 10px;
}
</style>
