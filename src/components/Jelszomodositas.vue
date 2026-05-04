<script setup>
import { ref, computed } from 'vue'
import api from '../services/api'

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const isNewFocused = ref(false)

const isSubmitting = ref(false)
const showConfirmModal = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const hasMinLength = computed(() => newPassword.value.length >= 8)
const hasLowercase = computed(() => /[a-z]/.test(newPassword.value))
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value))
const isNewValid = computed(() => hasMinLength.value && hasLowercase.value && hasUppercase.value)

function validate() {
    errorMsg.value = ''
    if (!currentPassword.value) {
        errorMsg.value = 'Kérjük adja meg a jelenlegi jelszavát!'
        return false
    }
    if (!isNewValid.value) {
        errorMsg.value = 'Az új jelszó nem felel meg a követelményeknek!'
        return false
    }
    if (newPassword.value !== confirmNewPassword.value) {
        errorMsg.value = 'A két új jelszó nem egyezik meg!'
        return false
    }
    if (newPassword.value === currentPassword.value) {
        errorMsg.value = 'Az új jelszó nem egyezhet meg a jelenlegivel!'
        return false
    }
    return true
}

function handleSubmit() {
    if (!validate()) return
    showConfirmModal.value = true
}

async function confirmSave() {
    showConfirmModal.value = false
    isSubmitting.value = true
    successMsg.value = ''
    errorMsg.value = ''

    try {
        await api.patch('/users/me/password', {
            current_password: currentPassword.value,
            new_password: newPassword.value
        })
        successMsg.value = 'A jelszó sikeresen megváltozott!'
        currentPassword.value = ''
        newPassword.value = ''
        confirmNewPassword.value = ''
    } catch (err) {
        errorMsg.value = err.response?.data?.error || 'Hiba történt a jelszó módosítása során.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div
        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] p-6 md:p-10 shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326] transition-colors">

        <div class="flex items-center gap-3 mb-8">
            <div
                class="w-10 h-10 bg-[#E5B326] rounded-full flex items-center justify-center border-2 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0">
                <i class="bi bi-shield-lock-fill text-[#4A2E23]"></i>
            </div>
            <div>
                <h2 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase tracking-tight">Jelszó
                    módosítása</h2>
                <p class="text-xs font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">Tartsa biztonságban fiókját</p>
            </div>
        </div>

        <div v-if="errorMsg"
            class="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs font-bold text-center animate-shake">
            <i class="bi bi-exclamation-circle-fill mr-1"></i> {{ errorMsg }}
        </div>

        <div v-if="successMsg"
            class="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 p-3 rounded-2xl text-xs font-bold text-center">
            <i class="bi bi-check-circle-fill mr-1"></i> {{ successMsg }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>

            <div class="space-y-1">
                <label class="block text-sm font-bold text-[#4A2E23] dark:text-[#D4C7B0] ml-1">Jelenlegi jelszó</label>
                <div
                    class="relative flex items-center bg-white dark:bg-[#1A1614] border border-gray-200 dark:border-[#E5B326]/20 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326] transition-all">
                    <i class="bi bi-lock text-gray-400 mr-3"></i>
                    <input :type="showCurrent ? 'text' : 'password'" v-model="currentPassword" placeholder="••••••••"
                        class="w-full bg-transparent text-[#4A2E23] dark:text-[#FBF5E9] font-semibold outline-none border-none focus:ring-0" />
                    <button type="button" @mousedown.prevent @click="showCurrent = !showCurrent"
                        class="text-gray-400 hover:text-[#4A2E23] dark:hover:text-[#FBF5E9] ml-2">
                        <i class="bi" :class="showCurrent ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-bold text-[#4A2E23] dark:text-[#D4C7B0] ml-1">Új jelszó</label>
                <div
                    class="relative flex items-center bg-white dark:bg-[#1A1614] border border-gray-200 dark:border-[#E5B326]/20 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326] transition-all">
                    <i class="bi bi-shield-lock text-gray-400 mr-3"></i>
                    <input :type="showNew ? 'text' : 'password'" v-model="newPassword" @focus="isNewFocused = true"
                        @blur="isNewFocused = false" placeholder="••••••••"
                        class="w-full bg-transparent text-[#4A2E23] dark:text-[#FBF5E9] font-semibold outline-none border-none focus:ring-0" />
                    <button type="button" @mousedown.prevent @click="showNew = !showNew"
                        class="text-gray-400 hover:text-[#4A2E23] dark:hover:text-[#FBF5E9] ml-2">
                        <i class="bi" :class="showNew ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                </div>

                <div v-if="isNewFocused || newPassword" class="px-2 pt-1 space-y-1">
                    <div class="flex items-center text-[11px] font-bold"
                        :class="hasMinLength ? 'text-green-600' : 'text-red-500'">
                        <i class="bi mr-1.5" :class="hasMinLength ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                        Legalább 8 karakter hosszú
                    </div>
                    <div class="flex items-center text-[11px] font-bold"
                        :class="hasLowercase ? 'text-green-600' : 'text-red-500'">
                        <i class="bi mr-1.5" :class="hasLowercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                        Tartalmaz kisbetűt
                    </div>
                    <div class="flex items-center text-[11px] font-bold"
                        :class="hasUppercase ? 'text-green-600' : 'text-red-500'">
                        <i class="bi mr-1.5" :class="hasUppercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                        Tartalmaz nagybetűt
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label class="block text-sm font-bold text-[#4A2E23] dark:text-[#D4C7B0] ml-1">Új jelszó
                    megerősítése</label>
                <div
                    class="relative flex items-center bg-white dark:bg-[#1A1614] border border-gray-200 dark:border-[#E5B326]/20 rounded-xl px-4 py-2.5 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326] transition-all">
                    <i class="bi bi-shield-check text-gray-400 mr-3"></i>
                    <input :type="showNew ? 'text' : 'password'" v-model="confirmNewPassword" placeholder="••••••••"
                        class="w-full bg-transparent text-[#4A2E23] dark:text-[#FBF5E9] font-semibold outline-none border-none focus:ring-0" />
                    <button type="button" @mousedown.prevent @click="showNew = !showNew"
                        class="text-gray-400 hover:text-[#4A2E23] dark:hover:text-[#FBF5E9] ml-2">
                        <i class="bi" :class="showNew ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                </div>
                <div v-if="confirmNewPassword" class="px-2 pt-1">
                    <div class="flex items-center text-[11px] font-bold"
                        :class="newPassword === confirmNewPassword ? 'text-green-600' : 'text-red-500'">
                        <i class="bi mr-1.5"
                            :class="newPassword === confirmNewPassword ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                        {{ newPassword === confirmNewPassword ? 'A jelszavak egyeznek' : 'A jelszavak nem egyeznek' }}
                    </div>
                </div>
            </div>

            <div class="pt-2">
                <button type="submit" :disabled="isSubmitting"
                    class="w-full bg-[#E5B326] hover:bg-[#d0a01e] disabled:opacity-50 text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider">
                    <span v-if="!isSubmitting">
                        Jelszó mentése
                    </span>
                    <span v-else class="flex items-center justify-center gap-2">
                        <i class="bi bi-arrow-repeat animate-spin"></i> Mentés...
                    </span>
                </button>
            </div>

        </form>
    </div>

    <Teleport to="body">
        <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div @click="showConfirmModal = false" class="absolute inset-0 bg-[#4A2E23]/60 backdrop-blur-sm"></div>

            <div
                class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] p-8 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] max-w-sm w-full text-center animate-popIn">
                <div
                    class="w-16 h-16 bg-[#E5B326] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#4A2E23]">
                    <i class="bi bi-shield-exclamation text-2xl text-[#4A2E23]"></i>
                </div>
                <h3 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase mb-2">Biztosan módosítja?
                </h3>
                <p class="text-sm font-bold text-[#4A2E23]/60 dark:text-[#D4C7B0]/60 mb-8">
                    A jelenlegi jelszava felülíródik, és az újjal tud majd bejelentkezni.
                </p>
                <div class="flex gap-3">
                    <button @click="showConfirmModal = false"
                        class="flex-1 bg-gray-100 dark:bg-[#1A1614] hover:bg-gray-200 dark:hover:bg-[#2e2622] text-[#4A2E23] dark:text-[#D4C7B0] font-black py-3 rounded-full transition-all uppercase tracking-wide text-sm">
                        Mégse
                    </button>
                    <button @click="confirmSave"
                        class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-3 rounded-full transition-all shadow-[0px_3px_0px_#a9841c] active:shadow-none active:translate-y-0.5 uppercase tracking-wide text-sm">
                        Igen, mentés
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
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

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-popIn {
    animation: popIn 0.2s ease-out;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    display: inline-block;
    animation: spin 0.8s linear infinite;
}
</style>