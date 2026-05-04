<script setup>
import {onMounted, ref } from 'vue';
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
import NewUsersChart from '../admincomponents/NewUsersChart.vue';
import User from '../admincomponents/User.vue';
import UserCard from '../admincomponents/UserCard.vue';
import { adminState } from '../adminstate/state';


const adminStore = adminState();
const usersArray = ref([]);

onMounted(async() => {
    await adminStore.getUsersFromArray();
    usersArray.value = adminStore.getUsers();
})


</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            <div>
                <h3 class="text-4xl font-bold m-10">
                    Ügyfelek
                </h3>
            </div>
            <div class="grid grid-cols-12 gap-6">

                <div class="col-span-12 lg:col-span-6 p-4">
                    <div class="bg-white rounded-xl p-6  h-full flex flex-col border-2 border-[#051826] shadow-[6px_6px_0px_#051826]">
                        <NewUsersChart chartHeight="500" />
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 p-4 ">
                    <div class="bg-white rounded-xl p-6 h-full flex flex-col border-2 border-[#051826] shadow-[6px_6px_0px_#051826] ">

                        <div
                            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6 place-items-center flex-grow justify-between">

                            <div class="w-full">
                                <User id="10" title="Legaktívabb ügyfél" userImage="../assets/usericon.png" userName="zacipaci1"
                                    joinedDate="2026.03.08." />
                            </div>

                            <div class="w-full">
                                <User id="11" title="Legmegbízhatóbb ügyfél" userImage="../assets/usericon.png"
                                    userName="zacipacifelh5" joinedDate="2026.03.08." />
                            </div>

                            <div class="w-full">
                                <User id="12" title="Megbízhatósági Ranglista #1" userImage="../assets/usericon.png"
                                    userName="zacipacifelh2" joinedDate="2026.03.08." />
                            </div>

                            <div class="w-full">
                                <User id="13" title="Legújabb ügyfél" userImage="../assets/usericon.png"
                                    userName="zacipacifelh2" joinedDate="2026.03.08." />
                            </div>

                        </div>

                    </div>
                </div>

            </div>
            <div class="col-span-12 mt-12">

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" >
                    <div v-for="users in usersArray">
                        <UserCard :id="users.getId()" :userName="users.getName()" userImage="../assets/usericon.png" :joinedDate="users.getRegisterDate()"
                        :contracts="12" :email="users.getEmail()" :phone="users.getPhone()" />
                    </div>
                   
                </div>

            </div>
        </div>
    </div>

</template>


<style scope></style>