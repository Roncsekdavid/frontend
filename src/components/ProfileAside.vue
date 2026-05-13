<script setup>
import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '../state/stateAuth';
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const auth = useAuthStore();
const isMenuOpen = ref(false);
const router = useRouter()
const route = useRoute()
const fileInput = ref(null)
const isUploading = ref(false)
const uploadError = ref(null)

const { userName, userAvatarUrl: avatarUrl } = storeToRefs(auth)

const showCropModal = ref(false)
const cropImageSrc = ref('')
const cropperImageEl = ref(null)
let cropperInstance = null

const menuItems = [
  { name: 'Profilbeállítások', icon: 'bi-person-gear', to: '/profil' },
  { name: 'Felvett tárgyaim', icon: 'bi-box-seam', to: '/profil/targyaim' },
  { name: 'Bejövő ajánlatok', icon: 'bi-envelope-paper', to: '/profil/ajanlatok' },
  { name: 'Hiteleim', icon: 'bi-cash-coin', to: '/profil/hiteleim' },
  { name: 'Jelszó módosítása', icon: 'bi-key', to: '/profil/jelszo' },
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

function triggerFileInput() {
    uploadError.value = null
    fileInput.value?.click()
}

function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        cropImageSrc.value = e.target.result
        showCropModal.value = true
        setTimeout(() => {
            if (cropperInstance) {
                cropperInstance.destroy()
                cropperInstance = null
            }
            cropperInstance = new Cropper(cropperImageEl.value, {
                aspectRatio: 1,
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                background: false,
                modal: true,
            })
        }, 100)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
}

function cancelCrop() {
    showCropModal.value = false
    cropImageSrc.value = ''
    if (cropperInstance) {
        cropperInstance.destroy()
        cropperInstance = null
    }
}

async function applyCrop() {
    if (!cropperInstance) return

    isUploading.value = true
    uploadError.value = null

    cropperInstance.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    }).toBlob(async (blob) => {
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
        const result = await auth.uploadAvatar(file)

        isUploading.value = false

        if (result.success) {
            cancelCrop()
        } else {
            uploadError.value = 'Feltöltés sikertelen. Próbáld újra.'
            cancelCrop()
        }
    }, 'image/jpeg', 0.9)
}

onUnmounted(() => {
    if (cropperInstance) cropperInstance.destroy()
})
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

            <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
            />

            <button
                @click="triggerFileInput"
                :disabled="isUploading"
                class="relative group w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 border-2 border-[#E5B326] overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#E5B326] focus:ring-offset-2 disabled:opacity-60"
                title="Profilkép módosítása"
            >
                <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    alt="Profilkép"
                    class="w-full h-full object-cover"
                />
                <div
                    v-else
                    class="w-full h-full bg-gray-200 dark:bg-[#1A1614] flex items-center justify-center transition-colors"
                >
                    <i class="bi bi-person text-4xl md:text-5xl text-gray-400 dark:text-[#D4C7B0]/60"></i>
                </div>

                <div class="absolute inset-0 bg-[#4A2E23]/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <i v-if="!isUploading" class="bi bi-camera text-[#E5B326] text-2xl"></i>
                    <i v-else class="bi bi-arrow-repeat text-[#E5B326] text-2xl animate-spin"></i>
                    <span class="text-[#FBF5E9] text-[10px] font-bold uppercase mt-1 tracking-wide">
                        {{ isUploading ? 'Feltöltés...' : 'Módosítás' }}
                    </span>
                </div>
            </button>

            <h3 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] text-m md:text-base uppercase transition-colors">
                {{ userName }}
            </h3>

            <p class="text-xs text-[#4A2E23]/50 dark:text-[#D4C7B0]/40 mt-1 font-medium">
                Kattints a képre a módosításhoz
            </p>

            <p v-if="uploadError" class="text-xs text-red-500 mt-2 font-bold">
                {{ uploadError }}
            </p>
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

    <Transition name="modal">
        <div v-if="showCropModal"
            class="fixed inset-0 z-[600] flex items-center justify-center p-4"
            @click.self="cancelCrop">

            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <div class="relative bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] w-full max-w-lg overflow-hidden">

                <div class="px-6 py-4 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 flex items-center justify-between">
                    <h3 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase tracking-wide flex items-center gap-2">
                        <i class="bi bi-crop text-[#E5B326]"></i>
                        Profilkép beállítása
                    </h3>
                    <button @click="cancelCrop" class="text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 hover:text-[#4A2E23] dark:hover:text-[#D4C7B0] transition-colors">
                        <i class="bi bi-x-lg text-lg"></i>
                    </button>
                </div>

                <div class="p-0 bg-black overflow-hidden" style="max-height: 400px;">
                    <img ref="cropperImageEl" :src="cropImageSrc" class="max-w-full block" alt="Vágandó kép" />
                </div>

                <div class="px-6 py-3 border-t border-[#4A2E23]/10 dark:border-[#E5B326]/15 flex items-center justify-center gap-3">
                    <button @click="cropperInstance?.zoom(-0.1)"
                        class="w-9 h-9 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] flex items-center justify-center text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] hover:border-[#E5B326] transition-all font-bold">
                        <i class="bi bi-zoom-out"></i>
                    </button>
                    <button @click="cropperInstance?.zoom(0.1)"
                        class="w-9 h-9 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] flex items-center justify-center text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] hover:border-[#E5B326] transition-all font-bold">
                        <i class="bi bi-zoom-in"></i>
                    </button>
                    <button @click="cropperInstance?.rotate(-90)"
                        class="w-9 h-9 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] flex items-center justify-center text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] hover:border-[#E5B326] transition-all font-bold">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>
                    <button @click="cropperInstance?.rotate(90)"
                        class="w-9 h-9 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] flex items-center justify-center text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] hover:border-[#E5B326] transition-all font-bold">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    <button @click="cropperInstance?.reset()"
                        class="w-9 h-9 rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326] flex items-center justify-center text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] hover:border-[#E5B326] transition-all font-bold">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                </div>

                <div class="px-6 py-4 flex gap-3">
                    <button @click="cancelCrop"
                        class="flex-1 border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#D4C7B0] font-black py-3 rounded-full hover:bg-[#4A2E23] hover:text-white dark:hover:bg-[#E5B326] dark:hover:text-[#4A2E23] transition-all uppercase tracking-wide">
                        Mégse
                    </button>
                    <button @click="applyCrop" :disabled="isUploading"
                        class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-3 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wide disabled:opacity-60 flex items-center justify-center gap-2">
                        <i v-if="isUploading" class="bi bi-arrow-repeat animate-spin"></i>
                        {{ isUploading ? 'Feltöltés...' : 'Mentés' }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<style scoped>
:deep(.cropper-bg) {
    background-image: none !important;
    background-color: #000 !important;
}
:deep(.cropper-modal) {
    background-color: #000 !important;
    opacity: 0.6;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
.animate-spin { animation: spin 0.8s linear infinite; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.25s ease; }
.modal-enter-from .relative { transform: scale(0.92); }
</style>