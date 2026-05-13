<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue'
import api from '../services/api'
import Items from '../classes/Items'

const items = shallowRef([])
const loading = ref(true)
const error = ref('')

const selectedItem = ref(null)
const activeImageIndex = ref(0)
const activeFilter = ref('ALL')

const filters = [
    { value: 'ALL', label: 'Összes', icon: 'bi-grid-fill' },
    { value: 'SUBMITTED', label: 'Elbírálás alatt', icon: 'bi-hourglass-split' },
    { value: 'APPROVED', label: 'Elfogadva', icon: 'bi-check-circle-fill' },
    { value: 'FOR_SALE', label: 'Eladó', icon: 'bi-tag-fill' },
]

const visibleItems = computed(() => items.value.filter(i => i.getStatus() !== 'SOLD'))

const filteredItems = computed(() =>
    activeFilter.value === 'ALL'
        ? visibleItems.value
        : visibleItems.value.filter(i => i.getStatus() === activeFilter.value)
)

function acceptedLoanAmount(item) {
    const offers = Array.isArray(item?.offers) ? item.offers : []
    return offers.find(o => o.status === 'ACCEPTED')?.loan_amount ?? item?.getEstimatedValue()
}

const statusMap = {
    SUBMITTED: { label: 'Elbírálás alatt', icon: 'bi-hourglass-split', cls: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500/30' },
    APPROVED: { label: 'Elfogadva', icon: 'bi-check-circle-fill', cls: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30' },
    FOR_SALE: { label: 'Eladó', icon: 'bi-tag-fill', cls: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/30' },
}

function formatPrice(val) {
    if (!val) return '—'
    return Number(val).toLocaleString('hu-HU') + ' Ft'
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('hu-HU')
}

function openModal(item) {
    selectedItem.value = item
    const images = item.getItemImages()
    const primaryIdx = images.findIndex(i => i.is_primary)
    activeImageIndex.value = primaryIdx >= 0 ? primaryIdx : 0
    document.body.style.overflow = 'hidden'
}

function closeModal() {
    selectedItem.value = null
    document.body.style.overflow = ''
}

function prevImage() {
    const len = selectedItem.value?.getItemImages()?.length ?? 0
    if (len === 0) return
    activeImageIndex.value = (activeImageIndex.value - 1 + len) % len
}

function nextImage() {
    const len = selectedItem.value?.getItemImages()?.length ?? 0
    if (len === 0) return
    activeImageIndex.value = (activeImageIndex.value + 1) % len
}

function onKeydown(e) {
    if (!selectedItem.value) return
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
}

onMounted(async () => {
    window.addEventListener('keydown', onKeydown)
    try {
        const { data } = await api.get('/items')
        items.value = data.map(i => Items.fromApi(i))
    } catch (err) {
        error.value = err.response?.data?.error || 'Nem sikerült betölteni a tárgyakat.'
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<template>
    <div
        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">

        <h2 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-6 flex items-center">
            <i class="bi bi-box-seam mr-3 md:mr-4 text-[#E5B326]"></i> Felvett tárgyaim
        </h2>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
            <i class="bi bi-arrow-repeat animate-spin text-4xl text-[#E5B326]"></i>
            <p class="font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wide text-sm">Betöltés...
            </p>
        </div>

        <div v-else-if="error"
            class="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold text-center">
            <i class="bi bi-exclamation-circle-fill mr-2"></i>{{ error }}
        </div>

        <template v-else>
            <div class="flex flex-wrap gap-2 mb-6">
                <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
                    class="inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-1.5 rounded-full border-2 transition-all"
                    :class="activeFilter === f.value
                        ? 'bg-[#E5B326] border-[#E5B326] text-[#4A2E23] shadow-[0px_3px_0px_#a9841c]'
                        : 'bg-white dark:bg-[#1A1614] border-gray-200 dark:border-[#E5B326]/20 text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 hover:border-[#E5B326]'">
                    <i class="bi" :class="f.icon"></i>
                    {{ f.label }}
                    <span class="ml-0.5 bg-[#4A2E23]/10 dark:bg-white/10 rounded-full px-1.5 text-[10px]">
                        {{f.value === 'ALL' ? visibleItems.length : visibleItems.filter(i => i.getStatus() ===
                            f.value).length}}
                    </span>
                </button>
            </div>

            <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
                <div
                    class="w-20 h-20 bg-gray-100 dark:bg-[#1A1614] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30">
                    <i class="bi bi-box-seam text-3xl text-gray-300 dark:text-[#D4C7B0]/30"></i>
                </div>
                <p class="font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wide text-sm">
                    Nincs tárgy ebben a kategóriában
                </p>
            </div>

            <div v-else class="space-y-3">
                <div v-for="item in filteredItems" :key="item.getId()" @click="openModal(item)"
                    class="flex items-center gap-4 bg-gray-50 dark:bg-[#1A1614] border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10 rounded-2xl p-3 cursor-pointer hover:border-[#E5B326] transition-all group">

                    <div
                        class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/20 bg-gray-100 dark:bg-[#26211E]">
                        <img v-if="item.getPrimaryImage()" :src="item.getPrimaryImage()" :alt="item.getName()"
                            class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <i class="bi bi-image text-xl text-gray-300 dark:text-[#D4C7B0]/20"></i>
                        </div>
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <h4 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] text-sm truncate">
                                {{ item.getName() }}
                            </h4>
                            <span v-if="statusMap[item.getStatus()]"
                                class="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border"
                                :class="statusMap[item.getStatus()].cls">
                                <i class="bi" :class="statusMap[item.getStatus()].icon"></i>
                                {{ statusMap[item.getStatus()].label }}
                            </span>
                        </div>
                        <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                            <i class="bi bi-currency-exchange text-[#E5B326] mr-1"></i>
                            {{ formatPrice(acceptedLoanAmount(item)) }}
                        </p>
                        <span class="text-xs font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40">
                            <i class="bi bi-calendar3 mr-1"></i>{{ formatDate(item.getUploadDate()) }}
                        </span>
                        <span v-if="item.getCategory()"
                            class="text-xs font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 ml-2">
                            <i class="bi bi-tag mr-1"></i>{{ item.getCategory() }}
                        </span>
                    </div>

                    <div class="flex items-center self-center text-gray-300 dark:text-[#D4C7B0]/20 ml-1">
                        <i class="bi bi-chevron-right text-lg"></i>
                    </div>
                </div>
            </div>
        </template>
    </div>

    <Teleport to="body">
        <Transition name="modal">
            <div v-if="selectedItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4">

                <div @click="closeModal" class="absolute inset-0 bg-[#4A2E23]/60 backdrop-blur-sm"></div>

                <div
                    class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] w-full max-w-2xl max-h-[90vh] flex flex-col transition-colors">

                    <button @click="closeModal"
                        class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#FBF5E9] hover:bg-[#E5B326] transition-all shadow-sm">
                        <i class="bi bi-x-lg text-sm"></i>
                    </button>

                    <div class="flex-shrink-0 relative bg-gray-100 dark:bg-[#1A1614] rounded-t-[26px] overflow-hidden"
                        style="height: 280px;">
                        <img v-if="selectedItem.getItemImages()?.length"
                            :src="selectedItem.getItemImages()[activeImageIndex].url" :alt="selectedItem.getName()"
                            class="w-full h-full object-contain" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <i class="bi bi-image text-5xl text-gray-300 dark:text-[#D4C7B0]/20"></i>
                        </div>

                        <template v-if="selectedItem.getItemImages()?.length > 1">
                            <button @click.stop="prevImage"
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#26211E]/80 border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#FBF5E9] hover:bg-[#E5B326] transition-all shadow">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <button @click.stop="nextImage"
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#26211E]/80 border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#FBF5E9] hover:bg-[#E5B326] transition-all shadow">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                            <div
                                class="absolute bottom-3 right-3 bg-[#4A2E23]/70 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {{ activeImageIndex + 1 }} / {{ selectedItem.getItemImages().length }}
                            </div>
                        </template>
                    </div>

                    <div v-if="selectedItem.getItemImages()?.length > 1"
                        class="flex-shrink-0 flex gap-2 px-6 pt-4 overflow-x-auto pb-1">
                        <button v-for="(img, idx) in selectedItem.getItemImages()" :key="img.id"
                            @click="activeImageIndex = idx"
                            class="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all" :class="idx === activeImageIndex
                                ? 'border-[#E5B326] shadow-md'
                                : 'border-gray-200 dark:border-[#E5B326]/20 opacity-60 hover:opacity-100'">
                            <img :src="img.url" :alt="'Kép ' + (idx + 1)" class="w-full h-full object-cover" />
                        </button>
                    </div>

                    <div class="overflow-y-auto flex-1 p-6 md:p-8 space-y-5">
                        <div class="flex flex-wrap items-start gap-3">
                            <h3 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9] leading-tight flex-1">
                                {{ selectedItem.getName() }}
                            </h3>
                            <span v-if="statusMap[selectedItem.getStatus()]"
                                class="inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full border"
                                :class="statusMap[selectedItem.getStatus()].cls">
                                <i class="bi" :class="statusMap[selectedItem.getStatus()].icon"></i>
                                {{ statusMap[selectedItem.getStatus()].label }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div
                                class="bg-gray-50 dark:bg-[#1A1614] rounded-2xl p-4 border border-gray-100 dark:border-[#E5B326]/10">
                                <p
                                    class="text-[10px] font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wider mb-1">
                                    Igényelt összeg</p>
                                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                                    <i class="bi bi-currency-exchange text-[#E5B326] mr-1"></i>
                                    {{ formatPrice(acceptedLoanAmount(selectedItem)) }}
                                </p>
                            </div>
                            <div
                                class="bg-gray-50 dark:bg-[#1A1614] rounded-2xl p-4 border border-gray-100 dark:border-[#E5B326]/10">
                                <p
                                    class="text-[10px] font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wider mb-1">
                                    Feltöltve</p>
                                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                                    <i class="bi bi-calendar3 text-[#E5B326] mr-1"></i>{{
                                        formatDate(selectedItem.getUploadDate()) }}
                                </p>
                            </div>
                            <div v-if="selectedItem.getCategory()"
                                class="bg-gray-50 dark:bg-[#1A1614] rounded-2xl p-4 border border-gray-100 dark:border-[#E5B326]/10 col-span-2">
                                <p
                                    class="text-[10px] font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wider mb-1">
                                    Kategória</p>
                                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                                    <i class="bi bi-tag text-[#E5B326] mr-1"></i>{{ selectedItem.getCategory() }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="bg-gray-50 dark:bg-[#1A1614] rounded-2xl p-4 border border-gray-100 dark:border-[#E5B326]/10">
                            <p
                                class="text-[10px] font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wider mb-2">
                                Leírás</p>
                            <p
                                class="text-sm font-medium text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed whitespace-pre-line">
                                {{ selectedItem.getDescription() }}
                            </p>
                        </div>

                        <button @click="closeModal"
                            class="w-full bg-[#4A2E23] dark:bg-[#E5B326] hover:bg-[#5d3a2d] dark:hover:bg-[#d0a01e] text-white dark:text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#2a1a14] dark:shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider">
                            Bezárás
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>