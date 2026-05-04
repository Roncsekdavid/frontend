<script setup>
import { computed } from 'vue';


const props = defineProps({
    itemTitle: String,
    itemImage: String,
    itemName: String,
    itemDate: String,
    itemDesc: String,
    itemPrice: [String, Number],
    itemCategory: String,
    to: { type: [String, Object], default: null }
})
const loadImage = computed(() => {
    return new URL(props.itemImage, import.meta.url).href
})
</script>
<template>
    <div class="bg-white rounded-3xl transition-all duration-200 cursor-pointer p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
      <router-link v-if="to" :to="to" class="block">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">
            {{ itemTitle }}
          </h2>
  
          <img
            :src="loadImage"
            :alt="itemTitle"
            class="w-full h-48 object-cover rounded-xl shadow-sm"
          />

          <p class="text-lg font-semibold text-gray-900 mt-4">
            {{ itemName }}
          </p>
  

          <p class="text-sm text-gray-600 mt-1 border-b border-gray-200 pb-3 leading-relaxed">
            {{ itemDesc }} <br />
            {{ itemDate }}
          </p>
  
          <p class="text-2xl font-bold text-blue-900 mt-4">
            {{ itemPrice }}
          </p>
        </div>
      </router-link>
  
      <div v-else>
        <h2 class="text-xl font-semibold text-gray-900 mb-3">
          {{ itemTitle }}
        </h2>
  
        <img
          :src="loadImage"
          :alt="itemTitle"
          class="w-full h-48 object-cover rounded-xl shadow-sm"
        />
  
        <p class="text-lg font-semibold text-gray-900 mt-4">
          {{ itemName }}
        </p>
  
        <p class="text-sm text-gray-600 mt-1 border-b border-gray-200 pb-3 leading-relaxed">
          {{ itemDesc }} <br />
          {{ itemDate }}
        </p>
  
        <p class="text-2xl font-bold text-blue-900 mt-4">
          {{ itemPrice }} Ft.
        </p>
      </div>
    </div>
  </template>
  


<style scope>
.card-theme {
    background-color: white;
}

.card-theme img{
    object-fit: cover;

}
</style>