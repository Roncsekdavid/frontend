<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const showPassword = ref(false);

const props = defineProps({
    authMessage: {
        type: String,
        default: ''
    }
})

const handleLogin = async () => {
    error.value = ''
    try {
        await login(email.value, password.value)
        router.push('/')
    } catch (err) {
        error.value = err.response?.data?.error || 'Sikertelen bejelentkezés. Ellenőrizze adatait!'
    }
};
</script>

<template>
    <main class="login-wrapper min-h-screen flex items-center justify-center p-4">
        <section class="w-full max-w-[500px]">

            <div class="bg-white/95 border-2 border-[#4A2E23] rounded-[40px] p-8 md:p-12 shadow-[8px_8px_0px_#4A2E23]">

                <div class="text-center mb-8">
                    <img class="inline-flex h-24 mb-4 object-contain" src="../assets/zacipaci-logo.png"
                        alt="ZaciPaci Logo">
                    <h2 class="text-3xl font-black text-[#4A2E23] uppercase tracking-tight">Bejelentkezés</h2>
                    <div class="w-12 h-1 bg-[#E5B326] mx-auto mt-2 rounded-full"></div>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">

                    <div v-if="authMessage"
                        class="bg-amber-50 border-2 border-[#E5B326] text-[#4A2E23] p-4 rounded-2xl text-sm font-bold text-center">
                        <i class="bi bi-lock-fill text-[#E5B326] mr-2"></i>
                        {{ authMessage }}
                    </div>

                    <div v-if="error"
                        class="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-2xl text-sm font-bold text-center animate-shake">
                        <i class="bi bi-exclamation-triangle-fill mr-2"></i> {{ error }}
                    </div>

                    <div class="space-y-2">
                        <label for="email" class="block font-bold text-[#4A2E23] ml-1">Email cím</label>
                        <div
                            class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                            <i class="bi bi-envelope text-gray-400 mr-3"></i>
                            <input type="email" id="email" v-model="email" required placeholder="zacipaci@email.com"
                                class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0 placeholder:text-gray-300" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center ml-1">
                            <label for="password" class="font-bold text-[#4A2E23]">Jelszó</label>
                            <a href="#"
                                class="text-xs font-bold text-[#E5B326] hover:underline uppercase tracking-tighter">Elfelejtette?</a>
                        </div>
                        <div
                            class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                            <i class="bi bi-shield-lock text-gray-400 mr-3"></i>
                            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
                                placeholder="••••••••"
                                class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0 placeholder:text-gray-300" />
                            <button type="button" @click="showPassword = !showPassword"
                                class="text-gray-400 hover:text-[#4A2E23] transition-colors focus:outline-none ml-2">
                                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit"
                        class="w-full bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider mt-2">
                        Bejelentkezés
                    </button>

                    <div class="text-center pt-4">
                        <p class="text-[#4A2E23]/60 font-medium">Nincs még fiókja?</p>
                        <router-link to="/register"
                            class="text-[#4A2E23] font-black hover:text-[#E5B326] transition-colors underline decoration-2 decoration-[#E5B326] underline-offset-4">
                            Regisztráljon Most!
                        </router-link>
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>

<style scoped>
.login-wrapper {
    background: url('../assets/login-bg.jpg') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
}

button:active {
    transform: translateY(4px);
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>