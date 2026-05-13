<script setup>
import AdminMenu from '../admincomponents/AdminMenu.vue';
import Card from '../admincomponents/Card.vue';
import User from '../admincomponents/User.vue';
import DoughChart from '../admincomponents/DoughChart.vue';
import LineChart from '../admincomponents/LineChart.vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import BarChart from '../admincomponents/BarChart.vue';
import ItemCard from '../admincomponents/ItemCard.vue';
import ItemModal from '../admincomponents/ItemModal.vue';
import { computed, onMounted, ref } from 'vue';
import NewUsersChart from '../admincomponents/NewUsersChart.vue';
import { adminState } from '../adminstate/state';
import { useRouter } from 'vue-router';

const modalOpen = ref(false)
const modalItem = ref({})
const isLoading = ref(true);

const adminStore = adminState();

const approvedCount = computed(() => adminStore.getApprovedLength());
const expensiveCount = computed(() => adminStore.getMostExpensiveValue());
const userCount = computed(() => adminStore.getUsersLength());

const mostActive = computed(() => adminStore.getMostActiveUser());
const newestAccount = computed(() => adminStore.getNewestAccount());
const oldestAccount = computed(() => adminStore.getOldestAccount());
const mostExpensiveOffer = computed(() => adminStore.getMostExpensiveOffer());

const topExpensiveItems = computed(() => adminStore.getTopExpensiveItems());

const router = useRouter();

const goToItem = (item) => {
    router.push({ name: 'ItemView', params: { id: item.getId() } });
};

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            adminStore.getUsersFromApi(),
            adminStore.getSubmittedItemsFromApi(),
            adminStore.getApprovedItemsFromApi(),
            adminStore.getMostActiveUserFromApi(),
            adminStore.getNewestAccountFromApi(),
            adminStore.getOldestAccountFromApi(),
            adminStore.getMostExpensiveOfferFromApi(),
            adminStore.getTopExpensiveItemsFromApi(),
        ]);
    } catch (error) {
        console.error("Hiba történt az adatok lekérésekor:", error);
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 600);
    }
});


const openModal = (item) => {
    modalItem.value = {
        itemImage: item.getPrimaryImage(),
        itemName: item.getName(),
        itemDesc: item.getDescription(), 
        itemDate: item.getUploadDate(),
        itemPrice: item.getEstimatedValue(),
        itemCategory: item.getCategory(),
        uploaderName: "Admin",
        uploaderId: item.getUserId()
    }
    modalOpen.value = true
}

