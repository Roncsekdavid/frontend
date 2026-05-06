<script setup>
import { ref, onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'
import Footer from '../components/Footer.vue'
import KiemeltTermekek from '../components/KiemeltTermekek.vue'
import BongeszesKinalatban from '../components/BongeszesKinalatban.vue'
import CookieConsent from '../components/CookieConsent.vue'
import NewsSlider from '../components/NewsSlider.vue'

const scrollToKinalat = () => {
  document.getElementById('bongeszes-kinalatban')?.scrollIntoView({ behavior: 'smooth' })
}

const showDisclaimer = ref(false)

onMounted(() => {
  if (!sessionStorage.getItem('disclaimer_seen')) {
    showDisclaimer.value = true
  }
})

function closeDisclaimer() {
  sessionStorage.setItem('disclaimer_seen', 'true')
  showDisclaimer.value = false
}

const categories = [
  { name: 'Ékszer & Arany', icon: 'bi-gem' },
  { name: 'Órák', icon: 'bi-watch' },
  { name: 'Műtárgyak', icon: 'bi-palette-fill' },
  { name: 'Elektronika', icon: 'bi-cpu-fill' },
  { name: 'Háztartási gépek', icon: 'bi-house-gear-fill' },
  { name: 'Hétköznapi cikkek', icon: 'bi-box-seam-fill' },
  { name: 'Hangszerek', icon: 'bi-music-note-beamed' },
  { name: 'Jármű', icon: 'bi-car-front-fill' },
  { name: 'Szerszámgépek', icon: 'bi-tools' },
  { name: 'Játékkonzolok', icon: 'bi-controller' },
  { name: 'Bútorok', icon: 'bi-lamp-fill' },
  { name: 'Sporteszközök', icon: 'bi-bicycle' }
]
</script>

<template>
  <MainHeader />

  <main class="transition-colors duration-300">
    <section class="bg-[#FBF5E9] dark:bg-[#1A1614] pt-[15px] overflow-hidden max-md:pt-[30px] max-md:text-center transition-colors">
      <div class="container mx-auto px-3 md:px-4">
        <div class="flex flex-col md:flex-row items-end md:items-center min-h-[400px]">
          <div class="w-full md:w-7/12 pt-[10px] pb-[30px] animate__animated animate__fadeInDown">
            <h2
              class="text-[60px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-[1.15] mb-[12px] md:text-[48px] max-md:text-[36px]">
              Azonnali készpénz<br>az Ön értékeiért!
            </h2>

            <p class="text-[20px] font-semibold text-[#4A2E23] dark:text-[#D4C7B0] leading-[1.6] mb-0">
              Gyors, diszkrét és tisztességes<br>értékbecslés, akár percek alatt.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 mt-4 max-md:justify-center md:justify-start">
              <button
                class="bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-semibold text-base py-[13px] px-[28px] rounded-full transition shadow-[0px_4px_0px_#a9841c] active:translate-y-1 active:shadow-none">
                <router-link to="/targy-felvetele" class="text-[#4A2E23] no-underline">
                  Online értékbecslést kérek
                </router-link>
              </button>

              <button
                class="bg-transparent border-2 border-[#4A2E23] dark:border-[#E5B326] text-[#4A2E23] dark:text-[#E5B326] hover:bg-[#4A2E23] dark:hover:bg-[#E5B326] hover:text-[#FBF5E9] dark:hover:text-[#1A1614] font-semibold text-base py-[13px] px-[28px] rounded-full transition shadow-[0px_4px_0px_#4A2E23] dark:shadow-[0px_4px_0px_#a9841c] active:translate-y-1 active:shadow-none"
                @click="scrollToKinalat">
                Böngészés a boltban
              </button>
            </div>
          </div>

          <div
            class="w-full md:w-5/12 flex justify-center md:justify-end self-end mt-4 md:mt-0 animate__animated animate__fadeInDown">
            <img
              src="../assets/keszpenz20.png"
              alt="Zálogház készpénz"
              class="w-full max-w-[420px] object-contain md:max-w-[350px] max-md:max-w-[280px] md:mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="marquee-container bg-[#FDF8F1] dark:bg-[#26211E] py-10 border-y-2 border-[#4A2E23] dark:border-[#E5B326]/20 transition-colors">
      <div class="marquee-content">
        <div v-for="i in 2" :key="i" class="flex">
          <div
            v-for="cat in categories"
            :key="cat.name + i"
            class="flex items-center bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-2xl px-8 py-4 mx-6 shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326] transition-transform hover:scale-105"
          >
            <i :class="['bi', cat.icon, 'text-[#E2B524] text-3xl mr-4']"></i>
            <span class="text-[#4A2E23] dark:text-[#FBF5E9] font-bold text-lg whitespace-nowrap uppercase tracking-tight">
              {{ cat.name }}
            </span>
          </div>
        </div>
      </div>
    </section>
    <section class="pt-20 bg-white dark:bg-[#1A1614] transition-colors">
      <NewsSlider/>
    </section>

    <section class="pb-20 bg-white dark:bg-[#1A1614] transition-colors">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h3 class="text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight max-md:text-[32px]">
            Hogyan működik
          </h3>
          <div class="w-24 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full shadow-[0px_0px_10px_rgba(229,179,38,0.5)]"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown animate__faster">
            <div
              class="w-24 h-24 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 transition-all group-hover:-translate-y-2">
              <i class="bi bi-camera-fill text-[#E5B326] text-4xl"></i>
            </div>
            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-3">
              1. Feltölti a tárgyat
            </h4>
            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
              Készítsen fotókat az értéktárgyáról, és töltse fel az online űrlapunkon keresztül.
            </p>
          </div>

          <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown animate__fast">
            <div
              class="w-24 h-24 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 transition-all group-hover:-translate-y-2">
              <i class="bi bi-hand-thumbs-up-fill text-[#E5B326] text-4xl"></i>
            </div>
            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-3">
              2. Elbíráljuk a tárgyat
            </h4>
            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
              Szakértőink percek alatt megvizsgálják a képeket és korrekt ajánlatot tesznek.
            </p>
          </div>

          <div class="flex flex-col items-center text-center group animate__animated animate__fadeInDown">
            <div
              class="w-24 h-24 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_#4A2E23] dark:shadow-[6px_6px_0px_#E5B326] mb-6 transition-all group-hover:-translate-y-2">
              <i class="bi bi-currency-dollar text-[#E5B326] text-4xl"></i>
            </div>
            <h4 class="text-xl font-bold text-[#4A2E23] dark:text-[#FBF5E9] mb-3">
              3. Átveszi a pénzét
            </h4>
            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium max-w-[250px]">
              Személyes átvétel után azonnal, készpénzben vagy utalással fizetünk Önnek.
            </p>
          </div>
        </div>
      </div>
    </section>


    <KiemeltTermekek />

    <BongeszesKinalatban />
  </main>

  <Footer />

  <CookieConsent />

  <Transition name="modal">
    <div v-if="showDisclaimer" class="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#4A2E23]/60 backdrop-blur-sm"></div>

      <div
        class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[32px] shadow-[12px_12px_0px_#4A2E23] dark:shadow-[12px_12px_0px_#E5B326] max-w-md w-full p-8 text-center"
      >
        <div class="w-16 h-16 bg-[#E5B326] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#4A2E23]">
          <i class="bi bi-info-lg text-[#4A2E23] text-3xl font-black"></i>
        </div>

        <h3 class="text-2xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-3">
          Fontos tájékoztató
        </h3>

        <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium leading-relaxed mb-3">
          Ez az oldal egy <span class="font-black text-[#4A2E23] dark:text-[#E5B326]">fejlesztői projekt</span>,
          nem valódi működő zálogház. Tranzakciók nem kerülnek végrehajtásra.
        </p>

        <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium leading-relaxed mb-6">
          Ugyanakkor minden regisztrált felhasználó adata
          <span class="font-black text-[#4A2E23] dark:text-[#E5B326]">biztonságosan és titkosítva</span>
          van tárolva.
        </p>

        <button
          @click="closeDisclaimer"
          class="w-full bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-4 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider"
        >
          Megértettem
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.marquee-container {
  display: flex;
  overflow: hidden;
  user-select: none;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  min-width: 100%;
  animation: scroll 40s linear infinite;
}

.marquee-content:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.dark .shadow-\[4px_4px_0px_\#4A2E23\] {
  box-shadow: 4px 4px 0px #E5B326;
}

.dark .shadow-\[6px_6px_0px_\#4A2E23\] {
  box-shadow: 6px 6px 0px #E5B326;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>