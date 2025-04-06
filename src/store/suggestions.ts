import { defineStore } from 'pinia'
import { ref } from 'vue'
import { faker } from '@faker-js/faker';

export const useSuggestionsStore = defineStore('suggestions', () => {
  const last = ref<string[]>([])

  const persisted = localStorage.getItem('searches')
  if (persisted) {
    last.value = JSON.parse(persisted)
  }

  const updateSearches = (search: string) => {
    // If the search already exists in the list, remove it first
    const index = last.value.indexOf(search);
    if (index !== -1) {
      last.value.splice(index, 1);
    }
    // Push the current search onto the beginning of the array
    last.value.unshift(search);

    // Limit the number of searches to 10
    if (last.value.length > 10) {
      last.value.pop();
    }

    localStorage.setItem('searches', JSON.stringify(last.value))
  }

  const suggestions = (search?: string) => search ? Array.from({ length: 10 }, () => `${search} ${faker.word.adjective()}`) : []
  const searches = () => last.value;

  return { searches, suggestions, updateSearches }
})

