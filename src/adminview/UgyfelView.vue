<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from '../admincomponents/ItemCard.vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import { adminState } from '../adminstate/state'
import LoanItemModal from '../admincomponents/LoanItemModal.vue'

const modalOpen = ref(false)
const selectedItem = ref({})
const isLoading = ref(true);

const openItemLoanModal = (item) => {
    selectedItem.value = {
        itemId: item.id || item.getId?.(),
        image: item.image,
        name: item.name,
        date: item.date,
        price: item.price,
        category: item.category || 'Zálogtárgy',
        desc: item.description || 'Nincs leírás.'
    }
    modalOpen.value = true
}

const route = useRoute()
const user = ref([])
const items = ref([])
const adminStore = adminState();

onMounted(async () => {
    isLoading.value = true;
    try {
        const id = route.params.id
        await Promise.all([
            adminStore.getUserById(id),
            adminStore.getOffersFromApi(),
            adminStore.getLoansFromApi()
        ])
        
        items.value = await adminStore.getItemsByUserId(id);
        user.value = adminStore.getUsers();
    } catch (error) {
        console.error("Hiba történt a felhasználói adatok lekérésekor:", error)
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 600);
    }
})
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />

            <div v-if="isLoading" class="flex flex-col items-center justify-center h-[75vh]">
                <div class="w-20 h-20 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-6"></div>
                <h2 class="text-2xl font-black text-[#051826] animate-pulse uppercase tracking-widest">
                    Felhasználói adatok betöltése...
                </h2>
            </div>

            <div v-else class="p-10 animate__animated animate__fadeIn">
                <div class="flex items-center gap-8 bg-white p-8 rounded-3xl shadow-lg" v-for="u in user" :key="u.getId()">
                    <div class="w-32 h-32 rounded-full shadow-md flex items-center justify-center bg-white border-4 border-[#0bb5ff] relative">
                        <img v-if="u.getAvatarUrl()" :src="u.getAvatarUrl()" class="w-full h-full object-cover rounded-full" />
                        <span v-else class="text-5xl font-black text-[#051826]">{{ u.getName().charAt(0).toUpperCase() }}</span>
                    </div>

                    <div>
                        <h1 class="text-4xl font-bold">{{ u.getName() }}</h1>
                        <p class="text-gray-600 mt-2">Csatlakozott: {{ u.getRegisterDate() }}</p>
                        <p class="text-gray-600">Email Cím: {{ u.getEmail() }}</p>
                        <p class="text-gray-600">Telefonszám: {{ u.getPhone() }}</p>
                    </div>
                </div>

                <h2 class="text-3xl font-bold mt-12 mb-6">Felhasználó tárgyai</h2>

                <div v-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ItemCard v-for="item in items" :key="item.name" :itemImage="item.image" :itemName="item.name"
                        :itemUploader="item.uploader" :itemDate="item.date" :itemPrice="item.price" @click="openItemLoanModal(item)" />
                </div>
                
                <div v-else class="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-200">
                    <i class="bi bi-box-seam text-6xl text-gray-200 mb-4 block"></i>
                    <p class="text-xl font-bold text-gray-400 uppercase tracking-widest">Nincsenek feltöltött tárgyak</p>
                </div>

                <LoanItemModal 
                    :open="modalOpen"
                    :itemId="selectedItem.itemId"
                    :itemImage="selectedItem.image"
                    :itemName="selectedItem.name"
                    :itemDesc="selectedItem.desc"
                    :itemDate="selectedItem.date"
                    :itemPrice="selectedItem.price"
                    :itemCategory="selectedItem.category"
                    @close="modalOpen = false"
                />
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
</style>