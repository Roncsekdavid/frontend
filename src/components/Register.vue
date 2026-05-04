<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../services/authService';

const name = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const error = ref("");

const registrationSuccess = ref(false);

const showPassword = ref(false);
const isPasswordFocused = ref(false);
const router = useRouter();

const hasMinLength = computed(() => password.value.length >= 8);
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const isPasswordValid = computed(() => hasMinLength.value && hasLowercase.value && hasUppercase.value);

watch(phone, (newValue) => {
    let x = newValue.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,3})(\d{0,4})/);
    if (!x[1]) {
        phone.value = "";
    } else {
        phone.value = !x[2] ? '+' + x[1] : '+' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '');
    }
});

const validateForm = () => {
    const nameRegex = /^[a-zA-Z\u00C0-\u017F\s]+$/;
    if (!nameRegex.test(name.value) || name.value.trim().split(" ").length < 2) {
        error.value = "Kérjük adjon meg érvényes nevet!";
        return false;
    }
    const cleanPhone = phone.value.replace(/\s/g, "");
    if (cleanPhone.length < 12) {
        error.value = "A telefonszám túl rövid!";
        return false;
    }
    if (!isPasswordValid.value) {
        error.value = "A jelszó nem felel meg a követelményeknek!";
        return false;
    }
    if (password.value !== confirmPassword.value) {
        error.value = "A két jelszó nem egyezik meg!";
        return false;
    }
    return true;
};

const handleRegister = async () => {
    error.value = "";
    message.value = "";
    if (!validateForm()) return;

    try {
        await register(name.value, email.value, phone.value, password.value);
        registrationSuccess.value = true;
    } catch (err) {
        error.value = err.response?.data?.error || "Hiba történt a regisztráció során.";
    }
};
</script>

