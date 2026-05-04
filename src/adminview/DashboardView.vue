<script setup>
import AdminMenu from '../admincomponents/AdminMenu.vue';
import Card from '../admincomponents/Card.vue';
import User from '../admincomponents/User.vue';
import DoughChart from '../admincomponents/DoughChart.vue';
import LineChart from '../admincomponents/lineChart.vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import BarChart from '../admincomponents/BarChart.vue';
import ItemCard from '../admincomponents/ItemCard.vue';
import ItemModal from '../admincomponents/ItemModal.vue';
import { computed, onMounted, ref, watch } from 'vue';
import NewUsersChart from '../admincomponents/NewUsersChart.vue';
import { adminState } from '../adminstate/state';

const modalOpen = ref(false)
const modalItem = ref({})

const adminStore = adminState();

const approvedCount = computed(() => adminStore.getApprovedLength());
const expensiveCount = computed(() => adminStore.getMostExpensiveValue());
const userCount = computed(() => adminStore.getUsersLength());

const isLoading = ref(false);

onMounted(async () => {
    await adminStore.getSubmittedItemsFromApi()
    await adminStore.getApprovedItemsFromApi()
    await adminStore.getUsersFromArray();
})


const openModal = (item) => {
    modalItem.value = {
        itemImage: item.image,
        itemName: item.name,
        itemDate: item.date,
        itemPrice: item.price,
        itemCategory: item.id,
        uploaderName: item.uploaderName,
        uploaderId: item.uploaderId
    }
    modalOpen.value = true
}



const expensiveItems = ref([
    {
        id: "Ékszer & Arany (Top 1 legdrágább tárgy)",
        image: "../assets/rolex.png",
        name: "Arany nyaklánc",
        uploaderName: "zacipaci1",
        uploaderId: 10,
        date: "2026.03.08.",
        price: "700.000 Ft"
    },
    {
        id: "Ékszer & Arany (Top 2 legdrágább tárgy)",
        image: "../assets/rolex.png",
        name: "Rolex Submariner",
        uploaderName: "zacipacifelh5",
        uploaderId: 11,
        date: "2026.03.08.",
        price: "550.000 Ft"
    },
    {
        id: "Ékszer & Arany (Top 3 legdrágább tárgy)",
        image: "../assets/rolex.png",
        name: "iPhone 15 Pro Max",
        uploaderName: "zacipacifelh2",
        uploaderId: 12,
        date: "2026.03.08.",
        price: "480.000 Ft"
    },
    {
        id: "Jármű (Top 4 legdrágább tárgy)",
        image: "../assets/volkswagen-golf-vii.png",
        name: "PS5 Slim",
        uploaderName: "zacipacifelh2",
        uploaderId: 13,
        date: "2026.03.08.",
        price: "450.000 Ft"
    }
])



</script>


