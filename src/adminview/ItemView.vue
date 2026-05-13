<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import api from '../services/api'
import { adminState } from '../adminstate/state'

const router = useRouter()
const route = useRoute()

const item = ref(null)
const isLoading = ref(true)
const loadError = ref(false)

const state = adminState()

const loanAmount = ref('')
const interestRate = ref('')
const note = ref('')
const sending = ref(false)

const offerErrorMessage = ref('')
const offerSuccessMessage = ref('')

async function sendOffer() {
  if (sending.value) return
  sending.value = true
  offerErrorMessage.value = ''
  offerSuccessMessage.value = ''

  try {
    const offerData = {
      item_id: item.value.getId(),
      loan_amount: loanAmount.value,
      interest_rate: interestRate.value,
      note: note.value
    }
    await api.post('/offers', offerData)
    offerSuccessMessage.value = 'Ajánlat sikeresen elküldve.'
    setTimeout(() => {
            router.push('/admin/items')
        }, 800)
  } catch (error) {
    offerErrorMessage.value = error.response?.data?.error || 'Az ajánlat küldése sikertelen.'
    console.error(error)
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    item.value = await state.fetchItemByIdAdmin(route.params.id)
  } catch (error) {
    console.error(error)
    loadError.value = true
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }
})
</script>

<template>
  <div class="grid grid-cols-6 min-h-screen">
    <AdminMenu />

    <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
      <AdminHeader />

      <div class="max-w-5xl mx-auto mt-8">
                <div v-if="isLoading" class="flex flex-col items-center justify-center h-[70vh]">
          <div class="w-20 h-20 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-6"></div>
          <h2 class="text-2xl font-black text-[#051826] animate-pulse uppercase tracking-widest">
            Adatok lekérése...
          </h2>
        </div>

        <main v-else-if="item" class="animate__animated animate__fadeIn">
          <div class="mb-8">
            <h2 class="text-3xl font-extrabold text-[#051826] tracking-tight">
              Tárgy részletei
            </h2>
            <p class="text-[#051826]/50 font-medium mt-1">
              Ellenőrizd a tárgyat, majd küldj ajánlatot az ügyfélnek
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
                  <i class="bi bi-box-seam text-white text-xl"></i>
                </div>
                <span class="font-bold text-[#051826] text-lg">Tárgy adatai</span>
              </div>

              <div class="mb-5">
                <div v-if="item.getItemImages()?.length">
                  <img :src="item.getPrimaryImage()" class="w-full h-56 object-cover rounded-2xl border-2 border-[#051826] mb-3" />
                  <div class="flex gap-2 overflow-x-auto">
                    <img v-for="img in item.getItemImages()" :key="img.id" :src="img.url" class="w-16 h-16 object-cover rounded-xl border-2 border-[#051826]/30" />
                  </div>
                </div>
                <div v-else class="h-56 flex items-center justify-center bg-[#F7F8F0] rounded-2xl border-2 border-dashed border-[#051826]/30">
                  <span class="text-[#051826]/40 font-bold">Nincs kép</span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="bg-[#F7F8F0] rounded-xl p-4">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Név</p>
                  <p class="font-bold text-[#051826]">{{ item.getName() }}</p>
                </div>
                <div class="bg-[#F7F8F0] rounded-xl p-4">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Leírás</p>
                  <p class="font-bold text-[#051826]">{{ item.getDescription() }}</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-[#F7F8F0] rounded-xl p-4">
                    <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Kívánt összeg</p>
                    <p class="font-bold text-[#051826]">{{ item.getEstimatedValue().toLocaleString() }} Ft</p>
                  </div>
                  <div class="bg-[#F7F8F0] rounded-xl p-4">
                    <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Státusz</p>
                    <p class="font-bold text-[#051826]">{{ item.getStatus() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
                  <i class="bi bi-send text-white text-xl"></i>
                </div>
                <span class="font-bold text-[#051826] text-lg">Ajánlat küldése</span>
              </div>

              <div class="space-y-4">
                <div v-if="offerErrorMessage" class="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-red-700 font-bold">
                  {{ offerErrorMessage }}
                </div>
                <div v-if="offerSuccessMessage" class="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-green-700 font-bold">
                  {{ offerSuccessMessage }}
                </div>

                <div>
                  <label class="text-sm font-bold text-[#051826]">Kölcsönösszeg (Ft)</label>
                  <input v-model="loanAmount" type="number" class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold" />
                </div>
                <div>
                  <label class="text-sm font-bold text-[#051826]">Kamat (%)</label>
                  <input v-model="interestRate" type="number" step="0.1" class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold" />
                </div>
                <div>
                  <label class="text-sm font-bold text-[#051826]">Megjegyzés</label>
                  <textarea v-model="note" rows="4" class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 resize-none"></textarea>
                </div>

                <div class="flex gap-3 pt-3">
                  <button @click="router.back()" class="border-2 border-[#051826] font-bold px-6 py-3 rounded-xl hover:bg-gray-100">Vissza</button>
                  <button @click="sendOffer" :disabled="sending" class="bg-[#051826] text-white font-bold px-6 py-3 rounded-xl flex-1 disabled:opacity-50">
                    {{ sending ? 'Küldés...' : 'Ajánlat küldése' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div v-else class="bg-white border-2 border-red-400 rounded-3xl p-10 text-center shadow-[6px_6px_0px_#ef4444]">
          <i class="bi bi-exclamation-triangle text-5xl text-red-500 mb-4 block"></i>
          <p class="font-extrabold text-red-700 text-xl">A keresett tárgy nem található.</p>
          <button @click="router.back()" class="mt-6 bg-red-600 text-white font-bold px-8 py-3 rounded-xl">Vissza a listához</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>