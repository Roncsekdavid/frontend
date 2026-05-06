<script setup>
import { ref } from 'vue';
import MainHeader from '../components/MainHeader.vue';
import Footer from '../components/Footer.vue';

const activeIndex = ref(null);

const faqs = ref([
    {
        question: "Mennyi idő, amíg elbíráljuk a tárgyat?",
        answer: "Szakértőink általában 24 órán belül megvizsgálják a feltöltött fotókat és adatokat. Amennyiben minden információ megfelelő, és rendelkezésre áll, munkanapokon akár pár órán belül megkaphatja az előzetes ajánlatunkat."
    },
    {
        question: "Mi történik, ha nem fogadom el az ajánlatot?",
        answer: "Ha Ön úgy dönt, hogy nem fogadja el az általunk kínált ajánlatot akkor a szerződés nem jön létre az adott tárgyra."
    },
    {
        question: "Mi történik, ha elfogadom az ajánlatot?",
        answer: "Ha Ön úgy dönt, hogy elfogadja az általunk kínált ajánlatot akkor a tárgy zálogházba érkezése után egy gyors, 5–10 perces felületi ellenőrzést követően és egy rövid adminisztráció után létrjön a szerződés a tárgyra."
    },
    {
        question: "Hogyan kapom meg a pénzt az sikeres szerződés után?",
        answer: "A folyamat villámgyors: Miután sikeres szerződést kötöttünk azonnal kifizetjük Önnek az összeget készpénzben vagy banki utalással, így nem kell napokat várnia a pénzére."
    },
    {
        question: "Miért nem tudok tárgyat feltölteni?",
        answer: "A tárgyfeltöltéshez mindenképpen aktív ügyfélnek kell lennie: Első lépésként regisztráljon az oldalon, majd jelentkezzen be a fiókjába. Csak bejelentkezett felhasználóként indíthat el a folyamatot. Amennyiben ez megtörtént, de mégsem sikerül a feltöltés, előfordulhat, hogy szerverünk éppen túlterhelt – ilyen esetben kérjük, próbálkozzon újra pár perc múlva!"
    },
    {
        question: "A kalkulátor nem a pontos visszafizetendő összeget írja. Miért?",
        answer: "A kölcsönkalkulátor tájékoztató jellegű körülbelüli adatokat közöl. A végleges összeget a zálogtárgy pontos állapota, piaci értéke és a választott futamidő együttesen határozza meg a személyes bírálat során."
    },
    {
        question: "Mi történik, ha a tárgy mégsem olyan, mint amit feltöltöttem?",
        answer: "A kifizetést követően minden tárgy egy részletes szakértői vizsgálaton megy keresztül. Amennyiben ekkor kiderül, hogy a tárgy állapota vagy valódisága eltér a feltöltéskor megadott adatoktól, a kifizetett kölcsönösszeget 3 napon belül hiánytalanul vissza kell fizetnie. Kérjük, ügyeljen az adatok pontosságára, mert a visszafizetés elmaradása minden esetben jogi következményeket és az ügy hatósági útra terelését vonja maga után."
    },
    {
        question: "Biztonságban van a tárgyam a zálogidőszak alatt?",
        answer: "Természetesen! Minden hozzánk bekerülő értéktárgyat egy erre külön kinevezett biztosított raktárban tárolunk. A nálunk hagyott tárgyakért teljes anyagi felelősséget vállalunk."
    }
]);

const toggleFaq = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#1A1614] flex flex-col transition-colors">
        <MainHeader />

        <main class="flex-grow py-12 px-4">
            <div class="max-w-3xl mx-auto">

                <div class="text-center mb-16">
                    <h2 class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
                        Gyakori Kérdések
                    </h2>
                    <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="space-y-4">
                    <div v-for="(faq, index) in faqs" :key="index"
                        class="bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[25px] shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] overflow-hidden transition-colors">

                        <button @click="toggleFaq(index)"
                            class="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none">
                            <span class="font-black text-[#4A2E23] dark:text-[#FBF5E9] text-sm md:text-base lg:text-lg uppercase leading-tight">
                                {{ faq.question }}
                            </span>
                            <div class="ml-4 flex-shrink-0 w-8 h-8 bg-[#E5B326] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-full flex items-center justify-center transition-transform duration-300"
                                :class="activeIndex === index ? 'rotate-180' : ''">
                                <i class="bi bi-chevron-down text-[#4A2E23] font-bold"></i>
                            </div>
                        </button>

                        <div v-show="activeIndex === index"
                            class="px-6 pb-6 animate-slideDown">
                            <div class="h-[2px] bg-gray-100 dark:bg-[#E5B326]/20 mb-4"></div>
                            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-bold leading-relaxed text-sm md:text-base">
                                {{ faq.answer }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-16 bg-[#4A2E23] dark:bg-[#26211E] border-0 dark:border-2 dark:border-[#E5B326] rounded-[30px] p-8 text-center text-white shadow-[8px_8px_0px_#E5B326] transition-colors">
                    <h3 class="text-xl font-black uppercase mb-2">Nem találtad a választ?</h3>
                    <p class="font-bold text-[#E5B326]/80 text-sm mb-6">Ügyfélszolgálatunk készen áll a segítségedre!</p>
                    <button class="bg-[#E5B326] text-[#4A2E23] font-black px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-wider text-sm shadow-[0px_4px_0px_#a9841c]">
                        Írj nekünk üzenetet
                    </button>
                </div>

            </div>
        </main>

        <Footer />
    </div>
</template>

<style scoped>
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.animate-slideDown {
    animation: slideDown 0.3s ease-out;
}

.dark .shadow-\[6px_6px_0px_\#4A2E23\] {
    box-shadow: 6px 6px 0px #E5B326;
}
</style>