<template>
    <main class="login-wrapper min-h-screen flex items-center justify-center p-4">
        <section class="w-full max-w-[500px]">
            <div
                class="bg-white/95 border-2 border-[#4A2E23] rounded-[40px] p-8 md:p-10 shadow-[8px_8px_0px_#4A2E23] transition-all duration-500">

                <div v-if="registrationSuccess" class="text-center py-6 space-y-6 animate-fade-in">
                    <div class="relative inline-block">
                        <div
                            class="bg-[#E5B326] w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <i class="bi bi-envelope-check text-white text-5xl"></i>
                        </div>
                        <div
                            class="absolute -top-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                            <i class="bi bi-check text-white font-bold"></i>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h2 class="text-2xl font-black text-[#4A2E23] uppercase">Majdnem kész!</h2>
                        <p class="text-[#4A2E23] font-medium leading-relaxed">
                            Küldtünk egy megerősítő e-mailt a következő címre:<br>
                            <span class="font-black text-[#E5B326] underline">{{ email }}</span>
                        </p>
                        <p class="text-sm text-[#4A2E23]/70 italic">
                            Kérjük, kattints a levélben található linkre a fiókod aktiválásához.
                        </p>
                    </div>

                    <div class="pt-4">
                        <router-link to="/login"
                            class="inline-block bg-[#4A2E23] text-white font-bold px-8 py-3 rounded-full hover:bg-[#3d261d] transition-colors shadow-md">
                            Vissza a bejelentkezéshez
                        </router-link>
                    </div>
                </div>

                <div v-else>
                    <div class="text-center mb-8">
                        <img class="inline-flex h-24 mb-4 object-contain" src="../assets/zacipaci-logo.png"
                            alt="ZaciPaci Logo">
                        <h2 class="text-3xl font-black text-[#4A2E23] uppercase tracking-tight">regisztráció</h2>
                        <div class="w-12 h-1 bg-[#E5B326] mx-auto mt-2 rounded-full"></div>
                    </div>

                    <form @submit.prevent="handleRegister" class="space-y-4" novalidate>

                        <div v-if="error"
                            class="bg-red-50 border-2 border-red-200 text-red-600 p-3 rounded-2xl text-xs font-bold text-center animate-shake">
                            {{ error }}
                        </div>

                        <div class="space-y-1">
                            <label class="block text-sm font-bold text-[#4A2E23] ml-1">Teljes név</label>
                            <div
                                class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                <i class="bi bi-person text-gray-400 mr-3"></i>
                                <input type="text" v-model="name" placeholder="Vezetéknév Keresztnév"
                                    class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0" />
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-sm font-bold text-[#4A2E23] ml-1">Telefonszám</label>
                            <div
                                class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                <i class="bi bi-telephone text-gray-400 mr-3"></i>
                                <input type="tel" v-model="phone" placeholder="36 30 123 4567"
                                    class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0" />
                            </div>
                            <div v-if="phone" class="px-2 pt-1">
                                <div class="flex items-center text-[11px] font-bold"
                                    :class="phone.replace(/\s/g, '').length >= 12 ? 'text-green-600' : 'text-red-500'">
                                    <i class="bi mr-1.5"
                                        :class="phone.replace(/\s/g, '').length >= 12 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                    {{ phone.replace(/\s/g, '').length >= 12 ? 'Érvényes telefonszám' : 'A telefonszám túl rövid' }}
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-sm font-bold text-[#4A2E23] ml-1">Email cím</label>
                            <div
                                class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                <i class="bi bi-envelope text-gray-400 mr-3"></i>
                                <input type="email" v-model="email" placeholder="zacipaci@email.com"
                                    class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-bold text-[#4A2E23] ml-1">Jelszó</label>
                            <div
                                class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                <i class="bi bi-shield-lock text-gray-400 mr-3"></i>
                                <input :type="showPassword ? 'text' : 'password'" v-model="password"
                                    @focus="isPasswordFocused = true" @blur="isPasswordFocused = false"
                                    placeholder="Zacipaci"
                                    class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0" />
                                <button type="button" @mousedown.prevent @click="showPassword = !showPassword"
                                    class="text-gray-400 hover:text-[#4A2E23] ml-2">
                                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                                </button>
                            </div>

                            <div v-if="isPasswordFocused" class="px-2 pt-1 space-y-1">
                                <div class="flex items-center text-[11px] font-bold"
                                    :class="hasMinLength ? 'text-green-600' : 'text-red-500'">
                                    <i class="bi mr-1.5"
                                        :class="hasMinLength ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                    Legalább 8 karakter hosszú
                                </div>
                                <div class="flex items-center text-[11px] font-bold"
                                    :class="hasLowercase ? 'text-green-600' : 'text-red-500'">
                                    <i class="bi mr-1.5"
                                        :class="hasLowercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                    Tartalmaz kisbetűt
                                </div>
                                <div class="flex items-center text-[11px] font-bold"
                                    :class="hasUppercase ? 'text-green-600' : 'text-red-500'">
                                    <i class="bi mr-1.5"
                                        :class="hasUppercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                    Tartalmaz nagybetűt
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="block text-sm font-bold text-[#4A2E23] ml-1">Jelszó megerősítése</label>
                            <div
                                class="relative flex items-center transition-all bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                <i class="bi bi-shield-check text-gray-400 mr-3"></i>
                                <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword"
                                    placeholder="Zacipaci"
                                    class="w-full bg-transparent text-[#4A2E23] font-semibold outline-none border-none focus:ring-0" />
                                <button type="button" @mousedown.prevent
                                    @click="showPassword = !showPassword"
                                    class="text-gray-400 hover:text-[#4A2E23] ml-2">
                                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                                </button>
                            </div>
                            <div v-if="confirmPassword" class="px-2 pt-1">
                                <div class="flex items-center text-[11px] font-bold"
                                    :class="password === confirmPassword ? 'text-green-600' : 'text-red-500'">
                                    <i class="bi mr-1.5"
                                        :class="password === confirmPassword ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                    {{ password === confirmPassword ? 'A jelszavak egyeznek' : 'A jelszavak nem egyeznek' }}
                                </div>
                            </div>
                        </div>

                        <button type="submit"
                            class="w-full bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider mt-4">
                            Regisztráció
                        </button>

                        <div class="text-center pt-4">
                            <p class="text-[#4A2E23]/60 font-medium">Van már fiókja?</p>
                            <router-link to="/login"
                                class="text-[#4A2E23] font-black hover:text-[#E5B326] transition-colors underline decoration-2 decoration-[#E5B326] underline-offset-4">
                                Jelentkezzen be!!
                            </router-link>
                        </div>
                    </form>
                </div>
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

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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