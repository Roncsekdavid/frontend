<script setup>
import { ref } from 'vue';


const isMenuOpened = ref(false)

const toggleMobileMenu = () => {
    isMenuOpened.value = !isMenuOpened.value
}


</script>


<template>
    <aside
        class="w-full md:col-span-2 lg:col-span-1 p-6 grid grid-cols-1 hidden md:block place-items-center sticky top-0 h-screen">
        <div class="place-items-center">
            <router-link to="/"> <img src="../assets/zacipaci-logo.png" alt="ZaciPaci Logo"
                    class="w-[150px] h-[120px] animate__animated animate__fadeInDown">
            </router-link>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin">Dashboard</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                        to="/admin/items">Tárgyak</router-link></p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/readoffer">Beolvasás</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/users">Ügyfelek</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/newitems">Új Tárgyak</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/loans">Hitelek</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/sales">Eladások</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
            <div
                class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group">
                <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link to="/admin/news">Hírek</router-link>
                </p>
                <span
                    class="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-400 transition-all duration-300 group-hover:w-full">
                </span>
            </div>
        </div>

    </aside>
    <div class="md:hidden p-4  animate__animated animate__fadeInDown">
        <button @click="toggleMobileMenu" id="menuButton"
            class="text-white text-2xl px-4 py-2 rounded bg-indigo-600 cursor-pointer"><i
                class="bi bi-list"></i></button>
    </div>

    <transition name="slide" enter-active-class="animate__animated animate__fadeInLeft"
        leave-active-class="animate__animated animate__fadeOutLeft">
        <aside v-if="isMenuOpened" class="fixed top-0 left-0  w-3/4 h-full z-50 p-6 bg-[#051826] md:hidden shadow-xl">
            <button @click="toggleMobileMenu" class="text-white text-3xl absolute top-4 right-4 cursor-pointer">
                <i class="bi bi-x-lg"></i>
            </button>

            <div class="mt-16 text-center">
                <img src="../assets/zacipaci-logo.png" class="w-[150px] h-[120px] mx-auto">
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin">Dashboard</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/items">Tárgyak</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/readoffer">Beolvasás</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/users">Ügyfelek</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/newitems">Új Tárgyak</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/loans">Hitelek</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/sales">Eladások</router-link></p>
                </div>
                <div
                    class="menu-item text-center text-white text-2xl mt-10 animate__animated animate__fadeInDown relative cursor-pointer group w-full">
                    <p class="border-[#F7F8F0] pb-1 hover:color-green-400"><router-link
                            to="/admin/news">Hírek</router-link></p>
                </div>
                
            </div>
        </aside>
    </transition>

</template>


<style scoped>
.menu {
    text-align: center;
    color: #fff;
    font-size: 25px;
}


aside {
    background: #051826;
    background: linear-gradient(210deg, rgb(26 77 143) 0%, rgb(10 26 47) 100%);
}
</style>