</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />

            <div v-if="isLoading" class="flex flex-col items-center justify-center h-[75vh]">
                <div class="w-20 h-20 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-6"></div>
                <h2 class="text-2xl font-black text-[#051826] animate-pulse uppercase tracking-widest">Rendszeradatok
                    betöltése...</h2>
            </div>

            <main v-else class="animate__animated animate__fadeIn">
                <section class="grid grid-cols-12 gap-4">
                    <div
                        class="col-span-12 md:col-span-6 lg:col-span-4 mt-8 p-6 rounded-2xl royal-blue text-white drop-shadow-lg transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold"><i class="bi bi-cash-stack mr-2"></i>{{ expensiveCount }} Ft</h2>
                        <p class="mt-2 pb-5 border-b-2">Legnagyobb bevétel</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>

                    <div
                        class="col-span-12 md:col-span-6 lg:col-span-4 mt-8 p-6 rounded-2xl deep-navy text-white starfall drop-shadow-lg transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold"><i class="bi bi-people-fill mr-2"></i>{{ userCount }}</h2>
                        <p class="mt-2 pb-5 border-b-2">Aktív felhasználó</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>

                    <div
                        class="col-span-12 md:col-span-12 lg:col-span-4 mt-8 p-6 rounded-2xl sapphire-blue text-white sincity-red drop-shadow-lg transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold"><i class="bi bi-file-earmark-check mr-2"></i>{{ approvedCount }}
                        </h2>
                        <p class="mt-2 pb-5 border-b-2">Szerződés alatt álló tárgyak</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>
                </section>

                <section class="grid grid-cols-12 gap-4 mt-5">
                    <div
                        class="col-span-12 lg:col-span-9 bg-white rounded-xl p-4 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                        <LineChart chartHeight="400" />
                    </div>
                    <div class="col-span-12 lg:col-span-3 grid gap-4" v-for="item in adminStore.getMostExpensiveItem()"
                        v-if="adminStore.getMostExpensiveItem().length > 0">
                        <Card itemTitle="Legdrágább szerződés" :itemImage="item.getPrimaryImage()"
                            :itemName="item.getName()" :itemDesc="item.getDescription()"
                            :itemDate="item.getUploadDate()" :itemPrice="item.getEstimatedValue()"
                            @click="goToItem(item)" />
                    </div>
                    <div v-else class="col-span-12 lg:col-span-3 bg-white rounded-xl p-4 shadow-md text-center pt-20">
                        <p class="text-5xl mb-5 text-gray-300"><i class="bi bi-ban"></i></p>
                        <h3 class="text-2xl font-bold">Nincs aktív ajánlat.</h3>
                        <p class="text-stone-500 text-sm px-4">Rendszerünk jelenleg nem talált legdrágább ajánlatot.</p>
                    </div>
                </section>

                <section class="grid grid-cols-12 gap-4 mt-10">
                    <div class="col-span-12 md:col-span-6 xl:col-span-3" v-for="item in adminStore.getLatestOffer()"
                        v-if="adminStore.getLatestOffer().length > 0">
                        <Card itemTitle="Legújabb ajánlat" :itemImage="item.getPrimaryImage()"
                            :itemName="item.getName()" :itemDesc="item.getDescription()"
                            :itemDate="item.getUploadDate()" :itemPrice="item.getEstimatedValue()"
                            @click="goToItem(item)" />
                    </div>
                    <div v-else
                        class="col-span-12 md:col-span-6 xl:col-span-3 bg-white rounded-xl p-4 shadow-md text-center pt-20">
                        <p class="text-5xl mb-5 text-gray-300"><i class="bi bi-ban"></i></p>
                        <h3 class="text-2xl font-bold">Nincs új ajánlat.</h3>
                    </div>

                    <div
                        class="col-span-12 md:col-span-6 xl:col-span-5 bg-white rounded-xl p-4 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                        <DoughChart chartHeight="400" />
                    </div>
                    <div
                        class="col-span-12 xl:col-span-4 bg-white rounded-xl p-4 border-[#051826] border-2 shadow-[6px_6px_0px_#051826]">
                        <BarChart chartHeight="400" />
                    </div>
                </section>

                <section class="grid grid-cols-12 gap-6 mt-12">
                    <div class="col-span-12 lg:col-span-6 bg-white rounded-xl p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]"
                        style="min-height: 500px;">
                        <h3 class="text-3xl mb-6 font-bold">Ügyfelek</h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
                            <div class="w-full" v-for="user in mostActive" :key="'active-' + user.getId()">
                                <User :id="user.getId()" title="Legaktívabb ügyfél" :userImage="user.getAvatarUrl()"
                                    :userName="user.getName()" :joinedDate="user.getRegisterDate()" />
                            </div>
                            <div class="w-full" v-for="user in newestAccount" :key="'new-' + user.getId()">
                                <User :id="user.getId()" title="Legújabb ügyfél" :userImage="user.getAvatarUrl()"
                                    :userName="user.getName()" :joinedDate="user.getRegisterDate()" />
                            </div>
                            <div class="w-full" v-for="user in oldestAccount" :key="'old-' + user.getId()">
                                <User :id="user.getId()" title="Legrégebbi ügyfél" :userImage="user.getAvatarUrl()"
                                    :userName="user.getName()" :joinedDate="user.getRegisterDate()" />
                            </div>
                            <div class="w-full" v-for="user in mostExpensiveOffer" :key="'exp-' + user.getId()">
                                <User :id="user.getId()" title="Legdrágább ajánlat" :userImage="user.getAvatarUrl()"
                                    :userName="user.getName()" :joinedDate="user.getRegisterDate()" />
                            </div>
                        </div>
                        <div class="mt-10">
                            <NewUsersChart :key="userCount" chartHeight="300" />
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-6 bg-white rounded-xl p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]"
                        style="min-height: 500px;">
                        <h3 class="text-3xl mb-6 font-bold">Legdrágább tárgyak</h3>
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
                            <div v-for="item in topExpensiveItems" :key="item.getId()" class="w-full">
                                <ItemCard :itemImage="item.getPrimaryImage()" :itemName="item.getName()"
                                    :itemDesc="item.getDescription()" :itemUploader="item.getCategory()"
                                    :itemDate="item.getUploadDate()"
                                    :itemPrice="item.getEstimatedValue().toLocaleString() + ' Ft'"
                                    @open="openModal(item)" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>

    <ItemModal v-if="modalOpen" :open="modalOpen" :itemImage="modalItem.itemImage" :itemName="modalItem.itemName"
        :itemDesc="modalItem.itemDesc" :itemDate="modalItem.itemDate" :itemPrice="modalItem.itemPrice"
        :itemCategory="modalItem.itemCategory" :uploaderName="modalItem.uploaderName" :uploaderId="modalItem.uploaderId"
        @close="modalOpen = false" />
</template>

<style scoped>
header span {
    color: #797a7a;
}

header i {
    font-size: 50px;
}

.adminlogo {
    width: 150px;
    height: 120px;
}

header {
    margin: 0px 20px;
    border-bottom: 1px solid #8d8b8b;
}

header h1 {
    line-height: 75px;
}

header p {
    line-height: 75px;
    margin-left: 10px;
}

.panel-card {
    width: 250px;
    padding: 20px;
    border-radius: 20px;
    color: #fff;
}

.user-div {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>