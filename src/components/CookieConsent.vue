<script setup>
import { ref, onMounted } from 'vue'

const showCookie = ref(false)
const showCookiePolicy = ref(false)

onMounted(() => {
  const cookieChoice = localStorage.getItem('cookie_choice')

  if (!cookieChoice) {
    showCookie.value = true
  }
})

function acceptCookie() {
  localStorage.setItem('cookie_choice', 'accepted')
  localStorage.setItem('cookie_accepted', 'true')
  showCookie.value = false
  showCookiePolicy.value = false
}

function rejectCookie() {
  localStorage.setItem('cookie_choice', 'rejected')
  localStorage.removeItem('cookie_accepted')
  showCookie.value = false
  showCookiePolicy.value = false
}
</script>

<template>
  <Transition name="cookie">
    <div
      v-if="showCookie"
      class="fixed bottom-0 left-0 right-0 z-[400] p-4 md:p-6 pointer-events-none"
    >
      <div
        class="pointer-events-auto max-w-5xl mx-auto bg-[#FBF5E9] dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[28px] shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] overflow-hidden"
      >
        <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-5 items-center p-5 md:p-6">
          <div class="flex justify-center lg:justify-start">
            <div class="relative w-16 h-16 rounded-3xl bg-[#E5B326] border-4 border-[#4A2E23] flex items-center justify-center shadow-[4px_4px_0px_#4A2E23]">
              <i class="bi bi-shield-lock-fill text-3xl text-[#4A2E23]"></i>

              <div class="absolute -right-2 -bottom-2 w-8 h-8 bg-white dark:bg-[#1A1614] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-full flex items-center justify-center">
                <i class="bi bi-cookie text-[#E5B326]"></i>
              </div>
            </div>
          </div>

          <div class="text-center lg:text-left">
            <p class="text-xl md:text-2xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase leading-tight">
              Adatvédelem és sütik
            </p>

            <p class="text-sm md:text-base text-[#4A2E23]/75 dark:text-[#D4C7B0] font-semibold mt-2 leading-relaxed">
              A ZaciPaci a működéshez szükséges sütiket és helyi tárolást használja. Ezek segítenek a bejelentkezés,
              a beállítások és a felhasználói élmény kezelésében. Marketing célú követést nem alkalmazunk.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              @click="showCookiePolicy = true"
              class="bg-white dark:bg-[#1A1614] hover:bg-[#FDF8F1] dark:hover:bg-[#26211E] text-[#4A2E23] dark:text-[#FBF5E9] font-black px-6 py-3 rounded-full text-sm transition-all border-2 border-[#4A2E23] dark:border-[#E5B326] uppercase tracking-wide whitespace-nowrap"
            >
              Részletek
            </button>

            <button
              @click="acceptCookie"
              class="bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black px-6 py-3 rounded-full text-sm transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wide whitespace-nowrap"
            >
              Elfogadom
            </button>

            <button
              @click="rejectCookie"
              class="bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-black px-6 py-3 rounded-full text-sm transition-all border-2 border-red-300 dark:border-red-500/40 uppercase tracking-wide whitespace-nowrap"
            >
              Elutasítom
            </button>
          </div>
        </div>

        <div class="bg-[#4A2E23] dark:bg-[#1A1614] px-5 md:px-6 py-3 border-t-4 border-[#4A2E23] dark:border-[#E5B326]">
          <p class="text-[11px] md:text-xs text-[#FBF5E9]/80 dark:text-[#D4C7B0]/80 font-bold text-center lg:text-left">
            A szükséges sütik az oldal alapvető működéséhez kellenek. Döntésedet a böngésző helyi tárhelyében tároljuk.
          </p>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="modal">
    <div
      v-if="showCookiePolicy"
      class="fixed inset-0 z-[600] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-[#4A2E23]/70 backdrop-blur-sm"
        @click="showCookiePolicy = false"
      ></div>

      <div
        class="relative bg-white dark:bg-[#26211E] border-4 border-[#4A2E23] dark:border-[#E5B326] rounded-[34px] shadow-[12px_12px_0px_#4A2E23] dark:shadow-[12px_12px_0px_#E5B326] max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden"
      >
        <div class="bg-[#FBF5E9] dark:bg-[#1A1614] p-6 border-b-4 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-[#E5B326] rounded-2xl flex items-center justify-center border-4 border-[#4A2E23] shadow-[3px_3px_0px_#4A2E23]">
                <i class="bi bi-cookie text-[#4A2E23] text-2xl"></i>
              </div>

              <div>
                <p class="text-[10px] font-black text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 uppercase tracking-[0.25em] mb-1">
                  ZaciPaci tájékoztató
                </p>

                <h3 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase leading-tight">
                  Cookie és helyi tárolási szabályzat
                </h3>
              </div>
            </div>

            <button
              @click="showCookiePolicy = false"
              class="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#26211E] rounded-full hover:bg-[#E5B326] transition-colors border-2 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0"
            >
              <i class="bi bi-x-lg text-sm text-[#4A2E23] dark:text-[#FBF5E9]"></i>
            </button>
          </div>

          <p class="mt-4 text-sm font-semibold text-[#4A2E23]/70 dark:text-[#D4C7B0] leading-relaxed">
            Az oldal működéséhez bizonyos adatokat a böngészőben tárolunk. Ezek célja, hogy a bejelentkezés,
            a felhasználói beállítások és az oldal alapfunkciói megfelelően működjenek.
          </p>
        </div>

        <div class="overflow-y-auto flex-1 p-6 md:p-8 space-y-7 text-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23]/15 dark:border-[#E5B326]/20 rounded-2xl p-4">
              <i class="bi bi-shield-check text-2xl text-[#E5B326]"></i>
              <h4 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase mt-2 mb-1">
                Biztonság
              </h4>
              <p class="text-[#4A2E23]/70 dark:text-[#D4C7B0] font-medium text-xs leading-relaxed">
                Az adatok kizárólag az oldal működését segítik.
              </p>
            </div>

            <div class="bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23]/15 dark:border-[#E5B326]/20 rounded-2xl p-4">
              <i class="bi bi-person-lock text-2xl text-[#E5B326]"></i>
              <h4 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase mt-2 mb-1">
                Munkamenet
              </h4>
              <p class="text-[#4A2E23]/70 dark:text-[#D4C7B0] font-medium text-xs leading-relaxed">
                A bejelentkezési állapot kezeléséhez szükséges.
              </p>
            </div>

            <div class="bg-[#FBF5E9] dark:bg-[#1A1614] border-2 border-[#4A2E23]/15 dark:border-[#E5B326]/20 rounded-2xl p-4">
              <i class="bi bi-sliders text-2xl text-[#E5B326]"></i>
              <h4 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase mt-2 mb-1">
                Beállítások
              </h4>
              <p class="text-[#4A2E23]/70 dark:text-[#D4C7B0] font-medium text-xs leading-relaxed">
                Megjegyezzük a felhasználói kényelmi beállításokat.
              </p>
            </div>
          </div>

          <div>
            <p class="text-[#4A2E23]/45 dark:text-[#D4C7B0]/45 text-xs italic mb-4">
              Utoljára frissítve: 2026. május 4.
            </p>

            <h4 class="font-black text-[#E5B326] uppercase tracking-wide mb-2">
              1. Mire használjuk a sütiket?
            </h4>

            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed font-medium">
              A ZaciPaci weboldal kizárólag az oldal működéséhez szükséges sütiket és helyi tárolási megoldásokat használ.
              Ezek segítségével kezeljük például a bejelentkezést, a cookie-döntés állapotát, a kedvenc kategóriákat,
              valamint bizonyos megjelenítési beállításokat.
            </p>
          </div>

          <div>
            <h4 class="font-black text-[#E5B326] uppercase tracking-wide mb-2">
              2. Mit jelent az elfogadás vagy elutasítás?
            </h4>

            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed font-medium">
              Elfogadás esetén elmentjük, hogy hozzájárultál a szükséges tárolási megoldások használatához.
              Elutasítás esetén nem mentünk külön elfogadási állapotot, csak azt, hogy a tájékoztatót elutasítottad.
              Az oldal alapvető működéséhez szükséges technikai tárolások ettől még használatban maradhatnak.
            </p>
          </div>

          <div>
            <h4 class="font-black text-[#E5B326] uppercase tracking-wide mb-3">
              3. Az általunk használt tárolt adatok
            </h4>

            <div class="overflow-x-auto rounded-2xl border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/15">
              <table class="w-full text-xs">
                <thead class="bg-[#4A2E23] dark:bg-[#1A1614]">
                  <tr>
                    <th class="text-left p-3 font-black text-[#FBF5E9] dark:text-[#E5B326]">Név</th>
                    <th class="text-left p-3 font-black text-[#FBF5E9] dark:text-[#E5B326]">Típus</th>
                    <th class="text-left p-3 font-black text-[#FBF5E9] dark:text-[#E5B326]">Cél</th>
                    <th class="text-left p-3 font-black text-[#FBF5E9] dark:text-[#E5B326]">Megőrzés</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-[#4A2E23]/10 dark:divide-[#E5B326]/10">
                  <tr class="bg-white dark:bg-[#26211E]">
                    <td class="p-3 font-mono text-[#4A2E23] dark:text-[#D4C7B0]">sb-...-auth-token</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">localStorage</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Bejelentkezési munkamenet kezelése</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Munkamenethez kötött</td>
                  </tr>

                  <tr class="bg-[#FBF5E9]/60 dark:bg-[#1A1614]/60">
                    <td class="p-3 font-mono text-[#4A2E23] dark:text-[#D4C7B0]">cookie_choice</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">localStorage</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Cookie döntés tárolása</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Törlésig</td>
                  </tr>

                  <tr class="bg-white dark:bg-[#26211E]">
                    <td class="p-3 font-mono text-[#4A2E23] dark:text-[#D4C7B0]">favorite_categories</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">localStorage</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Kedvenc kategóriák tárolása</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Törlésig vagy frissítésig</td>
                  </tr>

                  <tr class="bg-[#FBF5E9]/60 dark:bg-[#1A1614]/60">
                    <td class="p-3 font-mono text-[#4A2E23] dark:text-[#D4C7B0]">disclaimer_seen</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">sessionStorage</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Fejlesztői projekt tájékoztató kezelése</td>
                    <td class="p-3 text-[#4A2E23]/70 dark:text-[#D4C7B0]/70">Böngésző bezárásáig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 class="font-black text-[#E5B326] uppercase tracking-wide mb-2">
              4. Marketing és követés
            </h4>

            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed font-medium">
              Az oldal nem használ harmadik féltől származó hirdetési cookie-kat, és nem végez marketing célú
              felhasználói profilalkotást. A tárolt adatok célja kizárólag az alkalmazás működésének biztosítása
              és a felhasználói élmény javítása.
            </p>
          </div>

          <div>
            <h4 class="font-black text-[#E5B326] uppercase tracking-wide mb-2">
              5. Hogyan törölhetők ezek az adatok?
            </h4>

            <p class="text-[#4A2E23]/80 dark:text-[#D4C7B0] leading-relaxed font-medium mb-3">
              A tárolt adatok bármikor törölhetők a böngésző beállításaiban. A törlés után előfordulhat,
              hogy újra be kell jelentkezni, vagy ismét megjelenik a cookie tájékoztató.
            </p>

            <ul class="space-y-2">
              <li class="bg-[#FBF5E9] dark:bg-[#1A1614] rounded-xl p-3 text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium">
                <span class="font-black text-[#4A2E23] dark:text-[#E5B326]">Chrome:</span>
                Beállítások → Adatvédelem és biztonság → Cookie-k és webhelyadatok
              </li>

              <li class="bg-[#FBF5E9] dark:bg-[#1A1614] rounded-xl p-3 text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium">
                <span class="font-black text-[#4A2E23] dark:text-[#E5B326]">Firefox:</span>
                Beállítások → Adatvédelem és biztonság → Cookie-k és webhelyadatok
              </li>

              <li class="bg-[#FBF5E9] dark:bg-[#1A1614] rounded-xl p-3 text-[#4A2E23]/80 dark:text-[#D4C7B0] font-medium">
                <span class="font-black text-[#4A2E23] dark:text-[#E5B326]">Safari:</span>
                Beállítások → Adatvédelem → Webhelyadatok kezelése
              </li>
            </ul>
          </div>
        </div>

        <div class="p-5 md:p-6 bg-[#FBF5E9] dark:bg-[#1A1614] border-t-4 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0">
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="showCookiePolicy = false"
              class="flex-1 bg-white dark:bg-[#26211E] hover:bg-gray-50 text-[#4A2E23] dark:text-[#FBF5E9] font-black py-3.5 rounded-full transition-all border-2 border-[#4A2E23] dark:border-[#E5B326] uppercase tracking-wider text-sm"
            >
              Vissza
            </button>

            <button
              @click="rejectCookie"
              class="flex-1 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-black py-3.5 rounded-full transition-all border-2 border-red-300 dark:border-red-500/40 uppercase tracking-wider text-sm"
            >
              Elutasítom
            </button>

            <button
              @click="acceptCookie"
              class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#4A2E23] font-black py-3.5 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase tracking-wider text-sm"
            >
              Elfogadom
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-enter-active,
.cookie-leave-active {
  transition: all 0.35s ease;
}

.cookie-enter-from,
.cookie-leave-to {
  opacity: 0;
  transform: translateY(110%);
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