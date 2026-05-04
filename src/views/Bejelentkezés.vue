<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MainHeader from '../components/MainHeader.vue'
import Login from '../components/Login.vue'

const route = useRoute()
const showToast = ref(false)
const authMessage = history.state?.message ?? '';

onMounted(() => {
    if (authMessage) {
        showToast.value = true
        setTimeout(() => {
            showToast.value = false
        }, 4000)
    }
})
</script>

<template>
    <MainHeader />
    
    <div class="relative">
        <Login />

        <Transition name="toast">
            <div v-if="showToast"
                class="absolute top-8 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 bg-white border-2 border-[#E5B326] text-[#4A2E23] px-6 py-4 rounded-2xl shadow-[4px_4px_0px_#E5B326] font-bold text-sm whitespace-nowrap">
                <i class="bi bi-lock-fill text-[#E5B326] text-lg"></i>
                {{ authMessage }}
                <button @click="showToast = false" class="ml-2 text-gray-400 hover:text-[#4A2E23] transition-colors">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.4s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
}
</style>