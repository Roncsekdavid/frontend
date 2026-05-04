<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: Number,
  userName: String,
  userImage: String,
  joinedDate: String,
  contracts: Number,
  email: String,
  phone: String,
})

const loadImage = computed(() => {
  return new URL(props.userImage, import.meta.url).href;
});
</script>

<template>
  <router-link
    :to="`/ugyfelek/${id}`"
    class="bg-white rounded-3xl p-8 border-2 border-[#051826] shadow-[6px_6px_0px_#051826] hover:shadow-xl transition-all duration-300 block"
  >
    <div class="flex flex-col items-center text-center">

      <!-- Avatar -->
      <div class="w-28 h-28 rounded-full overflow-hidden shadow-md">
        <img :src="loadImage" class="w-full h-full object-cover" />
      </div>

      <h4 class="text-2xl font-bold text-gray-900 mt-5">{{ userName }}</h4>

      <div class="mt-6 w-full text-left space-y-2 text-gray-700 text-sm">

        <p class="flex items-center gap-2">
          <i class="fa-solid fa-calendar text-blue-600"></i>
          <span><strong>Csatlakozott:</strong> {{ joinedDate }}</span>
        </p>

        <p class="flex items-center gap-2">
          <i class="fa-solid fa-file-contract text-blue-600"></i>
          <span><strong>Szerződések:</strong> {{ contracts }}</span>
        </p>

        <p class="flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-blue-600"></i>
          <span><strong>Email Cím:</strong> {{ email }}</span>
        </p>

        <p class="flex items-center gap-2">
          <i class="fa-solid fa-clock text-blue-600"></i>
          <span><strong>Telefonszám:</strong> {{ phone }}</span>
        </p>

      </div>

    </div>
  </router-link>
</template>
