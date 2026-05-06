<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { adminState } from '../adminstate/state'
import LoanCard from './LoanCard.vue' // Importáljuk a LoanCard komponenst

const props = defineProps({
    open: Boolean,
    itemImage: String,
    itemName: String,
    itemDesc: String,
    itemDate: String,
    itemPrice: String,
    itemCategory: String,
    itemId: Number
})

const adminStore = adminState()
const router = useRouter()
const currentLoan = ref(null)

const emit = defineEmits(["close"])
const close = () => emit("close")

watch(() => props.open, async (isOpen) => {
    if (isOpen) {
        if (adminStore.getLoans().length === 0) {
            await adminStore.getLoansFromApi();
        }
        
        const allOffers = adminStore.getOffers();
        const itemOffer = allOffers.find(o => o.getItemId() === props.itemId);

        if (itemOffer) {
            currentLoan.value = adminStore.getLoans().find(l => 
                l.getOfferId() === itemOffer.getId()
            ) || null;
        } else {
            currentLoan.value = null;
        }
    }
});

// A kártyára kattintva navigálunk a kezelőfelületre
const goToLoanManage = (loan) => {
    router.push(`/admin/loans/${loan.getId()}`)
    close()
}

const loadImage = computed(() => {
    return props.itemImage ? new URL(props.itemImage, import.meta.url).href : '/src/assets/loan_default.png'
})
</script>

<template>
    <div v-if="open" class="fixed inset-0 bg-[#051826]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="close">
        <div class="bg-white rounded-[2.5rem] border-4 border-[#051826] shadow-[12px_12px_0px_#051826] w-full max-w-6xl overflow-hidden relative animate-in flex flex-col lg:flex-row">
            
            <!-- Bezáró gomb -->
            <button @click="close" class="absolute top-6 right-6 z-30 w-12 h-12 bg-white border-2 border-[#051826] rounded-full flex items-center justify-center hover:bg-red-50 transition-all shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none">
                <i class="bi bi-x-lg text-xl text-[#051826]"></i>
            </button>

            <!-- BAL OLDAL: Tárgy részletei -->
            <div class="w-full lg:w-[60%] border-b-4 lg:border-b-0 lg:border-r-4 border-[#051826] flex flex-col">
                <div class="relative w-full h-80 lg:h-[400px] border-b-4 border-[#051826]">
                    <img :src="loadImage" class="w-full h-full object-cover" />
                    <div class="absolute bottom-6 left-6">
                        <span class="bg-amber-400 text-[#051826] px-5 py-2 rounded-xl font-black text-xs uppercase border-2 border-[#051826] shadow-[4px_4px_0px_#051826]">
                            {{ itemCategory }}
                        </span>
                    </div>
                </div>
                <div class="p-8 lg:p-10">
                    <h2 class="text-4xl font-black text-[#051826] mb-6">{{ itemName }}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div class="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100">
                            <p class="text-[10px] font-black text-blue-400 uppercase mb-1">Becsült érték</p>
                            <p class="text-3xl font-black text-blue-900">{{ itemPrice }}</p>
                        </div>
                        <div class="bg-gray-50 p-5 rounded-2xl border-2 border-gray-100">
                            <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Feltöltve</p>
                            <p class="text-xl font-bold text-gray-700">{{ itemDate }}</p>
                        </div>
                    </div>
                    <p class="text-gray-600 italic border-l-4 border-gray-200 pl-4">{{ itemDesc }}</p>
                </div>
            </div>

            <!-- JOBB OLDAL: Kapcsolódó hitel megjelenítése LoanCard-dal -->
            <div class="w-full lg:w-[40%] p-8 lg:p-12 bg-slate-50 flex flex-col">
                <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Kapcsolódó Hitel</p>

                <div v-if="currentLoan" class="flex-1">
                    <!-- A LoanCard komponenst használjuk a manuális kód helyett -->
                    <LoanCard 
                        :loan="currentLoan" 
                        @open="goToLoanManage" 
                    />
                </div>
                
                <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-10 bg-white rounded-[2rem] border-4 border-dashed border-gray-200">
                    <i class="bi bi-bank2 text-4xl text-gray-200 mb-4"></i>
                    <p class="text-gray-400 font-black uppercase tracking-widest text-sm">Nincs aktív hitel</p>
                    <p class="text-gray-400 text-xs mt-1">Ehhez a tárgyhoz még nem tartozik szerződés.</p>
                </div>

                <button @click="close" class="mt-8 w-full py-5 bg-[#051826] text-white font-black rounded-2xl shadow-[6px_6px_0px_#000] hover:bg-gray-800 transition-all uppercase tracking-widest active:translate-y-1 active:shadow-none">
                    Bezárás
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes zoom-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
.animate-in { animation: zoom-in 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1); }
</style>