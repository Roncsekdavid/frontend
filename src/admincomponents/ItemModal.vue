<script setup>
import { computed } from 'vue'
import User from './User.vue';

const props = defineProps({
    open: Boolean,
    itemImage: String,
    itemName: String,
    itemDesc: String,
    itemDate: String,
    itemPrice: String,
    itemCategory: String,
    contractDuration: String,
    uploaderName: String,
    uploaderId: Number
})

const loadImage = computed(() => {
    return new URL(props.itemImage, import.meta.url).href
})

const emit = defineEmits(["close"])
const close = () => emit("close")
</script>

<template>
    <div v-if="open" class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 border-[#051826] shadow-[6px_6px_0px_#051826]"
        @click.self="close">

        <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl p-8 border border-white/40">

            <div class="overflow-hidden rounded-2xl shadow-md mb-6">
                <img :src="loadImage" class="w-full h-80 object-cover" />
            </div>

            <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight">
                {{ itemName }}
            </h2>

            <div class="mt-6 space-y-2 text-gray-700 text-base">
                <p><strong>Dátum:</strong> {{ itemDate }}</p>
                <p><strong>Ár:</strong> {{ itemPrice }} Ft.</p>
                <p><strong>Kategória:</strong> {{ itemCategory }}</p>
                <p>{{ itemDesc }}</p>
                <p v-if="contractDuration"><strong>Szerződés időtartama:</strong> {{ contractDuration }}</p>
            </div>

            <div class="mt-6">
                <User :id="uploaderId" :title="uploaderName" :userName="uploaderName" userImage="../assets/usericon.png"
                    joinedDate="2026.03.08." />
            </div>

            <button
                class="mt-8 w-full py-4 bg-blue-600 text-white text-lg rounded-2xl hover:bg-blue-700 transition shadow-md"
                @click="close">
                Bezárás
            </button>

        </div>
    </div>
</template>
