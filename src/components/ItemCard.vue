<script setup>
import { ref, computed } from 'vue'
import { useCurrencyStore, CURRENCIES } from '../state/stateCurrency'

const currencyStore = useCurrencyStore()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const showModal = ref(false)
const currentImageIndex = ref(0)
const showZoom = ref(false)
const zoomUrl = ref('')
const zoomContainer = ref(null)
const zoomImg = ref(null)
const zoomStyle = ref({ transform: 'scale(1)', transformOrigin: 'center center' })

const ZOOM_SCALE = 2.5

function onZoomMove(e) {
  const rect = zoomContainer.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  zoomStyle.value = {
    transform: `scale(${ZOOM_SCALE})`,
    transformOrigin: `${x}% ${y}%`
  }
}

function onZoomLeave() {
  zoomStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
}

const images = props.item.item_images ?? []

function getPrimaryImageIndex() {
  const idx = images.findIndex(img => img.is_primary)
  return idx >= 0 ? idx : 0
}

function openModal() {
  currentImageIndex.value = getPrimaryImageIndex()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  showZoom.value = false
}

function openZoom(url) {
  zoomUrl.value = url
  showZoom.value = true
}

function closeZoom() {
  showZoom.value = false
  zoomStyle.value = { transform: 'scale(1)', transformOrigin: 'center center' }
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

function getPrimaryImage() {
  if (images.length === 0) return null
  return images.find(img => img.is_primary)?.url || images[0].url
}

function formatPrice(value) {
  if (!value) return '—'
  const huf = Number(value)
  const code = currencyStore.selectedCode

  if (code === 'HUF' || !currencyStore.exchangeRate) {
    return huf.toLocaleString('hu-HU') + ' Ft'
  }

  const converted = huf / Number(currencyStore.exchangeRate)
  const currencyInfo = CURRENCIES.find(c => c.code === code)

  return converted.toLocaleString('hu-HU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ' + code
}
</script>

<template>
  <div
    class="group bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326]/40 rounded-3xl overflow-hidden shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#4A2E23] dark:hover:shadow-[8px_8px_0px_#E5B326] transition-all duration-200 flex flex-col">

    <div class="relative aspect-[4/3] overflow-hidden bg-[#FBF5E9] dark:bg-[#1A1614]">
      <img
        v-if="getPrimaryImage()"
        :src="getPrimaryImage()"
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="bi bi-image text-5xl text-[#4A2E23]/20 dark:text-[#E5B326]/20"></i>
      </div>

      <span
        v-if="item.category"
        class="absolute top-3 left-3 bg-[#E5B326] text-[#4A2E23] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#4A2E23]/20 max-w-[calc(100%-1.5rem)] truncate">
        {{ item.category }}
      </span>
    </div>

    <div class="p-4 flex flex-col flex-1">
      <h4 class="font-extrabold text-[#4A2E23] dark:text-[#FBF5E9] text-base leading-tight mb-3 line-clamp-2">
        {{ item.name }}
      </h4>

      <div class="mt-auto flex items-center justify-between">
        <span class="text-xl font-black text-[#4A2E23] dark:text-[#E5B326]">
          {{ formatPrice(item.estimated_value) }}
        </span>
        <button
          @click="openModal"
          class="bg-[#4A2E23] dark:bg-[#E5B326] text-white dark:text-[#4A2E23] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#E5B326] dark:hover:bg-white hover:text-[#4A2E23] transition-colors cursor-pointer">
          Részletek
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4">

        <div
          @click="closeModal"
          class="absolute inset-0 bg-[#4A2E23]/70 backdrop-blur-sm">
        </div>

        <div class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[32px] shadow-[12px_12px_0px_#4A2E23] dark:shadow-[12px_12px_0px_#E5B326] w-full max-w-lg max-h-[90vh] overflow-y-auto">

          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[#4A2E23] dark:bg-[#E5B326] text-white dark:text-[#4A2E23] rounded-full hover:scale-110 transition-transform">
            <i class="bi bi-x-lg text-sm"></i>
          </button>

          <div class="relative aspect-[4/3] bg-[#FBF5E9] dark:bg-[#1A1614] rounded-t-[28px] overflow-hidden">
            <template v-if="images.length > 0">
              <img
                :src="images[currentImageIndex].url"
                :alt="item.name"
                class="w-full h-full object-cover transition-opacity duration-300"
              />

              <button
                @click="openZoom(images[currentImageIndex].url)"
                class="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors">
                <i class="bi bi-zoom-in text-sm"></i>
              </button>

              <template v-if="images.length > 1">
                <button
                  @click="prevImage"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 dark:bg-[#26211E]/80 border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-full hover:scale-110 transition-transform">
                  <i class="bi bi-chevron-left text-[#4A2E23] dark:text-[#E5B326]"></i>
                </button>
                <button
                  @click="nextImage"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 dark:bg-[#26211E]/80 border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-full hover:scale-110 transition-transform">
                  <i class="bi bi-chevron-right text-[#4A2E23] dark:text-[#E5B326]"></i>
                </button>

                <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <button
                    v-for="(img, idx) in images"
                    :key="idx"
                    @click="currentImageIndex = idx"
                    class="w-2 h-2 rounded-full border border-[#4A2E23]/40 transition-all"
                    :class="idx === currentImageIndex ? 'bg-[#E5B326] scale-125' : 'bg-white/70'">
                  </button>
                </div>
              </template>

              <span v-if="images.length > 1" class="absolute top-3 left-3 bg-black/40 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {{ currentImageIndex + 1 }} / {{ images.length }}
              </span>
            </template>

            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="bi bi-image text-6xl text-[#4A2E23]/20 dark:text-[#E5B326]/20"></i>
            </div>
          </div>

          <div v-if="images.length > 1" class="flex flex-wrap gap-2 p-3 bg-[#FBF5E9] dark:bg-[#1A1614] border-t-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <button
              v-for="(img, idx) in images"
              :key="idx"
              @click="currentImageIndex = idx"
              class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
              :class="idx === currentImageIndex
                ? 'border-[#E5B326] scale-105 shadow-[0_0_0_2px_#E5B326]'
                : 'border-transparent opacity-60 hover:opacity-100'">
              <img :src="img.url" :alt="`Kép ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <span
                v-if="item.category"
                class="inline-block bg-[#E5B326] text-[#4A2E23] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                {{ item.category }}
              </span>
              <h3 class="text-2xl font-black text-[#4A2E23] dark:text-[#FBF5E9] leading-tight">
                {{ item.name }}
              </h3>
            </div>

            <div class="flex items-center gap-2 p-4 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-2xl border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/20">
              <i class="bi bi-cash-coin text-[#E5B326] text-2xl"></i>
              <span class="text-2xl font-black text-[#4A2E23] dark:text-[#E5B326]">
                {{ formatPrice(item.estimated_value) }}
              </span>
            </div>

            <div v-if="item.description">
              <p class="text-xs font-black text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 uppercase tracking-widest mb-2">Leírás</p>
              <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium leading-relaxed text-sm">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showZoom"
        class="fixed inset-0 z-[300] bg-black flex items-center justify-center"
        @click="closeZoom">

        <button
          @click="closeZoom"
          class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors">
          <i class="bi bi-x-lg text-sm"></i>
        </button>

        <div
          class="relative hidden md:block overflow-hidden cursor-crosshair"
          style="max-width: 90vw; max-height: 90vh;"
          @click.stop
          @mousemove="onZoomMove"
          @mouseleave="onZoomLeave"
          ref="zoomContainer">
          <img
            :src="zoomUrl"
            :alt="item.name"
            class="block object-contain transition-transform duration-100 select-none"
            style="max-width: 90vw; max-height: 90vh;"
            :style="zoomStyle"
            draggable="false"
          />
        </div>

        <div
          class="md:hidden w-full h-full flex items-center justify-center"
          style="touch-action: pinch-zoom;"
          @click.stop>
          <img
            :src="zoomUrl"
            :alt="item.name"
            class="w-full h-full object-contain select-none"
            draggable="false"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>