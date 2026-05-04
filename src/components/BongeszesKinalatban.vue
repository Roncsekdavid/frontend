<script setup>
import { ref, computed, onMounted } from 'vue'
import ItemCard from './ItemCard.vue'
import api from '../services/api'

const categories = [
  { name: 'Ékszer & Arany', icon: 'bi-gem' },
  { name: 'Órák', icon: 'bi-watch' },
  { name: 'Műtárgyak', icon: 'bi-palette-fill' },
  { name: 'Elektronika', icon: 'bi-cpu-fill' },
  { name: 'Háztartási gépek', icon: 'bi-house-gear-fill' },
  { name: 'Hétköznapi cikkek', icon: 'bi-box-seam-fill' },
  { name: 'Hangszerek', icon: 'bi-music-note-beamed' },
  { name: 'Jármű', icon: 'bi-car-front-fill' },
  { name: 'Szerszámgépek', icon: 'bi-tools' },
  { name: 'Játékkonzolok', icon: 'bi-controller' },
  { name: 'Bútorok', icon: 'bi-lamp-fill' },
  { name: 'Sporteszközök', icon: 'bi-bicycle' }
]

const allItems = ref([])
const loadingAll = ref(true)
const allError = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')

const filteredAllItems = computed(() => {
  return allItems.value.filter(item => {
    const matchesName = item.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = selectedCategory.value === '' || item.category === selectedCategory.value
    return matchesName && matchesCat
  })
})

onMounted(async () => {
  try {
    const { data } = await api.get('/items/for-sale')
    allItems.value = data
  } catch (err) {
    console.error('[BongeszesKinalatban] Betöltése sikertelen:', err)
    allError.value = true
  } finally {
    loadingAll.value = false
  }
})
</script>

<template>
  <section id="bongeszes-kinalatban" class="py-20 bg-white dark:bg-[#1A1614] transition-colors">
    <div class="container mx-auto px-4">

      <div class="text-center mb-10">
        <h3 class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
          Böngésszen a kínálatban
        </h3>
        <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div class="flex-1 flex items-center bg-[#FBF5E9] dark:bg-[#26211E] border-2 border-gray-200 dark:border-[#E5B326]/20 rounded-2xl px-4 focus-within:border-[#E5B326] transition-all">
          <i class="bi bi-search text-[#4A2E23]/40 dark:text-[#E5B326]/40 mr-3"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Keresés név alapján..."
            class="w-full py-3.5 bg-transparent text-[#4A2E23] dark:text-[#FBF5E9] font-bold placeholder:text-gray-400 placeholder:font-normal outline-none text-sm"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-gray-400 hover:text-[#4A2E23] dark:hover:text-[#E5B326] transition-colors">
            <i class="bi bi-x-lg text-sm"></i>
          </button>
        </div>

        <div class="relative">
          <select
            v-model="selectedCategory"
            class="appearance-none bg-[#FBF5E9] dark:bg-[#26211E] border-2 border-gray-200 dark:border-[#E5B326]/20 rounded-2xl px-4 pr-10 py-3.5 text-[#4A2E23] dark:text-[#FBF5E9] font-bold text-sm outline-none focus:border-[#E5B326] transition-all w-full sm:w-auto cursor-pointer">
            <option value="">Minden kategória</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
          </select>
          <i class="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#4A2E23] dark:text-[#E5B326] pointer-events-none text-sm"></i>
        </div>
      </div>

      <div v-if="searchQuery || selectedCategory" class="flex flex-wrap gap-2 mb-6 max-w-2xl mx-auto">
        <span v-if="searchQuery"
          class="flex items-center gap-2 bg-[#E5B326]/20 text-[#4A2E23] dark:text-[#FBF5E9] text-xs font-bold px-3 py-1.5 rounded-full border border-[#E5B326]/40">
          <i class="bi bi-search text-[#E5B326]"></i>
          "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="hover:text-red-500 transition-colors"><i class="bi bi-x"></i></button>
        </span>
        <span v-if="selectedCategory"
          class="flex items-center gap-2 bg-[#E5B326]/20 text-[#4A2E23] dark:text-[#FBF5E9] text-xs font-bold px-3 py-1.5 rounded-full border border-[#E5B326]/40">
          <i class="bi bi-tag-fill text-[#E5B326]"></i>
          {{ selectedCategory }}
          <button @click="selectedCategory = ''" class="hover:text-red-500 transition-colors"><i class="bi bi-x"></i></button>
        </span>
        <span class="text-xs text-[#4A2E23]/50 dark:text-[#D4C7B0] font-bold self-center">
          {{ filteredAllItems.length }} találat
        </span>
      </div>

      <div v-if="loadingAll" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n"
          class="bg-[#FBF5E9] dark:bg-[#26211E] border-2 border-[#4A2E23]/10 rounded-3xl overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-[#4A2E23]/10 dark:bg-[#E5B326]/10"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-[#4A2E23]/10 rounded-full w-3/4"></div>
            <div class="h-5 bg-[#4A2E23]/10 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="allError" class="text-center py-16">
        <i class="bi bi-exclamation-circle text-5xl text-[#4A2E23]/30 dark:text-[#E5B326]/30 mb-4 block"></i>
        <p class="text-[#4A2E23]/60 dark:text-[#D4C7B0] font-bold">Nem sikerült betölteni a termékeket.</p>
      </div>

      <div v-else-if="filteredAllItems.length === 0" class="text-center py-16">
        <i class="bi bi-search text-5xl text-[#4A2E23]/20 dark:text-[#E5B326]/20 mb-4 block"></i>
        <p class="text-[#4A2E23]/50 dark:text-[#D4C7B0] font-bold mb-2">Nincs találat a keresési feltételekre.</p>
        <button @click="searchQuery = ''; selectedCategory = ''"
          class="text-[#E5B326] font-black text-sm underline underline-offset-4 hover:text-[#d0a01e] transition-colors">
          Szűrők törlése
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <ItemCard v-for="item in filteredAllItems" :key="item.id" :item="item" />
      </div>

    </div>
  </section>
</template>