<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            <main>
                <section class="grid grid-cols-12 gap-4">
                    <div
                        class="col-span-12 md:col-span-6 lg:col-span-4 mt-8 p-6 rounded-2xl royal-blue text-white  drop-shadow-lg animate__animated animate__fadeInDown transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold">{{ expensiveCount }} - Ft.</h2>
                        <p class="mt-2 pb-5 border-b-2">Legnagyobb bevétel</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>
                    <div
                        class="col-span-12 md:col-span-6 lg:col-span-4 mt-8 p-6 rounded-2xl deep-navy text-white starfall drop-shadow-lg animate__animated animate__fadeInDown transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold">{{ userCount }}</h2>
                        <p class="mt-2 pb-5 border-b-2">Aktív felhasználó</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>
                    <div
                        class="col-span-12 md:col-span-12 lg:col-span-4 mt-8 p-6 rounded-2xl sapphire-blue text-white sincity-red drop-shadow-lg animate__animated animate__fadeInDown transition duration-150 ease-in-out hover:scale-105 cursor-pointer shadow-xl/10">
                        <h2 class="text-3xl font-bold">{{ approvedCount }}</h2>
                        <p class="mt-2 pb-5 border-b-2">Felvitt, és szerződés alatt álló tárgy</p>
                        <p class="text-sm mt-1">utoljára frissítve: 15:00</p>
                    </div>
                </section>


                <section class="grid grid-cols-12 gap-4 mt-5">
                    <div class="col-span-12 lg:col-span-9 bg-white rounded-xl p-4 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                        <LineChart chartHeight="400" />
                    </div>
                    <div class="col-span-12 lg:col-span-3 grid gap-4" v-for="item in adminStore.getMostExpensiveItem()">
                        <Card itemTitle="Legdrágább szerződés" :itemImage=item.getPrimaryImage()
                            :itemName=item.getName() :itemDesc=item.getDescription() :itemDate=item.getUploadDate()
                            :itemPrice=item.getEstimatedValue() />
                    </div>
                </section>

                <section class="grid grid-cols-12 gap-4 mt-10">
                    <div class="col-span-12 md:col-span-6 xl:col-span-3" v-for="item in adminStore.getLatestOffer()"
                        v-if="adminStore.getLatestOffer().length > 0">
                        <Card itemTitle="Legújabb ajánlat" :itemImage=item.getPrimaryImage() :itemName=item.getName()
                            :itemDesc=item.getDescription() :itemDate=item.getUploadDate()
                            :itemPrice=item.getEstimatedValue() />
                    </div>
                    <div v-else
                        class="col-span-12 md:col-span-6 xl:col-span-3 bg-white rounded-xl p-4 shadow-md text-center pt-30">
                        <p class="text-5xl mb-5"><i class="bi bi-ban"></i></p>
                        <h3 class="text-2xl font-bold align-middle ">Jelenleg nincs új ajánlat.</h3>
                        <p class="text-stone-500">Rendszerünk jelenleg nem talált függésben lévő ajánlatot.</p>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-5 bg-white rounded-xl p-4 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                        <DoughChart chartHeight="400" />
                    </div>
                    <div class="col-span-12 xl:col-span-4 bg-white rounded-xl p-4 border-[#051826] border-2 shadow-[6px_6px_0px_#051826]">
                        <BarChart chartHeight="400" />
                    </div>
                </section>

                <section class="grid grid-cols-12 gap-6 mt-12">

                    <div class="col-span-12 lg:col-span-6 bg-white rounded-xl p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]" style="min-height: 500px;">
                        <h3 class="text-3xl mb-6">Ügyfelek</h3>

                        <div
                            class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
                            <div class="w-full">
                                <User id="10" title="Legaktívabb ügyfél" userImage="../assets/usericon.png"
                                    userName="zacipaci1" joinedDate="2026.03.08." />
                            </div>

                            <div class="w-full">
                                <User id="11" title="Legmegbízhatóbb ügyfél" userImage="../assets/usericon.png"
                                    userName="zacipacifelh5" joinedDate="2026.03.08." />
                            </div>

                            <div class="w-full mt-20">
                                <User id="12" title="Megbízhatósági Ranglista #1" userImage="../assets/usericon.png"
                                    userName="zacipacifelh2" joinedDate="2026.03.08." />
                            </div>
                            <div class="w-full mt-20">
                                <User id="13" title="Legújabb ügyfél" userImage="../assets/usericon.png"
                                    userName="zacipacifelh2" joinedDate="2026.03.08." />
                            </div>
                        </div>
                        <div class="mt-5">
                            <NewUsersChart chartHeight="300" />
                        </div>


                    </div>


                    <div class="col-span-12 lg:col-span-6 bg-white rounded-xl p-6 border-2 border-[#051826] shadow-[6px_6px_0px_#051826]" style="min-height: 500px;">
                        <h3 class="text-3xl mb-6">Legdrágább tárgyak</h3>

                        <div class="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6 place-items-center">
                            <div v-for="item in expensiveItems" :key="item.name">
                                <ItemCard :itemImage="item.image" :itemName="item.name" :itemUploader="item.uploader"
                                    :itemDate="item.date" :itemPrice="item.price" @open="openModal(item)" />
                            </div>
                        </div>
                    </div>

                </section>



            </main>
        </div>
    </div>
    <ItemModal :open="modalOpen" :itemImage="modalItem.itemImage" :itemName="modalItem.itemName"
        :itemDate="modalItem.itemDate" :itemPrice="modalItem.itemPrice" :itemCategory="modalItem.itemCategory"
        :uploaderName="modalItem.uploaderName" :uploaderId="modalItem.uploaderId" :contractDuration="'12 hónap'"
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
    border-bottom: 1px solid #8d8b8b
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
