<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import api from '../services/api'

const newsSlider = ref(null)
const newsItems = ref([])
const isLoading = ref(true)
const selectedNews = ref(null)
const activeImageIndex = ref(0)

const normalizedNews = computed(() => {
  return (newsItems.value || []).map((news) => {
    const images = Array.isArray(news.news_images) ? [...news.news_images] : []
    images.sort((a, b) => Number(b.is_primary) - Number(a.is_primary))

    return {
      ...news,
      safeIcon: news.icon || 'bi-newspaper',
      images,
      primaryImageUrl: images[0]?.url || null
    }
  })
})

const safeImages = computed(() => {
  if (!selectedNews.value?.images?.length) return []
  return selectedNews.value.images
})

const activeImage = computed(() => safeImages.value[activeImageIndex.value] || null)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const slideNews = (direction) => {
  if (!newsSlider.value) return

  const card = newsSlider.value.querySelector('[data-news-card]')
  const step = card ? card.clientWidth + 16 : 360

  newsSlider.value.scrollBy({
    left: direction === 'next' ? step : -step,
    behavior: 'smooth'
  })
}

const openModal = (news) => {
  selectedNews.value = news
  activeImageIndex.value = 0
}

const closeModal = () => {
  selectedNews.value = null
  activeImageIndex.value = 0
}

const prevImage = () => {
  if (!safeImages.value.length) return
  activeImageIndex.value = (activeImageIndex.value - 1 + safeImages.value.length) % safeImages.value.length
}

const nextImage = () => {
  if (!safeImages.value.length) return
  activeImageIndex.value = (activeImageIndex.value + 1) % safeImages.value.length
}

const onEscPress = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const fetchNews = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/news')
    newsItems.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[NewsSlider] Hiba a hírek betöltése közben:', error)
    newsItems.value = []
  } finally {
    isLoading.value = false
  }
}

watch(selectedNews, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  fetchNews()
  window.addEventListener('keydown', onEscPress)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onEscPress)
})
</script>

