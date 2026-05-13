<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  itemImage: String,
  itemName: String,
  itemDesc: String,
  itemDate: String,
  itemPrice: [String, Number],
  itemCategory: String,
  contractDuration: String
});

const loadImage = computed(() => {
  if (!props.itemImage) return '';
  return props.itemImage.startsWith('http') 
    ? props.itemImage 
    : new URL(props.itemImage, import.meta.url).href;
});
</script>

<template>
  <div class="h-full w-full flex">
        <div v-if="loading" class="w-full bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm animate-pulse flex flex-col gap-4">
      <div class="w-full aspect-video bg-gray-200 rounded-xl"></div>
      <div class="h-6 bg-gray-200 rounded w-3/4"></div>
      <div class="h-10 bg-gray-100 rounded w-full"></div>
    </div>

    <div
      v-else
      class="w-full bg-white rounded-2xl p-5 border-2 border-[#051826] shadow-[6px_6px_0px_#051826] hover:shadow-[10px_10px_0px_#051826] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden"
      @click="$emit('open')"
    >
      <div class="relative w-full aspect-video overflow-hidden rounded-xl mb-4 shrink-0 bg-gray-100 border border-gray-100">
        <img
          :src="loadImage"
          :alt="itemName"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div v-if="itemCategory" class="absolute top-3 left-3 bg-[#051826] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg z-10">
          {{ itemCategory }}
        </div>
      </div>

      <div class="flex flex-col flex-1 min-w-0">
        <h3 class="text-xl font-black text-[#051826] leading-tight mb-2 group-hover:text-blue-700 transition-colors truncate">
          {{ itemName }}
        </h3>

        <p class="text-sm text-gray-500 line-clamp-2 mb-4 italic flex-1 break-words">
          {{ itemDesc }}
        </p>

        <div class="mt-auto space-y-3 pt-4 border-t border-gray-100">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <i class="bi bi-calendar3"></i> {{ itemDate }}
            </span>
            <span v-if="contractDuration" class="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold uppercase text-[10px]">
              {{ contractDuration }}
            </span>
          </div>

          <div class="flex justify-between items-center gap-2">
            <div class="shrink-0">
              <div class="bg-amber-100 text-amber-800 px-3 py-2 rounded-xl border-2 border-amber-200 flex items-center gap-2 shadow-sm">
                <i class="bi bi-tags-fill"></i>
                <span class="text-lg font-black leading-none whitespace-nowrap">{{ itemPrice }}</span>
              </div>
            </div>
            
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100 shrink-0">
               <i class="bi bi-arrow-right-short text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>