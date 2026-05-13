<script setup>
import { ref, onMounted } from 'vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
import LoanCard from '../admincomponents/LoanCard.vue';
import ItemModal from '../admincomponents/ItemModal.vue';
import { adminState } from '../adminstate/state';
import router from '../router';

const store = adminState();
const modalOpen = ref(false);
const modalItem = ref({});
const isLoading = ref(true); // Új betöltési állapot definiálása

onMounted(async () => {
    isLoading.value = true; // Betöltés indítása
    try {
        await store.getLoansFromApi();
    } catch (error) {
        console.error("Hiba a hitelek lekérésekor:", error);
    } finally {
        // Dashboard-hoz hasonlóan 600ms késleltetés a simább UX érdekében
        setTimeout(() => {
            isLoading.value = false;
        }, 600);
    }
});

const openLoanModal = (loan) => {
    modalItem.value = {
        itemName: `Hitel #${loan.getOfferId()}`,
        itemDesc: loan.getNote() || "Nincs megjegyzés a hitelhez.",
        itemPrice: loan.getPrincipalAmount(),
        itemDate: loan.getStartDate(),
        itemCategory: loan.getStatus(),
        contractDuration: `${loan.getDurationMonths()} hónap`,
        itemImage: "/src/assets/loan_default.png" 
    };
    modalOpen.value = true;
};
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />

            <div v-if="isLoading" class="flex flex-col items-center justify-center h-[75vh]">
                <div class="w-20 h-20 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-6"></div>
                <h2 class="text-2xl font-black text-[#051826] animate-pulse uppercase tracking-widest">
                    Hitelek betöltése...
                </h2>
            </div>

            <div v-else class="m-10 animate__animated animate__fadeIn">
                <header class="mb-10">
                    <h3 class="text-5xl font-black text-[#051826] tracking-tight">
                        Hitelek
                    </h3>
                    <p class="text-gray-500 font-bold mt-2 uppercase tracking-widest text-sm">
                        Aktív kihelyezések és törlesztések kezelése
                    </p>
                </header>

                <div v-if="store.getLoans().length > 0" 
                     class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <LoanCard 
                        v-for="loan in store.getLoans()" 
                        :key="loan.getId()"
                        :loan="loan"
                        @click="router.push('/admin/loans/' + loan.getId())"
                    />
                </div>

                <div v-else class="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-200">
                    <div class="bg-gray-100 p-6 rounded-full mb-4">
                        <i class="bi bi-bank2 text-4xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-400 font-black uppercase tracking-widest text-lg">
                        Nincsenek rögzített hitelek
                    </p>
                    <p class="text-gray-400 text-sm italic">Az adatbázis jelenleg üres.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
}

.grid {
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .m-10 {
        margin: 1.5rem;
    }
}
</style>