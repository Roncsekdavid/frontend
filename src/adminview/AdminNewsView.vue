<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../services/api'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'

const isLoading = ref(true)
const isProcessing = ref(false)
const newsItems = ref([])

const createForm = ref({
  title: '',
  short_text: '',
  content: '',
  icon: 'bi-newspaper'
})

const createImages = ref([])
const extraImageFiles = ref({})

const activeModal = ref(null) // null, 'edit', 'delete', 'images'
const selectedNews = ref(null)

const editForm = ref({
  title: '',
  short_text: '',
  content: '',
  icon: ''
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const activeCount = computed(() => {
  return newsItems.value.filter(news => news.is_active).length
})

const inactiveCount = computed(() => {
  return newsItems.value.filter(news => !news.is_active).length
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }

  setTimeout(() => {
    toast.value.show = false
  }, 2800)
}

const normalizeNews = (news) => {
  const images = Array.isArray(news.news_images) ? [...news.news_images] : []

  images.sort((a, b) => {
    if (Number(b.is_primary) !== Number(a.is_primary)) {
      return Number(b.is_primary) - Number(a.is_primary)
    }

    return Number(a.id) - Number(b.id)
  })

  return {
    ...news,
    news_images: images,
    safeIcon: news.icon || 'bi-newspaper'
  }
}

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getPrimaryImage = (news) => {
  const images = news?.news_images || []
  const primary = images.find(image => image.is_primary)

  return primary?.url || images[0]?.url || null
}

const resetCreateForm = () => {
  createForm.value = {
    title: '',
    short_text: '',
    content: '',
    icon: 'bi-newspaper'
  }

  createImages.value = []

  const input = document.getElementById('create-news-images')
  if (input) input.value = ''
}

const fetchNews = async () => {
  isLoading.value = true

  try {
    const { data } = await api.get('/news/admin')
    newsItems.value = (Array.isArray(data) ? data : []).map(normalizeNews)
  } catch (error) {
    console.error('[AdminNewsView] Hiba a hírek lekérésekor:', error)
    showToast(error?.response?.data?.error || 'A hírek betöltése sikertelen.', 'error')
  } finally {
    isLoading.value = false
  }
}

const fetchSingleNews = async (newsId) => {
  const { data } = await api.get(`/news/${newsId}`)
  const normalized = normalizeNews(data)

  const index = newsItems.value.findIndex(item => Number(item.id) === Number(newsId))

  if (index >= 0) {
    newsItems.value[index] = normalized
  } else {
    newsItems.value.unshift(normalized)
  }
}

const onCreateImagesChange = (event) => {
  createImages.value = Array.from(event.target.files || [])
}

const createNews = async () => {
  if (!createForm.value.title.trim() || !createForm.value.short_text.trim() || !createForm.value.content.trim()) {
    showToast('A cím, rövid leírás és tartalom kötelező.', 'error')
    return
  }

  isProcessing.value = true

  const formData = new FormData()
  formData.append('title', createForm.value.title.trim())
  formData.append('short_text', createForm.value.short_text.trim())
  formData.append('content', createForm.value.content.trim())
  formData.append('icon', createForm.value.icon.trim() || 'bi-newspaper')

  createImages.value.forEach(file => {
    formData.append('images', file)
  })

  try {
    const { data } = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const createdId = data?.news?.id

    resetCreateForm()

    if (createdId) {
      await fetchSingleNews(createdId)
    } else {
      await fetchNews()
    }

    showToast('Hír sikeresen létrehozva.')
  } catch (error) {
    console.error('[AdminNewsView] Hiba hír létrehozásakor:', error)
    showToast(error?.response?.data?.error || 'A hír létrehozása sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const toggleActive = async (news) => {
  isProcessing.value = true

  try {
    await api.patch(`/news/${news.id}`, {
      is_active: !news.is_active
    })

    news.is_active = !news.is_active

    showToast(news.is_active ? 'A hír aktiválva lett.' : 'A hír inaktiválva lett.')
  } catch (error) {
    console.error('[AdminNewsView] Hiba állapotváltáskor:', error)
    showToast(error?.response?.data?.error || 'Az állapot frissítése sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const openDeleteModal = (news) => {
  selectedNews.value = news
  activeModal.value = 'delete'
}

const confirmDeleteNews = async () => {
  if (!selectedNews.value) return

  isProcessing.value = true

  try {
    await api.delete(`/news/${selectedNews.value.id}`)

    newsItems.value = newsItems.value.filter(item => item.id !== selectedNews.value.id)

    showToast('A hír törölve lett.')
    closeModal()
  } catch (error) {
    console.error('[AdminNewsView] Hiba hír törlésekor:', error)
    showToast(error?.response?.data?.error || 'A hír törlése sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const openEditModal = (news) => {
  selectedNews.value = news

  editForm.value = {
    title: news.title || '',
    short_text: news.short_text || '',
    content: news.content || '',
    icon: news.icon || 'bi-newspaper'
  }

  activeModal.value = 'edit'
}

const saveEdit = async () => {
  if (!selectedNews.value) return

  if (!editForm.value.title.trim() || !editForm.value.short_text.trim() || !editForm.value.content.trim()) {
    showToast('A cím, rövid leírás és tartalom kötelező.', 'error')
    return
  }

  isProcessing.value = true

  try {
    await api.patch(`/news/${selectedNews.value.id}`, {
      title: editForm.value.title.trim(),
      short_text: editForm.value.short_text.trim(),
      content: editForm.value.content.trim(),
      icon: editForm.value.icon.trim() || 'bi-newspaper'
    })

    await fetchSingleNews(selectedNews.value.id)

    showToast('A hír sikeresen frissítve.')
    closeModal()
  } catch (error) {
    console.error('[AdminNewsView] Hiba hír szerkesztésekor:', error)
    showToast(error?.response?.data?.error || 'A hír frissítése sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const openImagesModal = (news) => {
  selectedNews.value = news
  activeModal.value = 'images'
}

const onExtraImagesChange = (newsId, event) => {
  extraImageFiles.value = {
    ...extraImageFiles.value,
    [newsId]: Array.from(event.target.files || [])
  }
}

const addImages = async (newsId) => {
  const files = extraImageFiles.value[newsId] || []

  if (!files.length) {
    showToast('Válassz legalább egy képet.', 'error')
    return
  }

  isProcessing.value = true

  const formData = new FormData()

  files.forEach(file => {
    formData.append('images', file)
  })

  try {
    await api.post(`/news/${newsId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    extraImageFiles.value = {
      ...extraImageFiles.value,
      [newsId]: []
    }

    const input = document.getElementById(`extra-images-${newsId}`)
    if (input) input.value = ''

    await fetchSingleNews(newsId)

    if (selectedNews.value?.id === newsId) {
      const refreshed = newsItems.value.find(item => item.id === newsId)
      selectedNews.value = refreshed || selectedNews.value
    }

    showToast('Képek sikeresen hozzáadva.')
  } catch (error) {
    console.error('[AdminNewsView] Hiba képek hozzáadásakor:', error)
    showToast(error?.response?.data?.error || 'A képek hozzáadása sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const deleteImage = async (newsId, imageId) => {
  isProcessing.value = true

  try {
    await api.delete(`/news/images/${imageId}`)

    await fetchSingleNews(newsId)

    if (selectedNews.value?.id === newsId) {
      const refreshed = newsItems.value.find(item => item.id === newsId)
      selectedNews.value = refreshed || selectedNews.value
    }

    showToast('A kép törölve lett.')
  } catch (error) {
    console.error('[AdminNewsView] Hiba kép törlésekor:', error)
    showToast(error?.response?.data?.error || 'A kép törlése sikertelen.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const closeModal = () => {
  activeModal.value = null
  selectedNews.value = null

  editForm.value = {
    title: '',
    short_text: '',
    content: '',
    icon: ''
  }
}

onMounted(fetchNews)
</script>

<template>
  <div class="grid grid-cols-6 min-h-screen relative">
    <AdminMenu />

    <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6 relative">
      <AdminHeader />

      <main class="max-w-7xl mx-auto mt-8 p-2 md:p-4">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p class="text-xs font-black text-[#051826]/40 uppercase tracking-[0.25em] mb-2">
              Adminisztráció
            </p>
            <h1 class="text-4xl md:text-5xl font-black text-[#051826] leading-tight">
              Hírek kezelése
            </h1>
            <p class="text-[#051826]/50 font-bold mt-2">
              Itt kezelheted a főoldalon és a működés oldalon megjelenő híreket, képeket és plakátokat.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-white border-4 border-[#051826] rounded-2xl p-4 shadow-[4px_4px_0px_#051826]">
              <p class="text-[10px] font-black text-[#051826]/40 uppercase">Összes</p>
              <p class="text-2xl font-black text-[#051826]">{{ newsItems.length }}</p>
            </div>

            <div class="bg-white border-4 border-[#051826] rounded-2xl p-4 shadow-[4px_4px_0px_#051826]">
              <p class="text-[10px] font-black text-[#051826]/40 uppercase">Aktív</p>
              <p class="text-2xl font-black text-emerald-600">{{ activeCount }}</p>
            </div>

            <div class="bg-white border-4 border-[#051826] rounded-2xl p-4 shadow-[4px_4px_0px_#051826] col-span-2 sm:col-span-1">
              <p class="text-[10px] font-black text-[#051826]/40 uppercase">Inaktív</p>
              <p class="text-2xl font-black text-gray-500">{{ inactiveCount }}</p>
            </div>
          </div>
        </div>

        <section class="bg-white border-4 border-[#051826] rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_#051826] mb-10">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 bg-[#E5B326] border-4 border-[#051826] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#051826]">
              <i class="bi bi-newspaper text-2xl text-[#051826]"></i>
            </div>

            <div>
              <h2 class="text-2xl md:text-3xl font-black text-[#051826]">
                Új hír létrehozása
              </h2>
              <p class="text-sm font-bold text-[#051826]/45">
                Adj meg címet, rövid leírást, hosszabb tartalmat és opcionálisan több képet.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Cím <span class="text-red-500">*</span>
              </label>
              <input
                v-model="createForm.title"
                type="text"
                placeholder="Pl. Új gyorsított bírálat"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Ikon
              </label>
              <input
                v-model="createForm.icon"
                type="text"
                placeholder="Pl. bi-newspaper"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Rövid leírás <span class="text-red-500">*</span>
              </label>
              <input
                v-model="createForm.short_text"
                type="text"
                placeholder="Ez jelenik meg a hírkártyán."
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Hosszabb tartalom <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="createForm.content"
                rows="6"
                placeholder="Ez a modalban jelenik meg hosszabb olvasnivalóként."
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326] resize-none"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Képek / plakátok
              </label>

              <div class="border-4 border-dashed border-[#051826]/25 rounded-2xl p-5 bg-[#F7F8F0]">
                <input
                  id="create-news-images"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="onCreateImagesChange"
                  class="block w-full text-sm font-bold text-[#051826]"
                />

                <p class="text-xs font-bold text-[#051826]/40 mt-2">
                  Több kép is feltölthető. Az első kép lesz az elsődleges kép.
                </p>

                <div v-if="createImages.length" class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="file in createImages"
                    :key="file.name"
                    class="bg-[#E5B326] text-[#051826] font-black text-xs px-3 py-1 rounded-full border-2 border-[#051826]"
                  >
                    {{ file.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              @click="createNews"
              :disabled="isProcessing"
              class="bg-[#051826] hover:bg-[#0b2538] text-white px-6 py-4 rounded-xl font-black border-4 border-[#051826] shadow-[4px_4px_0px_#E5B326] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs disabled:opacity-60"
            >
              <i class="bi bi-plus-circle-fill mr-2"></i>
              Hír létrehozása
            </button>

            <button
              @click="resetCreateForm"
              class="bg-gray-200 hover:bg-gray-300 text-[#051826] px-6 py-4 rounded-xl font-black border-4 border-[#051826] transition-all uppercase tracking-widest text-xs"
            >
              Űrlap törlése
            </button>
          </div>
        </section>

        <section v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-4"></div>
          <p class="font-black text-[#051826] uppercase tracking-tight">
            Hírek betöltése...
          </p>
        </section>

        <section
          v-else-if="newsItems.length === 0"
          class="bg-white border-4 border-[#051826] rounded-[2rem] p-12 text-center shadow-[8px_8px_0px_#051826]"
        >
          <i class="bi bi-newspaper text-5xl text-gray-300"></i>
          <p class="font-black text-gray-400 uppercase mt-4">
            Még nincs létrehozott hír
          </p>
        </section>

        <section v-else class="grid grid-cols-1 xl:grid-cols-2 gap-7">
          <article
            v-for="news in newsItems"
            :key="news.id"
            class="bg-white border-4 border-[#051826] rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_#051826]"
          >
            <div class="relative h-56 bg-gray-100 border-b-4 border-[#051826]">
              <img
                v-if="getPrimaryImage(news)"
                :src="getPrimaryImage(news)"
                :alt="news.title"
                class="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />

              <div v-else class="w-full h-full flex items-center justify-center bg-[#F7F8F0]">
                <i class="bi bi-image text-5xl text-gray-300"></i>
              </div>

              <div class="absolute top-4 left-4">
                <span
                  :class="[
                    'inline-flex items-center gap-2 text-xs font-black px-3 py-1 rounded-full border-2 border-[#051826]',
                    news.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  <i :class="news.is_active ? 'bi bi-check-circle-fill' : 'bi bi-pause-circle-fill'"></i>
                  {{ news.is_active ? 'Aktív' : 'Inaktív' }}
                </span>
              </div>

              <div class="absolute top-4 right-4">
                <div class="w-12 h-12 bg-[#E5B326] border-4 border-[#051826] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#051826]">
                  <i :class="['bi', news.safeIcon, 'text-xl text-[#051826]']"></i>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="min-w-0">
                  <h3 class="text-2xl font-black text-[#051826] leading-tight">
                    {{ news.title }}
                  </h3>

                  <p class="text-xs font-black text-[#051826]/40 uppercase tracking-widest mt-2">
                    {{ formatDate(news.created_at) }}
                  </p>
                </div>
              </div>

              <p class="font-bold text-[#051826]/75 leading-relaxed mb-3">
                {{ news.short_text }}
              </p>

              <p class="text-sm text-[#051826]/55 font-medium whitespace-pre-line line-clamp-3">
                {{ news.content }}
              </p>

              <div class="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-[#F7F8F0] border-2 border-[#051826]/10 rounded-xl p-3">
                  <p class="text-[10px] font-black text-[#051826]/40 uppercase">Képek</p>
                  <p class="text-xl font-black text-[#051826]">{{ news.news_images?.length || 0 }}</p>
                </div>

                <div class="bg-[#F7F8F0] border-2 border-[#051826]/10 rounded-xl p-3 md:col-span-3">
                  <p class="text-[10px] font-black text-[#051826]/40 uppercase">Ikon</p>
                  <p class="text-sm font-black text-[#051826] truncate">
                    <i :class="['bi', news.safeIcon, 'text-[#E5B326] mr-1']"></i>
                    {{ news.safeIcon }}
                  </p>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  @click="openEditModal(news)"
                  class="bg-[#FBF5E9] hover:bg-[#f2e6d2] border-4 border-[#051826] text-[#051826] font-black py-3 rounded-xl transition-all uppercase text-[10px] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none"
                >
                  Szerkesztés
                </button>

                <button
                  @click="toggleActive(news)"
                  :disabled="isProcessing"
                  class="bg-[#E5B326] hover:bg-[#d0a01e] border-4 border-[#051826] text-[#051826] font-black py-3 rounded-xl transition-all uppercase text-[10px] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none disabled:opacity-60"
                >
                  {{ news.is_active ? 'Inaktiválás' : 'Aktiválás' }}
                </button>

                <button
                  @click="openImagesModal(news)"
                  class="bg-blue-500 hover:bg-blue-600 border-4 border-[#051826] text-white font-black py-3 rounded-xl transition-all uppercase text-[10px] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none"
                >
                  Képek
                </button>

                <button
                  @click="openDeleteModal(news)"
                  class="bg-red-500 hover:bg-red-600 border-4 border-[#051826] text-white font-black py-3 rounded-xl transition-all uppercase text-[10px] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none"
                >
                  Törlés
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>

    <div
      v-if="activeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051826]/40 backdrop-blur-sm"
    >
      <div class="bg-white border-4 border-[#051826] rounded-[2rem] p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_#051826] animate-popIn">
        <template v-if="activeModal === 'edit' && selectedNews">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 class="text-3xl font-black text-[#051826]">
                Hír szerkesztése
              </h3>
              <p class="text-sm font-bold text-[#051826]/45 mt-1">
                Módosítsd a hír szöveges adatait.
              </p>
            </div>

            <button
              @click="closeModal"
              class="w-10 h-10 bg-gray-100 hover:bg-[#E5B326] border-2 border-[#051826] rounded-full flex items-center justify-center transition-colors"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="grid gap-4">
            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Cím
              </label>
              <input
                v-model="editForm.title"
                type="text"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Ikon
              </label>
              <input
                v-model="editForm.icon"
                type="text"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Rövid leírás
              </label>
              <input
                v-model="editForm.short_text"
                type="text"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326]"
              />
            </div>

            <div>
              <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
                Hosszabb tartalom
              </label>
              <textarea
                v-model="editForm.content"
                rows="7"
                class="w-full border-4 border-[#051826] rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-[#E5B326] resize-none"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex gap-4">
            <button
              @click="closeModal"
              class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all"
            >
              Mégse
            </button>

            <button
              @click="saveEdit"
              :disabled="isProcessing"
              class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#051826] font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all disabled:opacity-60"
            >
              Mentés
            </button>
          </div>
        </template>

        <template v-if="activeModal === 'images' && selectedNews">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 class="text-3xl font-black text-[#051826]">
                Képek kezelése
              </h3>
              <p class="text-sm font-bold text-[#051826]/45 mt-1">
                {{ selectedNews.title }}
              </p>
            </div>

            <button
              @click="closeModal"
              class="w-10 h-10 bg-gray-100 hover:bg-[#E5B326] border-2 border-[#051826] rounded-full flex items-center justify-center transition-colors"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div v-if="!selectedNews.news_images?.length" class="bg-[#F7F8F0] border-4 border-dashed border-[#051826]/20 rounded-2xl p-8 text-center mb-6">
            <i class="bi bi-image text-4xl text-gray-300"></i>
            <p class="font-black text-gray-400 uppercase text-sm mt-3">
              Ehhez a hírhez még nincs kép
            </p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div
              v-for="img in selectedNews.news_images"
              :key="img.id"
              class="relative group border-4 border-[#051826] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#051826]"
            >
              <img
                :src="img.url"
                class="w-full h-32 object-cover"
                loading="lazy"
                decoding="async"
              />

              <div
                v-if="img.is_primary"
                class="absolute left-2 top-2 bg-[#E5B326] text-[#051826] text-[10px] font-black px-2 py-1 rounded-full border-2 border-[#051826]"
              >
                Elsődleges
              </div>

              <button
                @click="deleteImage(selectedNews.id, img.id)"
                :disabled="isProcessing"
                class="absolute right-2 top-2 w-8 h-8 rounded-full bg-red-600 text-white border-2 border-[#051826] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div class="border-4 border-dashed border-[#051826]/25 rounded-2xl p-5 bg-[#F7F8F0]">
            <label class="block text-[10px] font-black text-[#051826]/40 uppercase tracking-widest mb-2">
              Új képek hozzáadása
            </label>

            <input
              :id="`extra-images-${selectedNews.id}`"
              type="file"
              multiple
              accept="image/*"
              @change="(e) => onExtraImagesChange(selectedNews.id, e)"
              class="block w-full text-sm font-bold text-[#051826]"
            />

            <button
              @click="addImages(selectedNews.id)"
              :disabled="isProcessing"
              class="mt-4 bg-[#051826] hover:bg-[#0b2538] text-white px-5 py-3 rounded-xl font-black border-4 border-[#051826] shadow-[4px_4px_0px_#E5B326] active:translate-y-1 active:shadow-none transition-all uppercase text-xs disabled:opacity-60"
            >
              Képek hozzáadása
            </button>
          </div>
        </template>

        <template v-if="activeModal === 'delete' && selectedNews">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 border-4 border-[#051826] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <i class="bi bi-trash-fill text-3xl text-red-600"></i>
            </div>

            <h3 class="text-3xl font-black text-red-600 mb-3">
              Hír törlése
            </h3>

            <p class="text-[#051826]/70 font-bold mb-2">
              Biztosan törölni szeretnéd ezt a hírt?
            </p>

            <p class="text-xl font-black text-[#051826] mb-6">
              {{ selectedNews.title }}
            </p>

            <p class="bg-red-50 text-red-600 border-2 border-red-200 rounded-xl p-3 text-sm font-bold mb-6">
              A törlés a hírhez tartozó képeket is eltávolítja.
            </p>

            <div class="flex gap-4">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl transition-all"
              >
                Mégse
              </button>

              <button
                @click="confirmDeleteNews"
                :disabled="isProcessing"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826] transition-all disabled:opacity-60"
              >
                Törlés
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-8 right-8 z-50 border-4 border-[#051826] rounded-xl p-4 shadow-[6px_6px_0px_#051826] flex items-center gap-3 animate-slideIn',
        toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
      ]"
    >
      <i :class="toast.type === 'error' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-check-circle-fill'"></i>
      <span class="font-black tracking-wide">{{ toast.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-popIn {
  animation: popIn 0.25s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>