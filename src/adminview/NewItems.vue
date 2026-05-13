<script setup>
import { onMounted, ref } from 'vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
import Card from '../admincomponents/Card.vue';
import { adminState } from '../adminstate/state';
import router from '../router';

const adminStore = adminState();
const submittedItems = ref([]);
const isLoading = ref(true);

const goToItemPage =(id)=>{
    router.push(`/admin/items/${id}`)
}

onMounted( async () => {
    isLoading.value = true;
    try {
        await adminStore.getSubmittedItemsFromApi();
        submittedItems.value = adminStore.getSubmittedItems();
    } catch (error) {
        console.error("Hiba az adatok betöltésekor:", error);
    } finally {
        setTimeout(() => {
            isLoading.value = false
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
                    Új ajánlatok betöltése...
                </h2>
            </div>

            <main v-else class="animate__animated animate__fadeIn">
                <h3 class="text-4xl font-bold m-10">Új tárgyak</h3>
                <section class="grid grid-cols-12 gap-6 mt-10 p-4">
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 cursor-pointer transition-transform duration-200 hover:scale-105" 
                         @click="goToItemPage(item.getId())" 
                         v-for="item in submittedItems" :key="item.getId()">
                        <Card 
                            itemTitle="Új ajánlat" 
                            :itemImage="item.getPrimaryImage()"
                            :itemName="item.getName()"
                            :itemDesc="item.getDescription()" 
                            :itemDate="item.getUploadDate()" 
                            :itemPrice="item.getEstimatedValue()"
                            theme="alive" 
                        />
                    </div>
                    
                    <div v-if="submittedItems.length === 0" class="col-span-12 text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-200">
                        <i class="bi bi-box-seam text-6xl text-gray-200 mb-4 block"></i>
                        <p class="text-xl font-bold text-gray-400 uppercase tracking-widest">Nincsenek elbírálásra váró tárgyak</p>
                    </div>
                </section>
            </main>
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