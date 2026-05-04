<script setup>
</script>

<template>
    <footer class="bg-[#2C2C2C] text-white pt-12 pb-6 px-6 mt-auto">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 text-center md:text-left">
                <div class="flex flex-col items-center md:items-start space-y-4">
                    <div class="flex items-center space-x-3">
                        <img src="../assets/zacipaci-logo.png" alt="ZaciPaci logó" class="w-15" />
                        <div>
                            <h2 class="text-2xl font-bold tracking-tight">ZaciPaci</h2>
                            <p class="text-xs text-gray-400 uppercase tracking-widest">zálogház</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 max-w-xs">
                        Gyors és diszkrét megoldások az Ön értéktárgyaiért. Keressen minket bizalommal!
                    </p>
                    <a href="#" class="text-xs text-gray-400 hover:text-[#E2B524] underline transition-colors">Törvényi
                        tájékoztató</a>
                </div>
                <div>
                    <h3 class="text-[#E2B524] font-bold mb-5 uppercase tracking-wider text-sm">Hasznos linkek</h3>
                    <ul class="space-y-3 text-gray-300">
                        <li><router-link to="/rolunk"
                                class="hover:text-[#E2B524] transition-colors">Rólunk</router-link></li>
                        <li><router-link to="/mukodesunk"
                                class="hover:text-[#E2B524] transition-colors">Működésünk</router-link></li>
                        <li><router-link to="/aszf" class="hover:text-[#E2B524] transition-colors">ÁSZF /
                                Adatvédelem</router-link></li>
                        <li><router-link to="/gyik" class="hover:text-[#E2B524] transition-colors">Gyakori
                                kérdések</router-link></li>
                        <li><router-link to="/panaszkuldes" class="hover:text-[#E2B524] transition-colors">Panasz
                                kűldése</router-link></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-[#E2B524] font-bold mb-5 uppercase tracking-wider text-sm text-center md:text-left">
                        Nyitvatartás</h3>
                    <ul class="space-y-3 text-gray-300 inline-block text-left">
                        <li class="flex items-center space-x-3">
                            <span class="font-medium w-10">H-P:</span>
                            <span class="text-gray-400">08:00 - 18:00</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <span class="font-medium w-10">Szo:</span>
                            <span class="text-gray-400">09:00 - 13:00</span>
                        </li>
                        <li class="flex items-center space-x-3 text-red-400">
                            <span class="font-medium w-10">V:</span>
                            <span>Zárva</span>
                        </li>
                    </ul>
                </div>
                <div class="space-y-6">
                    <div>
                        <h3 class="text-[#E2B524] font-bold mb-5 uppercase tracking-wider text-sm">Kapcsolat</h3>
                        <ul class="space-y-3 text-gray-300">
                            <li class="flex items-center justify-center md:justify-start space-x-2">
                                <i class="bi bi-telephone text-[#E2B524]"></i>
                                <span>+36 20 123 4567</span>
                            </li>
                            <li class="flex items-center justify-center md:justify-start space-x-2">
                                <i class="bi bi-envelope text-[#E2B524]"></i>
                                <span>zacipacizaloghaz@gmail.com</span>
                            </li>
                            <li class="flex items-center justify-center md:justify-start space-x-2">
                                <i class="bi bi-geo-alt text-[#E2B524]"></i>
                                <span>2800 Tatabánya, Réti u. 1-5.</span>
                            </li>
                        </ul>
                    </div>
                    <div class="flex justify-center md:justify-start space-x-4">
                        <a href="#" class="text-2xl hover:text-[#E2B524] transition-transform hover:scale-110"><i
                                class="bi bi-facebook"></i></a>
                        <a href="https://www.instagram.com/zacipacizaloghaz/" target="blank"
                            class="text-2xl hover:text-[#E2B524] transition-transform hover:scale-110"><i
                                class="bi bi-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="border-t border-white-700 pt-8">
                <p class="text-center text-gray-500 text-sm italic">
                    &copy; 2026 ZaciPaci Zálogház. Minden jog fenntartva.
                </p>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>