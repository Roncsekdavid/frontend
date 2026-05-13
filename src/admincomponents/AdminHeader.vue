<script setup>
import { computed, onMounted } from 'vue';
import { adminState } from '../adminstate/state';

const adminStore = adminState();

const currentUser = computed(() => adminStore.getCurrentUser());

onMounted(async () => {
    if (!adminStore.getCurrentUser()) {
        await adminStore.getCurrentUserFromApi();
    }
});
</script>

<template>
    <header class="grid grid-cols-12 justify-between items-center mb-5 border-b border-gray-400 pb-4 animate__animated animate__fadeInDown">
        <div class="col-span-12 md:col-span-12 lg:col-span-10">
            <h1 class="text-4xl font-bold">
                ZaciPaci <span class="text-gray-500">Admin Panel</span>
            </h1>
        </div>
        
        <div class="col-span-12 md:col-span-12 lg:col-span-2 flex items-center gap-6 justify-end">
            <div v-if="currentUser" class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full border-2 border-[#051826] flex items-center justify-center overflow-hidden bg-white shadow-sm">
                    <img v-if="currentUser.getAvatarUrl()" 
                         :src="currentUser.getAvatarUrl()" 
                         class="w-full h-full object-cover" />
                    <span v-else class="text-xl font-black text-[#051826]">
                        {{ currentUser.getName().charAt(0).toUpperCase() }}
                    </span>
                </div>
                <p class="text-xl font-medium">{{ currentUser.getName() }}</p>
            </div>
            
            <div v-else class="flex items-center gap-3 animate-pulse">
                <div class="w-12 h-12 rounded-full bg-gray-300"></div>
                <div class="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
        </div>
    </header>
</template>

<style scoped>
</style>