<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: Number,            
  title: String,
  userName: String,
  userImage: String,
  joinedDate: String,
  theme: String
});

const loadImage = computed(() => {
  return new URL(props.userImage, import.meta.url).href;
});
</script>

<template>
  <router-link
    :to="`/ugyfelek/${id}`"
    class="block" >
    <div
      class="w-full max-w-[360px] min-w-[260px] rounded-2xl p-5 shadow-md hover:shadow-xl 
             transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 
             border border-blue-200 flex flex-col gap-4"
      :class="theme"
    >
      <div class="flex items-center gap-4">
        <img
          :src="loadImage"
          :alt="userName"
          class="w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-blue-300 shrink-0"
        />

        <div class="flex flex-col min-w-0">
          <h3 class="text-xl font-semibold text-blue-900 leading-tight break-words whitespace-normal">
            {{ title }}
          </h3>

          <p class="text-blue-700 text-sm break-words whitespace-normal">
            {{ userName }}
          </p>
        </div>
      </div>

      <div class="pt-4 border-t border-blue-200">
        <p class="text-blue-500 text-sm">Csatlakozott:</p>
        <p class="text-blue-800 font-medium break-words whitespace-normal">
          {{ joinedDate }}
        </p>
      </div>
    </div>
  </router-link>
</template>
