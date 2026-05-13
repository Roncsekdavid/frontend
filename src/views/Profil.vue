<script setup>
import { onMounted } from 'vue';
import MainHeader from '../components/MainHeader.vue';
import ProfileAside from '../components/ProfileAside.vue';
import { useAuthStore } from '../state/stateAuth';

const auth = useAuthStore();

onMounted(async () => {
    await auth.fetchUser();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#1A1614] pb-12 transition-colors duration-300">
        <MainHeader />

        <div class="flex flex-col md:flex-row max-w-7xl mx-auto mt-4 md:mt-8 px-4 gap-6 md:gap-8">

            <ProfileAside :userName="auth.user?.getName?.() ?? ''" />

            <main class="w-full md:w-3/4">
                <Transition name="tab" mode="out-in">
                    <router-view />
                </Transition>
            </main>
        </div>
    </div>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active {
    transition: all 0.2s ease;
}

.tab-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.tab-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>