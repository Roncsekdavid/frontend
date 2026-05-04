<script setup>
import { onMounted, ref } from 'vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import { scanState } from '../adminstate/scanState'
import { useRouter } from 'vue-router'

const barcodeInput = ref('')
const scannedCode = ref(null)
const scanStatus = ref(null) // 'success' | 'error' | null

const router = useRouter()


const state = scanState();

async function handleScan() {
  if (!barcodeInput.value.trim()) return

  scannedCode.value = barcodeInput.value.trim()

  try {
    await state.fetchOffer(scannedCode.value)

    if (state.getSelectedOffer() && state.getSelectedOffer().getStatus()==="ACCEPTED") {
      scanStatus.value = 'success'
    }else if(state.getSelectedOffer().getStatus()===("REJECTED"||"PENDING"||"EXPIRED")){
      scanStatus.value = 'rejected'
    }else if(state.getSelectedOffer().getStatus()==="USED"){
      scanStatus.value = 'used'
    }
     else {
      scanStatus.value = 'error'
    }
  } catch (error) {
    scanStatus.value = 'error'
    console.error(error)
  }
  console.log(state.getSelectedOffer())
  barcodeInput.value = ''
}

function handleKeydown(e) {
  if (e.key === 'Enter') handleScan()
}

function clearScan() {
  scannedCode.value = null
  scanStatus.value = null
  barcodeInput.value = ''
}

function goToCreateLoan() {
  const id = state.getSelectedOffer().getId()

  router.push(`/admin/offers/${id}/create-loan`)
}

</script>

<template>
  <div class="grid grid-cols-6 min-h-screen">
    <AdminMenu />

    <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
      <AdminHeader />

      <div class="max-w-3xl mx-auto mt-8">

        <!-- Cím -->
        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-[#051826] tracking-tight">Vonalkód beolvasás</h2>
          <p class="text-[#051826]/50 font-medium mt-1">Scanneld be az offer kódot vagy írd be manuálisan</p>
        </div>

        <!-- Scanner mező -->
        <div class="bg-white border-2 border-[#051826] rounded-3xl p-8 shadow-[6px_6px_0px_#051826] mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
              <i class="bi bi-upc-scan text-white text-xl"></i>
            </div>
            <span class="font-bold text-[#051826] text-lg">Beolvasó</span>
          </div>

          <!-- Vonalkód animáció -->
          <div class="relative bg-[#F7F8F0] border-2 border-dashed border-[#051826]/20 rounded-2xl h-36 flex items-center justify-center mb-6 overflow-hidden">
            <div class="scanner-line"></div>
            <div class="flex flex-col items-center gap-2 z-10">
              <i class="bi bi-upc text-5xl text-[#051826]/20"></i>
              <span class="text-sm font-bold text-[#051826]/30 uppercase tracking-widest">Kész a beolvasásra</span>
            </div>
          </div>

          <!-- Input -->
          <div class="flex gap-3">
            <input
              v-model="barcodeInput"
              @keydown.enter="handleKeydown"
              type="text"
              placeholder="OFR-xxxxxxxx-xxxxx"
              autofocus
              class="flex-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-mono text-[#051826] placeholder:text-[#051826]/30 focus:outline-none focus:border-blue-500 bg-white text-lg"
            />
            <button
              @click="handleScan"
              class="bg-[#051826] hover:bg-[#0a2d52] text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
            >
              <i class="bi bi-search mr-2"></i>Keresés
            </button>
            <button
              v-if="scannedCode"
              @click="clearScan"
              class="border-2 border-[#051826] text-[#051826] hover:bg-[#051826] hover:text-white font-bold px-4 py-3 rounded-xl transition-all"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Eredmény -->
        <transition name="fade">
          <div v-if="scannedCode" class="mb-6">

            <!-- Sikeres -->
            <div v-if="scanStatus === 'success'&&state.getSelectedOffer()"
              class="bg-white border-2 border-green-500 rounded-3xl p-6 shadow-[6px_6px_0px_#16a34a]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <i class="bi bi-check-lg text-white text-xl font-bold"></i>
                </div>
                <span class="font-extrabold text-green-700 text-lg">Ajánlat megtalálva</span>
              </div>
              <div class="bg-green-50 rounded-2xl p-4 font-mono text-green-800 text-sm mb-4">
                {{ scannedCode }}
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-[#F7F8F0] rounded-xl p-3">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase tracking-wider mb-1">Tárgy neve</p>
                  <p class="font-bold text-[#051826]">{{state.getSelectedOffer().getItem().getName()}}</p>
                </div>
                <div class="bg-[#F7F8F0] rounded-xl p-3">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase tracking-wider mb-1">Státusz</p>
                  <span class="inline-block bg-yellow-100 text-yellow-800 font-bold text-xs px-3 py-1 rounded-full">{{ state.getSelectedOffer().getStatus() }}</span>
                </div>
                <div class="bg-[#F7F8F0] rounded-xl p-3">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase tracking-wider mb-1">Összeg</p>
                  <p class="font-bold text-[#051826]">{{ state.getSelectedOffer()?.getLoanAmount() }}</p>
                </div>
                <div class="bg-[#F7F8F0] rounded-xl p-3">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase tracking-wider mb-1">Kamat</p>
                  <p class="font-bold text-[#051826]">{{ state.getSelectedOffer().getInterestRate() }}%</p>
                </div>
                <div>
                  <button class="bg-[#051826] hover:bg-[#0a2d52] text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95" @click="goToCreateLoan">Kölcsön létrehozása</button>
                </div>
              </div>
            </div>

            <!-- Hiba -->
            <div v-else-if="scanStatus === 'error'"
              class="bg-white border-2 border-red-400 rounded-3xl p-6 shadow-[6px_6px_0px_#ef4444]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <i class="bi bi-x-lg text-white text-xl"></i>
                </div>
                <div>
                  <p class="font-extrabold text-red-700">Ajánlat nem található</p>
                  <p class="text-red-400 font-mono text-sm">{{ scannedCode }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="scanStatus === 'rejected'"
              class="bg-white border-2 border-orange-400 rounded-3xl p-6 shadow-[6px_6px_0px_#ff8904]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center">
                  <i class="bi bi-exclamation-lg text-white text-xl"></i>
                </div>
                <div>
                  <p class="font-extrabold text-orange-500">Ajánlat nem elfogadott</p>
                  <p class="text-orange-400 font-mono text-sm">{{ scannedCode }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="scanStatus === 'used'"
              class="bg-white border-2 border-orange-400 rounded-3xl p-6 shadow-[6px_6px_0px_#ff8904]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center">
                  <i class="bi bi-exclamation-lg text-white text-xl"></i>
                </div>
                <div>
                  <p class="font-extrabold text-orange-500">Az ajánlathoz már tartozik kölcsön</p>
                  <p class="text-orange-400 font-mono text-sm">{{ scannedCode }}</p>
                </div>
              </div>
            </div>

          </div>
        </transition>

        

      </div>
    </div>
  </div>
</template>

<style scoped>
.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  animation: scan 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes scan {
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>