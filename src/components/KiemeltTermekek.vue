<script setup>
import { ref, computed, onMounted } from 'vue'
import ItemCard from './ItemCard.vue'
import api from '../services/api'
import { useFavoritesStore } from '../state/stateFavorites'
import { useAuthStore } from '../state/stateAuth'

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const items = ref([])
const loadingItems = ref(true)
const itemsError = ref(false)

const filteredItems = computed(() => {
  if (!favoritesStore.hasFavorites) return items.value
  return items.value.filter(item =>
    favoritesStore.favoriteCategories.includes(item.category)
  )
})

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    loadingItems.value = false
    return
  }
  try {
    const { data } = await api.get('/items/for-sale')
    items.value = data
  } catch (err) {
    console.error('[KiemeltTermekek] Betöltése sikertelen:', err)
    itemsError.value = true
  } finally {
    loadingItems.value = false
  }
})
</script>

<template>
  <section class="py-20 bg-[#FBF5E9] dark:bg-[#26211E] transition-colors">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h3 class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
          {{ (authStore.isLoggedIn && favoritesStore.hasFavorites) ? 'Az Ön érdeklődési köre' : 'Kiemelt termékeink' }}
        </h3>
        <p v-if="authStore.isLoggedIn && favoritesStore.hasFavorites" class="text-[#4A2E23]/60 dark:text-[#D4C7B0] font-bold text-sm mt-2">
          A kedvenc kategóriái alapján szűrve
        </p>
        <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
      </div>

      <div v-if="loadingItems" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n"
          class="bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23]/10 rounded-3xl overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-[#4A2E23]/10 dark:bg-[#E5B326]/10"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-[#4A2E23]/10 rounded-full w-3/4"></div>
            <div class="h-5 bg-[#4A2E23]/10 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="itemsError" class="text-center py-16">
        <i class="bi bi-exclamation-circle text-5xl text-[#4A2E23]/30 dark:text-[#E5B326]/30 mb-4 block"></i>
        <p class="text-[#4A2E23]/60 dark:text-[#D4C7B0] font-bold">Nem sikerült betölteni a termékeket.</p>
      </div>

      <div v-else-if="!authStore.isLoggedIn" class="flex flex-col items-center text-center py-16 max-w-sm mx-auto gap-5">
        <div class="w-20 h-20 bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326]">
          <i class="bi bi-person-lock text-[#E5B326] text-4xl"></i>
        </div>
        <div>
          <h4 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Személyre szabott ajánlatok</h4>
          <p class="text-[#4A2E23]/60 dark:text-[#D4C7B0] font-medium text-sm leading-relaxed">
            Jelentkezzen be, majd válassza ki kedvenc kategóriáit a profilban — Mi az alapján jelenítjük meg az Önnek releváns termékekeinket!
          </p>
        </div>
        <router-link to="/login"
          class="bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-3 px-8 rounded-full shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wider text-sm">
          Bejelentkezés
        </router-link>
      </div>

      <div v-else-if="!favoritesStore.hasFavorites" class="flex flex-col items-center text-center py-16 max-w-sm mx-auto gap-5">
        <div class="w-20 h-20 bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326]">
          <i class="bi bi-stars text-[#E5B326] text-4xl"></i>
        </div>
        <div>
          <h4 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Még nincsenek kedvenc kategóriái</h4>
          <p class="text-[#4A2E23]/60 dark:text-[#D4C7B0] font-medium text-sm leading-relaxed">
            Látogasson el a profiljába, és jelöljön be néhány kategóriát — Mi az alapján szűrjük Önnek a kiemelt termékekeinket.
          </p>
        </div>
        <router-link to="/profil"
          class="bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-3 px-8 rounded-full shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wider text-sm">
          Kategóriák beállítása
        </router-link>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-16">
        <i class="bi bi-box-seam text-5xl text-[#4A2E23]/20 dark:text-[#E5B326]/20 mb-4 block"></i>
        <p class="text-[#4A2E23]/50 dark:text-[#D4C7B0] font-bold">A kedvenc kategóriáiban jelenleg nincs eladó termék.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
    </div>
  </section>
</template>