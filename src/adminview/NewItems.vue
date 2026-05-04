<script setup>
import { onMounted, ref } from 'vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
import Card from '../admincomponents/Card.vue';
import { adminState } from '../adminstate/state';
import router from '../router';

const adminStore = adminState();
const submittedItems = ref([]);

const goToItemPage =(id)=>{
    router.push(`/admin/items/${id}`)
}

onMounted( async () => {
    await adminStore.getSubmittedItemsFromApi();
    submittedItems.value = adminStore.getSubmittedItems();
    console.log(submittedItems.value);
    
})
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            <h3 class="text-4xl font-bold m-10">
                Új tárgyak
            </h3>
            <section class="grid grid-cols-12 gap-4 mt-10">
                    <div class="col-span-12 md:col-span-6 xl:col-span-3" @click="goToItemPage(item.getId())" v-for="item in adminStore.getSubmittedItems()">
                        <Card itemTitle="Új ajánlat" :itemImage="item.getPrimaryImage()"
                            :itemName="item.getName()"
                            :itemDesc="item.getDescription()" :itemDate="item.getUploadDate()" :itemPrice="item.getEstimatedValue()"
                            theme="alive" />
                    </div>
                </section>
        </div>

    </div>
</template>

<style scoped></style>