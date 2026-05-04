import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'favorite_categories'

export const useFavoritesStore = defineStore('favorites', () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  const favoriteCategories = ref(stored ? JSON.parse(stored) : [])

  const hasFavorites = computed(() => favoriteCategories.value.length > 0)

  function setFavorites(categories) {
    favoriteCategories.value = categories
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }

  function clearFavorites() {
    favoriteCategories.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return { favoriteCategories, hasFavorites, setFavorites, clearFavorites }
})