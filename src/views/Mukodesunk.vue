<script setup>
import { ref, computed } from 'vue';
import Footer from '../components/Footer.vue';
import MainHeader from '../components/MainHeader.vue';

const amount = ref(50000);
const months = ref(1)
const INTEREST_RATE = 0.25
const MONTH_OPTIONS = [1, 2, 3, 6, 12]

const MAX_AMOUNT = 5000000;

const validateAmount = () => {
    if (amount.value > MAX_AMOUNT) amount.value = MAX_AMOUNT;
    if (amount.value < 0 || !amount.value) amount.value = 0;
};

const totalRepayment = computed(() => {
    const currentAmount = amount.value || 0;
    const interest = currentAmount * INTEREST_RATE * months.value;
    return Math.round(currentAmount + interest);
});

const feeOnly = computed(() => totalRepayment.value - (amount.value || 0));
const monthlyPayment = computed(() => Math.round(totalRepayment.value / months.value));
</script>

<template>
    <MainHeader />
    <main class="bg-[#FBF5E9]/30 dark:bg-[#1A1614] pb-20 transition-colors">

        <section class="py-16 text-center">
            <div class="container mx-auto px-4">
                <h1
                    class="text-[40px] md:text-[54px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight mb-4">
                    Hogyan működik a <span class="text-[#E5B326]">ZaciPaci</span>
                </h1>
                <p class="text-lg text-[#4A2E23]/80 dark:text-[#D4C7B0] max-w-2xl mx-auto font-medium">
                    Átlátható folyamat, gyors bírálat és azonnali készpénzfizetés. Nézze meg, milyen egyszerűen juthat
                    kölcsönhöz!
                </p>
                <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-6 rounded-full"></div>
            </div>
        </section>

        <section class="container mx-auto px-4 max-w-6xl mb-16">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div
                    class="flex flex-col items-center text-center p-6 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] relative transition-colors">
                    <div
                        class="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#E5B326] text-[#4A2E23] font-bold flex items-center justify-center rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326]">
                        1</div>
                    <i class="bi bi-camera text-4xl text-[#E5B326] mb-4 mt-2"></i>
                    <h3 class="font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2 text-xl">Feltöltés</h3>
                    <p class="text-sm text-[#4A2E23]/80 dark:text-[#D4C7B0]">Töltse fel tárgyát fotókkal és adja meg a
                        kívánt
                        kölcsönösszeget űrlapunkon.</p>
                </div>
                <div
                    class="flex flex-col items-center text-center p-6 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] relative transition-colors">
                    <div
                        class="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#E5B326] text-[#4A2E23] font-bold flex items-center justify-center rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326]">
                        2</div>
                    <i class="bi bi-person-check text-4xl text-[#E5B326] mb-4 mt-2"></i>
                    <h3 class="font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2 text-xl">Szakértői bírálat</h3>
                    <p class="text-sm text-[#4A2E23]/80 dark:text-[#D4C7B0]">Munkatársaink megvizsgálják a kérést, és
                        visszaküldenek Önnek egy
                        ajánlatot.</p>
                </div>
                <div
                    class="flex flex-col items-center text-center p-6 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] relative transition-colors">
                    <div
                        class="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#E5B326] text-[#4A2E23] font-bold flex items-center justify-center rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326]">
                        3</div>
                    <i class="bi bi-envelope-paper text-4xl text-[#E5B326] mb-4 mt-2"></i>
                    <h3 class="font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2 text-xl">Értesítés</h3>
                    <p class="text-sm text-[#4A2E23]/80 dark:text-[#D4C7B0]">Bejövö ajánlatok oldalon megjelenik Önnek
                        az ajánlatunk amit elfogadhat, illetve elutasíthat.</p>
                </div>
                <div
                    class="flex flex-col items-center text-center p-6 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] relative transition-colors">
                    <div
                        class="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#E5B326] text-[#4A2E23] font-bold flex items-center justify-center rounded-full border-2 border-[#4A2E23] dark:border-[#E5B326]">
                        4</div>
                    <i class="bi bi-cash-stack text-4xl text-[#E5B326] mb-4 mt-2"></i>
                    <h3 class="font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2 text-xl">Kifizetés</h3>
                    <p class="text-sm text-[#4A2E23]/80 dark:text-[#D4C7B0]">Ha elfogadja az ajánlatunkat, és behozza
                        tárgyát zálogházunkba egy gyors vizsgálat után azonnal kifizetjük Önt.</p>
                </div>
            </div>
        </section>

        <section class="container mx-auto px-4 max-w-4xl mt-24">
            <div
                class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[40px] p-8 md:p-12 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">
                <h2
                    class="text-3xl font-bold text-[#4A2E23] dark:text-[#E5B326] mb-8 text-center flex items-center justify-center">
                    <i class="bi bi-info-circle text-[#E5B326] mr-3"></i> Mit kell tudni a zálogkölcsönről?
                </h2>
                <div class="space-y-10">
                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-2xl flex items-center justify-center border border-[#4A2E23] dark:border-[#E5B326] transition-colors">
                            <i class="bi bi-safe text-2xl text-[#4A2E23] dark:text-[#E5B326]"></i>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">A tárgy a fedezet</h4>
                            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed">
                                A zálogkölcsön alapja, hogy az Ön által behozott értéktárgy szolgál fedezetként. Nincs
                                szükség munkáltatói igazolásra vagy bonyolult hitelbírálatra. A kölcsön összege a tárgy
                                piaci értékének egy meghatározott százaléka.
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-2xl flex items-center justify-center border border-[#4A2E23] dark:border-[#E5B326] transition-colors">
                            <i class="bi bi-calendar3 text-2xl text-[#4A2E23] dark:text-[#E5B326]"></i>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Futamidő és
                                hosszabbítás</h4>
                            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed">
                                A kölcsönök általában fix futamidőre (pl. 30, 45 vagy 90 nap) szólnak. Ha lejáratkor nem
                                tudja visszafizetni a teljes összeget, a kamatok megfizetésével a futamidő rugalmasan
                                meghosszabbítható.
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div
                            class="shrink-0 w-12 h-12 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-2xl flex items-center justify-center border border-[#4A2E23] dark:border-[#E5B326] transition-colors">
                            <i class="bi bi-box-arrow-in-left text-2xl text-[#4A2E23] dark:text-[#E5B326]"></i>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-2">Visszaváltás folyamata
                            </h4>
                            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed">
                                Amint visszafizeti a kölcsönvett összeget és a felhalmozott kamatokat, Ön azonnal
                                visszakapja értéktárgyát. A tárgyakat ez idő alatt biztonságos, biztosított raktárban
                                tároljuk, ügyelve állaguk megőrzésére.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="mt-12 p-6 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-2xl border-2 border-[#4A2E23] dark:border-[#E5B326] text-center transition-colors">
                    <p class="font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-4 text-lg">Készen áll az első ajánlatára?
                    </p>
                    <router-link to="/targy-felvetele"
                        class="inline-block bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-bold py-3 px-8 rounded-full transition-all shadow-md active:scale-95">
                        Tárgy feltöltése most
                    </router-link>
                </div>
            </div>
        </section>

        <section class="container mx-auto px-4 max-w-5xl mt-8 mb-24">
            <div
                class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[40px] p-8 md:p-12 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">

                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold mb-2 text-[#4A2E23] dark:text-[#E5B326]">Tervezze meg kölcsönét!</h2>
                    <p class="text-[#4A2E23]/70 dark:text-[#D4C7B0] font-medium">Számolja ki egyszerűen a várható
                        költségeket.</p>
                    <div class="w-16 h-1 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div class="space-y-10">
                        <div>
                            <div class="flex justify-between items-center mb-4">
                                <label class="font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Kölcsön összege</label>
                                <div
                                    class="relative flex items-center transition-all bg-white dark:bg-[#1A1614] border border-gray-200 dark:border-[#E5B326]/40 rounded-xl px-3 py-1 focus-within:border-[#E5B326] focus-within:ring-1 focus-within:ring-[#E5B326]">
                                    <input type="number" v-model.number="amount" @input="validateAmount"
                                        class="w-24 md:w-32 bg-transparent text-[#4A2E23] dark:text-[#FBF5E9] font-extrabold text-right pr-8 outline-none border-none focus:ring-0">
                                    <span
                                        class="absolute right-3 text-[#4A2E23]/40 dark:text-[#D4C7B0]/60 font-bold pointer-events-none text-sm">Ft</span>
                                </div>
                            </div>
                            <input type="range" v-model.number="amount" min="5000" :max="MAX_AMOUNT" step="5000"
                                class="w-full h-2 bg-[#FBF5E9] dark:bg-[#1A1614] rounded-lg appearance-none cursor-pointer accent-[#E5B326] border border-gray-200 dark:border-[#E5B326]/20">
                            <div
                                class="flex justify-between text-[10px] mt-2 text-[#4A2E23]/40 dark:text-[#D4C7B0]/50 uppercase font-bold">
                                <span>Min: 5.000 Ft</span>
                                <span>Max: 5.000.000 Ft</span>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between items-center mb-4">
                                <label class="font-bold text-[#4A2E23] dark:text-[#FBF5E9]">Futamidő (hónap)</label>
                                <div
                                    class="bg-white dark:bg-[#1A1614] border border-[#E5B326] rounded-xl px-4 py-1.5 shadow-sm transition-colors">
                                    <span class="text-[#4A2E23] dark:text-[#FBF5E9] font-extrabold text-lg">{{ months }}
                                        hónap</span>
                                </div>
                            </div>
                            <div class="flex gap-2 flex-wrap">
                                <button v-for="m in MONTH_OPTIONS" :key="m" @click="months = m"
                                    class="flex-1 py-2.5 rounded-xl border-2 font-black text-sm transition-all"
                                    :class="months === m
                                        ? 'border-[#E5B326] text-[#4A2E23]'
                                        : 'bg-white dark:bg-[#1A1614] border-gray-200 dark:border-[#E5B326]/20 text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 hover:border-[#E5B326]'">
                                    {{ m }} hó
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-[#FBF5E9] dark:bg-[#1A1614] rounded-3xl p-8 text-[#4A2E23] dark:text-[#FBF5E9] text-center border-4 border-[#E5B326] shadow-sm relative overflow-hidden transition-colors">
                        <i
                            class="bi bi-calc-fill text-[120px] text-[#E5B326]/10 absolute -top-10 -right-10 rotate-12"></i>
                        <p
                            class="text-xs uppercase font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/60 mb-1 relative z-10 tracking-wider">
                            Visszafizetendő összeg</p>
                        <h3 class="text-4xl font-black mb-4 relative z-10">{{ totalRepayment.toLocaleString() }} Ft</h3>

                        <div
                            class="border-t border-[#4A2E23]/10 dark:border-[#E5B326]/20 pt-4 space-y-2 relative z-10 font-medium">
                            <div class="flex justify-between text-sm">
                                <span class="text-[#4A2E23]/60 dark:text-[#D4C7B0]/70">Kölcsön összege:</span>
                                <span>{{ (amount || 0).toLocaleString('hu-HU') }} Ft</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-[#4A2E23]/60 dark:text-[#D4C7B0]/70">Kamatláb (havi):</span>
                                <span class="font-bold">25%</span>
                            </div>
                            <div class="flex justify-between text-sm text-red-600 dark:text-red-400 font-bold">
                                <span>Kamatok összesen:</span>
                                <span>+{{ feeOnly.toLocaleString('hu-HU') }} Ft</span>
                            </div>
                            <div class="flex justify-between text-sm font-bold text-[#E5B326]">
                                <span>Havi törlesztő:</span>
                                <span>{{ monthlyPayment.toLocaleString('hu-HU') }} Ft/hó</span>
                            </div>
                        </div>

                        <p
                            class="text-[10px] text-red-500/80 dark:text-red-400/70 mt-6 leading-tight relative z-10 font-semibold italic">
                            *A kalkuláció tájékoztató jellegű, nem minősül ajánlattételnek!<br>A pontos díjak a tárgy
                            típusától függenek.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    </main>
    <Footer />
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: #E5B326;
    border: 3px solid #4A2E23;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 2px 2px 0px #4A2E23;
    margin-top: -9px;
}

input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #F9FAFB;
    border-radius: 10px;
    border: 1px solid #E5E7EB;
}

.dark .shadow-\[6px_6px_0px_\#4A2E23\] {
    box-shadow: 6px 6px 0px #E5B326;
}

.dark .shadow-\[8px_8px_0px_\#4A2E23\] {
    box-shadow: 8px 8px 0px #E5B326;
}
</style>