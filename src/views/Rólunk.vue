<script setup>
import MainHeader from '../components/MainHeader.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
    <MainHeader />
    <main class="transition-colors">

        <section class="py-20 bg-[#FBF5E9] dark:bg-[#1A1614] transition-colors">
            <div class="container mx-auto px-4 max-w-5xl">

                <div class="text-center mb-16">
                    <h2
                        class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
                        Üdvözöljük a ZaciPaci világában!
                    </h2>
                    <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                    <div
                        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] p-8 rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] transition-transform hover:-translate-y-1 flex flex-col">
                        <h3 class="text-2xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-4 flex items-center">
                            <i class="bi bi-rocket-takeoff text-[#E5B326] mr-3"></i> Miért jöttünk létre?
                        </h3>
                        <p class="text-[#4A2E23]/90 dark:text-[#D4C7B0] leading-relaxed font-medium">
                            A ZaciPaci ötlete abból a felismerésből született, hogy a zálogházi ügyintézés lehetne
                            sokkal
                            emberarcúbb is. Létrehoztunk egy helyet, ahol a gyors pénzügyi segítség nem jár
                            szorongással,
                            hanem egy barátságos és mindenki számára érthető folyamattal párosul.
                        </p>
                    </div>

                    <div
                        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] p-8 rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] transition-transform hover:-translate-y-1 flex flex-col">
                        <h3 class="text-2xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-4 flex items-center">
                            <i class="bi bi-shield-check text-[#E5B326] mr-3"></i> Megbízhatóság
                        </h3>
                        <p class="text-[#4A2E23]/90 dark:text-[#D4C7B0] leading-relaxed font-medium">
                            A diszkréció nálunk alapvető működési elv. Minden ügyletünket szigorú adatvédelmi szabályok
                            mellett, rejtett költségek nélkül bonyolítjuk le. Célunk, hogy értékei nálunk a legjobb és
                            legbiztonságosabb kezekben legyenek.
                        </p>
                    </div>

                    <div
                        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] p-8 rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] transition-transform hover:-translate-y-1 flex flex-col">
                        <h3 class="text-2xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-4 flex items-center">
                            <i class="bi bi-award text-[#E5B326] mr-3"></i> Szakmai tudás
                        </h3>
                        <p class="text-[#4A2E23]/90 dark:text-[#D4C7B0] leading-relaxed font-medium">
                            Legyen szó antik aranyékszerekről vagy modern technikai eszközökről, több éves szakmai
                            tapasztalattal végezzük az értékbecslést. Folyamatosan követjük a világpiaci trendeket, hogy
                            Ön
                            mindig a lehető legjobb árat kaphassa értékeiért.
                        </p>
                    </div>

                    <div
                        class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] p-8 rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] transition-transform hover:-translate-y-1 flex flex-col">
                        <h3 class="text-2xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-4 flex items-center">
                            <i class="bi bi-lightning-charge text-[#E5B326] mr-3"></i> Modern zálogház
                        </h3>
                        <p class="text-[#4A2E23]/90 dark:text-[#D4C7B0] leading-relaxed font-medium">
                            A zálogházi szolgáltatásokat a 21. századba emeljük. Az online értékbecslésünkkel és a
                            digitális
                            jelenlétünkkel kényelmesebbé és mindenki számára hozzáférhetővé tesszük a gyors készpénzhez
                            jutást.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <section class="py-20 bg-white dark:bg-[#26211E] transition-colors">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2
                        class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
                        Csapatunk
                    </h2>
                    <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="w-full h-full object-cover object-top" src="../assets/kalmanpfp.jpg"
                                alt="Kálmán Dávid" title="Kálmán Dávid Tulajdonos">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Kálmán Dávid</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Alapító</p>
                        <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
                            "A ZaciPaci küldetése, hogy méltó és korrekt megoldást kínáljunk minden ügyfelünknek."
                        </p>
                    </div>

                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="object-cover object-top" src="../assets/martinpfp.jpg" alt="Buchholz Martin"
                                title="Buchholz Martin Üzletvezető">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Buchholz Martin</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Társtulajdonos</p>
                        <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
                            „Hiszek abban, hogy a jó megállapodás gyorsan és egyszerűen születik meg."
                        </p>
                    </div>

                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="object-cover object-top" src="../assets/roncsekpfp.png" alt="Roncsek Dávid"
                                title="Roncsek Dávid értékbecslő">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Roncsek Dávid</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Társtulajdonos</p>
                        <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
                            "Munkám során a precizitás és a tárgyak valódi értékének elismerése vezérel."
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white dark:bg-[#26211E] transition-colors">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2
                        class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
                        Befektetők és Segítők
                    </h2>
                    <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="w-full h-full object-cover" src="../assets/darius.jpg" alt="Balogh Dárius"
                                title="Balogh Dárius Angyalbefektető">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Balogh Dárius</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Angyalbefektető</p>
                    </div>

                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="w-full h-full object-cover" src="../assets/klementipfp.jpg" alt="Klementi Csaba"
                                title="Klementi Csaba Restaurátor">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Klementi Csaba</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Restaurátor</p>
                    </div>

                    <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
                        <div
                            class="w-40 h-40 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 overflow-hidden transition-transform group-hover:-translate-y-2">
                            <img class="object-cover" src="../assets/snackroyale.png" alt="Snack Royale logo"
                                title="Snack Royale partner">
                        </div>
                        <h3 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Snack Royale</h3>
                        <p class="text-lg font-bold text-[#E5B326] mb-3 uppercase tracking-wider">Üzleti partner</p>
                    </div>
                </div>
            </div>
        </section>

    </main>
    <Footer />
</template>

<style scoped>
.dark .shadow-\[6px_6px_0px_\#4A2E23\] {
    box-shadow: 6px 6px 0px #E5B326;
}
</style>