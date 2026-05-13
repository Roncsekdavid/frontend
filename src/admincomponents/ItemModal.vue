<script setup>
import { computed, ref, watch } from 'vue'
import UserCard from './UserCard.vue';
import { adminState } from '../adminstate/state';

const props = defineProps({
    open: Boolean,
    itemImage: String,
    itemName: String,
    itemDesc: String,
    itemDate: String,
    itemPrice: String,
    itemCategory: String,
    uploaderId: Number
})

const adminStore = adminState();
const currentUser = ref(null);


watch(
  () => [props.open, props.uploaderId],
  async ([isOpen, uid]) => {

    if (!isOpen || uid == null) return;


    if (adminStore.getUsers().length === 0) {
      await adminStore.getUsersFromApi();
    }

    const found = adminStore.getUsers().find(u =>
      typeof u.getId === 'function' ? u.getId() === uid : u.id === uid
    );

    currentUser.value = found || null;
  },
  { immediate: true }
);


const loadImage = computed(() => {
    return new URL(props.itemImage, import.meta.url).href;
});

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>


<template>
    <div v-if="open" class="fixed inset-0 bg-[#051826]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        @click.self="close">
        <div
            class="bg-white rounded-[2.5rem] border-4 border-[#051826] shadow-[12px_12px_0px_#051826] w-full max-w-6xl overflow-hidden relative animate-in flex flex-col lg:flex-row">
            <button @click="close"
                class="absolute top-6 right-6 z-30 w-12 h-12 bg-white border-2 border-[#051826] rounded-full flex items-center justify-center hover:bg-red-50 transition-all shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none">
                <i class="bi bi-x-lg text-xl text-[#051826]"></i>
            </button>

            <div class="w-full lg:w-[60%] border-b-4 lg:border-b-0 lg:border-r-4 border-[#051826] flex flex-col">
                <div class="relative w-full h-80 lg:h-[400px] border-b-4 border-[#051826]">
                    <img :src="loadImage" class="w-full h-full object-cover" />
                    <div class="absolute bottom-6 left-6">
                        <span
                            class="bg-amber-400 text-[#051826] px-5 py-2 rounded-xl font-black text-xs uppercase border-2 border-[#051826] shadow-[4px_4px_0px_#051826]">
                            {{ itemCategory }}
                        </span>
                    </div>
                </div>

                <div class="p-8 lg:p-10 bg-white">
                    <h2 class="text-4xl font-black text-[#051826] leading-none mb-6">{{ itemName }}</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div class="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100">
                            <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Becsült érték
                            </p>
                            <p class="text-3xl font-black text-blue-900">{{ itemPrice }} Ft</p>
                        </div>
                        <div class="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Feltöltve</p>
                            <p class="text-xl font-bold text-gray-700">{{ itemDate }}</p>
                        </div>
                    </div>

                    <div class="prose max-w-none">
                        <p class="text-lg text-gray-600 leading-relaxed italic border-l-4 border-gray-200 pl-6">
                            {{ itemDesc }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-[40%] p-8 lg:p-12 bg-slate-50 flex flex-col justify-between">
                <div>
                    <p
                        class="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 text-center lg:text-left">
                        Feltöltő profilja
                    </p>

                    <div v-if="currentUser" class="bg-white p-2">
                        <UserCard class="w-full" :id="currentUser.getId()" :userName="currentUser.getName()"
                            :userImage="currentUser.getAvatarUrl()" :joinedDate="currentUser.getRegisterDate()"
                            :email="currentUser.getEmail()" :phone="currentUser.getPhone()" />
                    </div>

                </div>

                <div class="mt-12">
                    <button
                        class="w-full py-5 bg-[#051826] text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none uppercase tracking-widest flex items-center justify-center gap-3"
                        @click="close">
                        Bezárás
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes zoom-in {
    from {
        opacity: 0;
        transform: scale(0.98);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-in {
    animation: zoom-in 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}
</style>