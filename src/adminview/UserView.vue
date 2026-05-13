<script setup>
import { computed, onMounted, ref } from 'vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
import NewUsersChart from '../admincomponents/NewUsersChart.vue';
import User from '../admincomponents/User.vue';
import UserCard from '../admincomponents/UserCard.vue';
import { adminState } from '../adminstate/state';

const adminStore = adminState();
const isLoading = ref(true);

const usersArray = computed(() => adminStore.getUsers());
const mostActive = computed(() => adminStore.getMostActiveUser());
const newestAccount = computed(() => adminStore.getNewestAccount());
const oldestAccount = computed(() => adminStore.getOldestAccount());
const mostExpensiveOffer = computed(() => adminStore.getMostExpensiveOffer());

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            adminStore.getUsersFromApi(),
            adminStore.getMostActiveUserFromApi(),
            adminStore.getNewestAccountFromApi(),
            adminStore.getOldestAccountFromApi(),
            adminStore.getMostExpensiveOfferFromApi(),
        ]);
    } catch (error) {
        console.error("Hiba történt az adatok lekérésekor:", error);
    } finally {
        setTimeout(() => {
            isLoading.value = false;
        }, 600);
    }
});
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            
            <div v-if="isLoading" class="flex flex-col items-center justify-center h-[75vh]">
                <div class="w-20 h-20 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-6"></div>
                <h2 class="text-2xl font-black text-[#051826] animate-pulse uppercase tracking-widest">
                    Ügyféladatok betöltése...
                </h2>
            </div>

            <main v-else class="animate__animated animate__fadeIn">
                <div>
                    <h3 class="text-4xl font-bold m-10">Ügyfelek</h3>
                </div>
                
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-6 p-4">
                        <div class="bg-white rounded-xl p-6 h-full flex flex-col border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                            <NewUsersChart chartHeight="500" />
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-6 p-4">
                        <div class="bg-white rounded-xl p-6 h-full flex flex-col border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6 place-items-center flex-grow justify-between">
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
                        </div>
                    </div>
                </div>

                <div class="col-span-12 mt-12">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div v-for="user in usersArray" :key="user.getId()">
                            <UserCard :id="user.getId()" :userName="user.getName()" :userImage="user.getAvatarUrl()" 
                                :joinedDate="user.getRegisterDate()" :email="user.getEmail()" :phone="user.getPhone()" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>