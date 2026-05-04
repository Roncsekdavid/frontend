<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from '../admincomponents/ItemCard.vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import { adminState } from '../adminstate/state'
const route = useRoute()

const user = ref([])
const items = ref([])

const adminStore = adminState();

onMounted( async () => {
    const id = route.params.id;
    await adminStore.getUserById(id);
    items.value = await adminStore.getItemsByUserId(id);
    user.value = adminStore.getUsers();
})

</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            <div class="p-10">

                <div class="flex items-center gap-8 bg-white p-8 rounded-3xl shadow-lg">
                    <img :src="user.userImage" class="w-32 h-32 rounded-full object-cover shadow-md" />

                    <div v-for="user in user">
                        <h1 class="text-4xl font-bold">{{ user.getName() }}</h1>
                        <p class="text-gray-600 mt-2">Csatlakozott: {{ user.getRegisterDate() }}</p>
                        <p class="text-gray-600">Email Cím: {{ user.getEmail() }}</p>
                        <p class="text-gray-600">Telefonszám: {{ user.getPhone() }}</p>
                    </div>
                </div>

                <h2 class="text-3xl font-bold mt-12 mb-6">Felhasználó tárgyai</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ItemCard v-for="item in items" :key="item.name" :itemImage="item.image" :itemName="item.name"
                        :itemUploader="item.uploader" :itemDate="item.date" :itemPrice="item.price" />
                </div>

            </div>
        </div>
    </div>
</template>
