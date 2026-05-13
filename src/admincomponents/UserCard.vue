<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  id: Number,
  userName: { type: String, default: '' },
  userImage: String,
  joinedDate: String,
  contracts: { type: [Number, String], default: 0 },
  email: String,
  phone: String,
})

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
  <div class="relative group">
    <div v-if="loading" class="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm animate-pulse">
      <div class="flex flex-col items-center">
        <div class="w-28 h-28 rounded-full bg-gray-200 mb-5"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div class="w-full space-y-4">
          <div v-for="i in 4" :key="i" class="h-4 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    </div>

    <router-link
      v-else
      :to="`/ugyfelek/${id}`"
      class="bg-white rounded-3xl p-8 border-2 border-[#051826] shadow-[6px_6px_0px_#051826] hover:shadow-[10px_10px_0px_#051826] hover:-translate-y-1 transition-all duration-300 block overflow-hidden relative"
    >
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <i class="bi bi-person-badge text-6xl text-[#051826]"></i>
      </div>

      <div class="flex flex-col items-center text-center relative z-10">
        <div class="relative">
          <div class="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg">
            <div class="w-full h-full rounded-full overflow-hidden bg-white border-4 border-white">
              <img v-if="userImage" :src="loadImage" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-[#051826] text-3xl font-black">
                {{ initials }}
              </div>
            </div>
          </div>
          <div class="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
        </div>

        <h4 class="text-2xl font-black text-gray-900 mt-5 tracking-tight group-hover:text-blue-700 transition-colors">
          {{ userName }}
        </h4>
        
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">ID: #{{ id }}</span>

        <div class="mt-8 w-full space-y-3">
          <div class="flex items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-600 mr-3">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="text-left">
              <p class="text-[10px] text-gray-400 uppercase font-bold leading-none">Csatlakozott</p>
              <p class="text-sm font-semibold text-gray-700">{{ joinedDate }}</p>
            </div>
          </div>

          <div class="flex items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-600 mr-3 shrink-0">
              <i class="bi bi-envelope-at"></i>
            </div>
            <div class="text-left truncate">
              <p class="text-[10px] text-gray-400 uppercase font-bold leading-none">Email</p>
              <p class="text-sm font-semibold text-gray-700 truncate">{{ email }}</p>
            </div>
          </div>

          <div class="flex items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-600 mr-3">
              <i class="bi bi-telephone"></i>
            </div>
            <div class="text-left">
              <p class="text-[10px] text-gray-400 uppercase font-bold leading-none">Telefon</p>
              <p class="text-sm font-semibold text-gray-700">{{ phone }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 w-full py-3 rounded-xl border-2 border-transparent bg-[#051826] text-white font-bold text-sm transition-all group-hover:bg-blue-700 text-center">
          Profil megtekintése
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.group:hover .bi-person-badge {
  transform: rotate(-10deg) scale(1.1);
}
</style>