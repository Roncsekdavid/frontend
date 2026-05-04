<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemImage: String,
  itemName: String,
  itemDesc: String,
  itemDate: String,
  itemPrice: String,
  itemCategory: String,
  contractDuration: String
});

const loadImage = computed(() => {
  return new URL(props.itemImage, import.meta.url).href;
});
</script>

<template>
  <div
    class="w-full max-w-[360px] min-w-[260px] bg-white rounded-2xl p-5 shadow-md
           hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col gap-4"
    @click="$emit('open')"
  >
    <img
      :src="loadImage"
      :alt="itemName"
      class="w-full h-48 object-cover rounded-xl shadow-sm"
    />

    <h3 class="text-2xl font-bold text-gray-900 break-words whitespace-normal leading-tight">
      {{ itemName }}
    </h3>

    <p class="text-sm text-gray-600 break-words whitespace-normal">
      {{ itemDesc }}
    </p>

    <div class="text-gray-700 text-sm break-words whitespace-normal">
      <p><span class="font-semibold">Dátum:</span> {{ itemDate }}</p>
      <p class="text-lg mt-10">
        <span class="font-semibold">Ár:</span> {{ itemPrice }} Ft.
      </p>
      <p v-if="contractDuration">
        <span class="font-semibold">Szerződés:</span> {{ contractDuration }}
      </p>
    </div>
  </div>
</template>
