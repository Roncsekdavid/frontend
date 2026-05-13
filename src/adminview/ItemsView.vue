<script setup>
import { onMounted, ref, computed } from 'vue'
import { adminState } from '../adminstate/state'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import DoughChart from '../admincomponents/DoughChart.vue'
import ItemBarChart from '../admincomponents/ItemBarChart.vue'
import ItemCard from '../admincomponents/ItemCard.vue'
import ItemModal from '../admincomponents/ItemModal.vue'
import api from "../services/api";

const modalOpen = ref(false)
const modalItem = ref({})
const isLoading = ref(true);

const openModal = async (item) => {
    const { data: user } = await api.get(`/users/${item.getUserId()}`)

    modalItem.value = {
        itemImage: item.getPrimaryImage(),
        itemName: item.getName(),
        itemDesc: item.getDescription(),
        itemDate: item.getUploadDate(),
        itemPrice: item.getEstimatedValue(),
        itemCategory: item.getCategory(),
        uploaderName: user.name,
        uploaderId: user.id
    }

    modalOpen.value = true
}

const closeModal = () => {
    modalOpen.value = false
}

const adminStore = adminState()
const selectedCategory = ref("Mind")
const itemArray = ref([])

onMounted(async () => {
    isLoading.value = true;
    try {
        await adminStore.getApprovedItemsFromApi()
        itemArray.value = adminStore.getApprovedItems()
    } catch (error) {
        console.error("Hiba a tárgyak betöltésekor:", error);
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 600);
    }
})

const filteredItemsArray = computed(() => {
    if (selectedCategory.value === "Mind") return []
    return itemArray.value.filter(item => item.getCategory() === selectedCategory.value)
})

const groupItems = computed(() => {
    const groups = {}
    for (const item of itemArray.value) {
        const category = item.getCategory()
        if (!groups[category]) groups[category] = []
        groups[category].push(item)
    }
    return groups
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
                    Tárgyak betöltése...
                </h2>
            </div>

            <main v-else class="animate__animated animate__fadeIn">
                <h3 class="text-4xl font-bold m-10">Tárgyak</h3>

                <div class="grid grid-cols-12 gap-3">
                    <div class="hidden md:block md:col-span-12 xl:col-span-6 bg-white rounded-xl border-2 border-[#051826] shadow-[6px_6px_0px_#051826] p-5">
                        <DoughChart chartHeight="400" />
                    </div>
                    <div class="hidden md:block md:col-span-12 xl:col-span-6 bg-white rounded-xl border-2 border-[#051826] shadow-[6px_6px_0px_#051826] p-5">
                        <ItemBarChart chartHeight="400" />
                    </div>
                </div>

                <div>
                    <form class="max-w-sm mx-auto mt-10">
                        <label class="block mb-2 text-sm font-semibold text-gray-700">Kategóriák</label>

                        <div class="relative">
                            <select
                                id="categories"
                                v-model="selectedCategory"
                                class="block w-full appearance-none px-4 py-3 bg-white border border-gray-300 text-gray-800 text-sm rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                            >
                                <option value="Mind">Mind</option>
                                <option value="Ékszer & Arany">Ékszer & Arany</option>
                                <option value="Órák">Órák</option>
                                <option value="Műtárgyak">Műtárgyak</option>
                                <option value="Elektronika">Elektronika</option>
                                <option value="Háztartási gépek">Háztartási gépek</option>
                                <option value="Hétköznapi cikkek">Hétköznapi cikkek</option>
                                <option value="Hangszerek">Hangszerek</option>
                                <option value="Jármű">Jármű</option>
                                <option value="Szerszámgépek">Szerszámgépek</option>
                                <option value="Játékkonzolok">Játékkonzolok</option>
                                <option value="Bútorok">Bútorok</option>
                                <option value="Sporteszközök">Sporteszközök</option>
                            </select>

                            <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▼</span>
                        </div>
                    </form>
                </div>

                <div v-if="selectedCategory !== 'Mind' && filteredItemsArray.length === 0" class="text-center mt-20 pt-20 pb-20">
                    <h2 class="text-5xl font-extrabold text-gray-700">Nincs találat</h2>
                    <p class="text-gray-500 text-lg mt-4">Nincs elérhető tárgy jelenleg ebben a kategóriában.</p>
                </div>

                <div v-else-if="filteredItemsArray.length > 0">
                    <div class="mt-16 mb-10 text-center">
                        <h3 class="text-4xl font-bold text-gray-800 pb-3 border-b inline-block">{{ selectedCategory }}</h3>
                    </div>

                    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
                        <div v-for="item in filteredItemsArray" :key="item.getId()" class="flex justify-center">
                            <ItemCard
                                :itemImage="item.getPrimaryImage()"
                                :itemName="item.getName()"
                                :itemDesc="item.getDescription()"
                                :itemDate="item.getUploadDate()"
                                :itemPrice="item.getEstimatedValue().toLocaleString() + ' Ft'"
                                :itemCategory="item.getCategory()"
                                @open="openModal(item)"
                            />
                        </div>
                    </section>
                </div>

                <div v-else>
                    <div v-for="(items, category) in groupItems" :key="category" class="mt-20">
                        <div class="text-center mb-10">
                            <h3 class="text-4xl font-bold text-gray-800 pb-3 border-b inline-block">{{ category }}</h3>
                        </div>

                        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                            <div v-for="item in items" :key="item.getId()" class="flex justify-center">
                                <ItemCard
                                    :itemImage="item.getPrimaryImage()"
                                    :itemName="item.getName()"
                                    :itemDesc="item.getDescription()"
                                    :itemDate="item.getUploadDate()"
                                    :itemPrice="item.getEstimatedValue().toLocaleString() + ' Ft'"
                                    :itemCategory="item.getCategory()"
                                    @open="openModal(item)"
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <ItemModal
        v-if="modalOpen"
        :open="modalOpen"
        :itemImage="modalItem.itemImage"
        :itemName="modalItem.itemName"
        :itemDesc="modalItem.itemDesc"
        :itemDate="modalItem.itemDate"
        :itemPrice="modalItem.itemPrice"
        :itemCategory="modalItem.itemCategory"
        :contractDuration="'12 hónap'"
        :uploaderName="modalItem.uploaderName"
        :uploaderId="modalItem.uploaderId"
        @close="closeModal"
    />
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