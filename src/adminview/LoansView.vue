<script setup>
import AdminHeader from '../admincomponents/AdminHeader.vue';
import AdminMenu from '../admincomponents/AdminMenu.vue';
</script>

<template>
    <div class="grid grid-cols-6 min-h-screen">
        <AdminMenu />
        <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
            <AdminHeader />
            <h3 class="text-4xl font-bold m-10">
                Hitelek
            </h3>
        </div>
    </div>
</template>

<style scoped>

</style>