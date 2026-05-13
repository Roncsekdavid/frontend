<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  id: [Number, String],
  title: String,
  userName: String,
  userImage: String,
  joinedDate: String,
  theme: String
});

const loadImage = computed(() => {
  if (!props.userImage) return '';
  return props.userImage.startsWith('http') 
    ? props.userImage 
    : new URL(props.userImage, import.meta.url).href;
});

const initials = computed(() => {
  return props.userName ? props.userName.charAt(0).toUpperCase() : '?';
});
</script>

<template>
  <div class="relative group h-full">
    <div v-if="loading" class="w-full max-w-[360px] min-w-[260px] bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 shadow-sm animate-pulse flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-blue-200 shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-blue-200 rounded w-3/4"></div>
          <div class="h-3 bg-blue-100 rounded w-1/2"></div>
        </div>
      </div>
      <div class="pt-4 border-t border-blue-100">
        <div class="h-4 bg-blue-200 rounded w-1/2"></div>
      </div>
    </div>

    <router-link
      v-else
      :to="`/ugyfelek/${id}`"
      class="block h-full"
    >
      <div
        class="w-full max-w-[360px] min-w-[260px] h-full rounded-2xl p-5 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-[#051826] shadow-[4px_4px_0px_#051826] group-hover:shadow-[8px_8px_0px_#051826] group-hover:-translate-y-1 flex flex-col justify-between gap-4 relative overflow-hidden"
        :class="theme"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="relative shrink-0">
            <div class="w-20 h-20 rounded-full p-1 bg-white shadow-sm border border-blue-200">
              <div class="w-full h-full rounded-full overflow-hidden bg-blue-50">
                <img
                  v-if="userImage"
                  :src="loadImage"
                  :alt="userName"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-blue-600 text-xl font-black">
                  {{ initials }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col min-w-0">
            <h3 class="text-xl font-bold text-blue-900 leading-tight break-words group-hover:text-blue-700 transition-colors">
              {{ title }}
            </h3>
            <p class="text-blue-600 text-sm font-medium truncate">
              {{ userName }}
            </p>
          </div>
        </div>

        <div class="pt-4 border-t border-blue-200 relative z-10 flex justify-between items-end">
          <div>
            <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Csatlakozott</p>
            <p class="text-sm font-bold text-blue-800">
              {{ joinedDate }}
            </p>
          </div>
          <div class="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center group-hover:bg-[#051826] group-hover:text-white group-hover:border-[#051826] transition-all">
            <i class="bi bi-chevron-right text-lg"></i>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>