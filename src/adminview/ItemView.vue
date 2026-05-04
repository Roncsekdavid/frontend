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

const loading = ref(true)
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
  } catch (error) {
    offerErrorMessage.value =
      error.response?.data?.error || 'Az ajánlat küldése sikertelen.'

    console.error(error)
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  try {
    item.value = await state.fetchItemByIdAdmin(route.params.id)
    console.log('USER ID:', item.user_id)
  } catch (error) {
    console.error(error)
    loadError.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid grid-cols-6 min-h-screen">
    <AdminMenu />

    <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6">
      <AdminHeader />

      <div class="max-w-5xl mx-auto mt-8">
        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-[#051826] tracking-tight">
            Tárgy részletei
          </h2>
          <p class="text-[#051826]/50 font-medium mt-1">
            Ellenőrizd a tárgyat, majd küldj ajánlatot az ügyfélnek
          </p>
        </div>

        <div v-if="loading" class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
          <p class="font-bold text-[#051826]">Ajánlat betöltése...</p>
        </div>

        <div v-else-if="item" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white border-2 border-[#051826] rounded-3xl p-6 shadow-[6px_6px_0px_#051826]">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 bg-[#051826] rounded-xl flex items-center justify-center">
                <i class="bi bi-box-seam text-white text-xl"></i>
              </div>
              <span class="font-bold text-[#051826] text-lg">Tárgy adatai</span>
            </div>

            <div class="mb-5">
              <div v-if="item.getItemImages()?.length">
                <img :src="item.getPrimaryImage()"
                  class="w-full h-56 object-cover rounded-2xl border-2 border-[#051826] mb-3" />

                <div class="flex gap-2 overflow-x-auto">
                  <img v-for="img in item.getItemImages()" :key="img.id" :src="img.url"
                    class="w-16 h-16 object-cover rounded-xl border-2 border-[#051826]/30" />
                </div>
              </div>

              <div v-else
                class="h-56 flex items-center justify-center bg-[#F7F8F0] rounded-2xl border-2 border-dashed border-[#051826]/30">
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
                  <p class="font-bold text-[#051826]">{{ item.getEstimatedValue() }} Ft</p>
                </div>

                <div class="bg-[#F7F8F0] rounded-xl p-4">
                  <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Státusz</p>
                  <p class="font-bold text-[#051826]">{{ item.getStatus() }}</p>
                </div>
              </div>

              <div class="bg-[#F7F8F0] rounded-xl p-4">
                <p class="text-xs font-bold text-[#051826]/40 uppercase mb-1">Feltöltés dátuma</p>
                <p class="font-bold text-[#051826]">{{ item.getUploadDate() }}</p>
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
              <div v-if="offerErrorMessage"
                class="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-red-700 font-bold">
                {{ offerErrorMessage }}
              </div>

              <div v-if="offerSuccessMessage"
                class="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-green-700 font-bold">
                {{ offerSuccessMessage }}
              </div>

              <div>
                <label class="text-sm font-bold text-[#051826]">Kölcsönösszeg</label>
                <input v-model="loanAmount" type="number" min="0" placeholder="Pl. 50000"
                  class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826]" />
              </div>

              <div>
                <label class="text-sm font-bold text-[#051826]">Kamat (%)</label>
                <input v-model="interestRate" type="number" min="0" step="0.1" placeholder="Pl. 5.5"
                  class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 font-bold text-[#051826]" />
              </div>

              <div>
                <label class="text-sm font-bold text-[#051826]">Megjegyzés</label>
                <textarea v-model="note" rows="4" placeholder="Pl. értékbecslés alapján..."
                  class="w-full mt-1 border-2 border-[#051826] rounded-xl px-4 py-3 resize-none"></textarea>
              </div>

              <div class="flex gap-3 pt-3">
                <button @click="router.back()"
                  class="border-2 border-[#051826] text-[#051826] hover:bg-[#051826] hover:text-white font-bold px-6 py-3 rounded-xl">
                  Vissza
                </button>

                <button @click="sendOffer" :disabled="sending"
                  class="bg-[#051826] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl flex-1">
                  {{ sending ? 'Küldés...' : 'Ajánlat küldése' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white border-2 border-red-400 rounded-3xl p-6 shadow-[6px_6px_0px_#ef4444]">
          <p class="font-extrabold text-red-700">
            Nincs kiválasztott tárgy.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>