<template>
  <section class="container mx-auto px-4 max-w-6xl mb-20">
    <div
      class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[35px] p-5 md:p-7 shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] transition-colors"
    >
      <div class="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase flex items-center">
            <i class="bi bi-newspaper mr-3 text-[#E5B326]"></i>
            Hírek és újdonságok
          </h2>
          <p class="text-sm font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/60 mt-1">
            Friss információk a ZaciPaci működéséről és szolgáltatásairól.
          </p>
        </div>

        <div class="hidden md:flex gap-2">
          <button
            @click="slideNews('prev')"
            class="w-11 h-11 rounded-full bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326] hover:bg-[#E5B326] hover:text-[#4A2E23] transition-all shadow-[2px_2px_0px_#4A2E23] dark:shadow-[2px_2px_0px_#E5B326] active:translate-y-0.5 active:shadow-none"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <button
            @click="slideNews('next')"
            class="w-11 h-11 rounded-full bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326] hover:bg-[#E5B326] hover:text-[#4A2E23] transition-all shadow-[2px_2px_0px_#4A2E23] dark:shadow-[2px_2px_0px_#E5B326] active:translate-y-0.5 active:shadow-none"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="py-8 text-center font-bold text-[#4A2E23] dark:text-[#FBF5E9]">
        Hírek betöltése...
      </div>

      <div v-else-if="normalizedNews.length === 0" class="py-8 text-center font-bold text-[#4A2E23] dark:text-[#FBF5E9]">
        Jelenleg nincs megjeleníthető hír.
      </div>

      <div v-else ref="newsSlider" class="news-scroll flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-3">
        <article
          v-for="news in normalizedNews"
          :key="news.id"
          data-news-card
          class="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px] bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23]/20 dark:border-[#E5B326]/30 rounded-[25px] p-5 transition-all hover:border-[#E5B326] hover:-translate-y-1 cursor-pointer"
          @click="openModal(news)"
        >
          <div class="w-full h-40 rounded-2xl overflow-hidden border-2 border-[#4A2E23]/20 dark:border-[#E5B326]/30 mb-4 bg-white dark:bg-[#26211E]">
            <img
              v-if="news.primaryImageUrl"
              :src="news.primaryImageUrl"
              :alt="news.title"
              class="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="w-full h-full flex items-center justify-center font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
              Nincs kép
            </div>
          </div>

          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-[#26211E] border-2 border-[#E5B326] flex items-center justify-center shrink-0">
              <i :class="['bi', news.safeIcon, 'text-2xl text-[#E5B326]']"></i>
            </div>

            <span class="text-[10px] font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/50 uppercase">
              {{ formatDate(news.created_at) }}
            </span>
          </div>

          <h3 class="text-lg font-black text-[#4A2E23] dark:text-[#FBF5E9] mb-2 uppercase leading-tight">
            {{ news.title }}
          </h3>

          <p class="text-sm font-medium text-[#4A2E23]/70 dark:text-[#D4C7B0] leading-relaxed">
            {{ news.short_text }}
          </p>

          <p class="mt-4 font-black uppercase text-[#E5B326]">Tovább olvasom</p>
        </article>
      </div>

      <div class="md:hidden flex justify-center gap-2 mt-4">
        <button
          @click="slideNews('prev')"
          class="w-10 h-10 rounded-full bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326]"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <button
          @click="slideNews('next')"
          class="w-10 h-10 rounded-full bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326]"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedNews" class="fixed inset-0 z-[120] bg-black/70 p-4 md:p-8 overflow-y-auto" @click.self="closeModal">
      <div class="max-w-4xl mx-auto bg-[#FBF5E9] dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl p-5 md:p-8 relative">
        <button
          @click="closeModal"
          class="absolute z-30 top-4 right-4 w-10 h-10 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326] bg-white dark:bg-[#1A1614]"
        >
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="w-full h-[280px] md:h-[420px] rounded-2xl overflow-hidden bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23]/20 dark:border-[#E5B326]/30 relative">
          <img
            v-if="activeImage?.url"
            :src="activeImage.url"
            :alt="selectedNews.title"
            class="w-full h-full object-cover"
            decoding="async"
          />
          <div v-else class="w-full h-full flex items-center justify-center font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
            Nincs kép
          </div>

          <button
            v-if="safeImages.length > 1"
            @click="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 text-white"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            v-if="safeImages.length > 1"
            @click="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 text-white"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <div v-if="safeImages.length > 0" class="mt-3 flex items-center justify-between gap-2">
          <div class="flex gap-2 overflow-x-auto">
            <button
              v-for="(img, index) in safeImages"
              :key="img.id"
              @click="activeImageIndex = index"
              :class="[
                'w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0',
                activeImageIndex === index ? 'border-[#E5B326]' : 'border-transparent'
              ]"
            >
              <img :src="img.url" :alt="`Kép ${index + 1}`" class="w-full h-full object-cover" loading="lazy" decoding="async" />
            </button>
          </div>
          <p class="font-black text-[#4A2E23] dark:text-[#E5B326]">
            {{ safeImages.length ? activeImageIndex + 1 : 0 }} / {{ safeImages.length }}
          </p>
        </div>

        <div class="mt-5">
          <h3 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#FBF5E9]">{{ selectedNews.title }}</h3>
          <p class="mt-2 font-bold text-[#4A2E23]/70 dark:text-[#D4C7B0]">{{ selectedNews.short_text }}</p>
          <p class="mt-4 whitespace-pre-line leading-relaxed text-[#4A2E23] dark:text-[#FBF5E9]">{{ selectedNews.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-scroll {
  scrollbar-width: thin;
  scrollbar-color: #E5B326 transparent;
}

.news-scroll::-webkit-scrollbar {
  height: 8px;
}

.news-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.news-scroll::-webkit-scrollbar-thumb {
  background: #E5B326;
  border-radius: 999px;
}
</style>
