<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../state/stateAuth';
import { useRouter, useRoute } from 'vue-router'

defineProps({
    userName: String
});

const auth = useAuthStore();
const isMenuOpen = ref(false);
const router = useRouter()
const route = useRoute()

const menuItems = [
  { name: 'Profilbeállítások', icon: 'bi-person-gear', to: '/profil' },
  { name: 'Feltett tárgyaim', icon: 'bi-box-seam', to: '/profil/targyaim' },
  { name: 'Bejövő ajánlatok', icon: 'bi-envelope-paper', to: '/profil/ajanlatok' },
  { name: 'Hiteleim', icon: 'bi-cash-coin', to: '/profil/hiteleim' },
  { name: 'Jelszó módosítása', icon: 'bi-shield-lock', to: '/profil/jelszo' },
  { name: 'Kijelentkezés', icon: 'bi-box-arrow-right', class: 'text-red-500' }
]

function isActive(item) {
    if (!item.to) return false
    if (item.to === '/profil') return route.path === '/profil'
    return route.path.startsWith(item.to)
}

function handleClick(item) {
    isMenuOpen.value = false
    if (item.name === 'Kijelentkezés') {
        auth.logout()
        router.push('/')
    }
}
</script>

<template>
    <aside class="w-full md:w-1/4 flex flex-col gap-4">

        <div class="md:hidden relative order-1">
            <button @click="isMenuOpen = !isMenuOpen"
                class="w-full bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-2xl p-4 shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326] flex items-center justify-between font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase tracking-wide transition-colors">
                <span class="flex items-center">
                    <i class="bi bi-list mr-3 text-xl"></i> Funkciók
                </span>
                <i class="bi" :class="isMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </button>

            <div v-if="isMenuOpen"
                class="absolute z-50 w-full mt-2 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-2xl shadow-xl overflow-hidden animate-fadeIn transition-colors">
                <component
                    v-for="item in menuItems"
                    :key="item.name"
                    :is="item.to ? 'router-link' : 'button'"
                    :to="item.to"
                    @click="handleClick(item)"
                    class="w-full flex items-center px-6 py-4 text-left font-bold border-b border-gray-100 dark:border-[#E5B326]/10 last:border-0 transition-colors hover:bg-[#E5B326] dark:hover:bg-[#E5B326] hover:text-[#4A2E23]"
                    :class="[isActive(item) ? 'text-[#4A2E23] dark:text-[#FBF5E9]' : 'text-[#4A2E23]/60 dark:text-[#D4C7B0]/60', item.class]"
                >
                    <i class="bi mr-3" :class="[item.icon, isActive(item) ? 'text-[#E5B326]' : '']"></i>
                    {{ item.name }}
                </component>
            </div>
        </div>

        <div class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] p-6 shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326] text-center order-2 md:order-1 transition-colors">
            <div class="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-[#1A1614] rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-[#E5B326] transition-colors">
                <i class="bi bi-person text-4xl md:text-5xl text-gray-400 dark:text-[#D4C7B0]/60"></i>
            </div>
            <h3 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] text-m md:text-base uppercase transition-colors">{{ userName }}</h3>
        </div>

        <nav class="cursor-pointer hidden md:block bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] overflow-hidden shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326] order-2 transition-colors">
            <component
                v-for="item in menuItems"
                :key="item.name"
                :is="item.to ? 'router-link' : 'button'"
                :to="item.to"
                @click="handleClick(item)"
                class="w-full flex items-center px-6 py-4 text-left font-bold transition-all border-b border-gray-100 dark:border-[#E5B326]/10 last:border-0 hover:bg-[#E5B326] dark:hover:bg-[#E5B326] hover:text-[#4A2E23] group"
                :class="[isActive(item) ? 'text-[#4A2E23] dark:text-[#FBF5E9] bg-[#E5B326]/10' : 'text-[#4A2E23]/60 dark:text-[#D4C7B0]/60', item.class]"
            >
                <i class="bi mr-3 transition-colors"
                    :class="[item.icon, isActive(item) ? 'text-[#E5B326] group-hover:text-[#4A2E23]' : '']"></i>
                {{ item.name }}
            </component>
        </nav>

    </aside>
</template>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
}
</style>