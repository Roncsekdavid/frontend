<script setup>
import { onMounted, ref, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import api from '../services/api'

const offers = ref([])
const loading = ref(true)
const errorMsg = ref('')
const successMsg = ref('')
const actionLoading = ref(null)
const selectedOffer = ref(null)

const statusMap = {
  PENDING: { label: 'Függőben', cls: 'bg-[#E5B326] text-[#4A2E23]' },
  ACCEPTED: { label: 'Elfogadva', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  REJECTED: { label: 'Elutasítva', cls: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
}

async function fetchOffers() {
  loading.value = true
  errorMsg.value = ''

  try {
    const { data } = await api.get('/offers/my')
    offers.value = data
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Az ajánlatok betöltése sikertelen.'
  } finally {
    loading.value = false
  }
}

async function acceptOffer(id) {
  actionLoading.value = id
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await api.patch(`/offers/${id}/accept`)
    successMsg.value = 'Ajánlat elfogadva.'
    await fetchOffers()
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Az ajánlat elfogadása sikertelen.'
  } finally {
    actionLoading.value = null
  }
}

async function rejectOffer(id) {
  actionLoading.value = id
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await api.patch(`/offers/${id}/reject`)
    successMsg.value = 'Ajánlat elutasítva.'
    await fetchOffers()
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Az ajánlat elutasítása sikertelen.'
  } finally {
    actionLoading.value = null
  }
}

function openBarcodeModal(offer) {
  if (offer.status !== 'ACCEPTED' || !offer.offer_code) return

  selectedOffer.value = offer

  nextTick(() => {
    JsBarcode('#modal-barcode', offer.offer_code, {
      format: 'CODE128',
      width: window.innerWidth < 500 ? 1 : 2,
      height: 90,
      displayValue: true,
    })
  })
}

function closeBarcodeModal() {
  selectedOffer.value = null
}

onMounted(fetchOffers)
</script>

<template>
  <div class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">
    <h2 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-8 flex items-center">
      <i class="bi bi-envelope-paper mr-3 md:mr-4 text-[#E5B326]"></i>
      Bejövő ajánlatok
    </h2>

    <div v-if="errorMsg" class="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs font-bold text-center">
      {{ errorMsg }}
    </div>

    <div v-if="successMsg" class="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 p-3 rounded-2xl text-xs font-bold text-center">
      {{ successMsg }}
    </div>

    <div v-if="loading" class="font-black text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 text-center py-12">
      Ajánlatok betöltése...
    </div>

    <div v-else-if="offers.length" class="space-y-5">
      <div
        v-for="offer in offers"
        :key="offer.id"
        @click="openBarcodeModal(offer)"
        class="bg-gray-50 dark:bg-[#1A1614] border-2 border-[#4A2E23]/20 dark:border-[#E5B326]/20 rounded-[25px] p-5 transition-colors"
        :class="offer.status === 'ACCEPTED' && offer.offer_code ? 'cursor-pointer hover:border-green-400' : ''"
      >
        <div class="flex flex-col lg:flex-row gap-5">
          <img
            v-if="offer.items?.item_images?.length"
            :src="offer.items.item_images.find(img => img.is_primary)?.url || offer.items.item_images[0].url"
            class="w-full lg:w-40 h-40 object-cover rounded-2xl border-2 border-[#4A2E23] dark:border-[#E5B326]"
          />

          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <h3 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                  {{ offer.items?.name }}
                </h3>
                <p class="text-sm font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
                  {{ offer.items?.description }}
                </p>
              </div>

              <span
                class="self-start font-black text-xs px-3 py-1 rounded-full"
                :class="statusMap[offer.status]?.cls ?? 'bg-gray-100 text-gray-500'"
              >
                {{ statusMap[offer.status]?.label ?? offer.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
                <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">
                  Ajánlott összeg
                </p>
                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                  {{ offer.loan_amount }} Ft
                </p>
              </div>

              <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
                <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">
                  Kamat
                </p>
                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                  {{ offer.interest_rate }}%
                </p>
              </div>

              <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
                <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">
                  Lejárat
                </p>
                <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
                  {{ new Date(offer.expires_at).toLocaleDateString('hu-HU') }}
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-5">
              <template v-if="offer.status === 'PENDING'">
                <button
                  @click.stop="acceptOffer(offer.id)"
                  :disabled="actionLoading === offer.id"
                  class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] disabled:opacity-50 text-[#4A2E23] font-black py-3 rounded-full transition-all shadow-[0px_4px_0px_#a9841c] active:shadow-none active:translate-y-1 uppercase"
                >
                  Elfogadás
                </button>

                <button
                  @click.stop="rejectOffer(offer.id)"
                  :disabled="actionLoading === offer.id"
                  class="flex-1 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-600 font-black py-3 rounded-full transition-all uppercase"
                >
                  Elutasítás
                </button>
              </template>

              <button
                v-else-if="offer.status === 'ACCEPTED' && offer.offer_code"
                @click.stop="openBarcodeModal(offer)"
                class="w-full bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 font-black py-3 rounded-full transition-all uppercase"
              >
                Vonalkód megnyitása
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-[#1A1614] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30">
        <i class="bi bi-envelope-open text-3xl text-gray-300 dark:text-[#D4C7B0]/30"></i>
      </div>
      <p class="font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wide text-sm">
        Nincs bejövő ajánlatod
      </p>
    </div>
  </div>

  <Transition name="modal">
    <div
      v-if="selectedOffer"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeBarcodeModal"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div class="relative bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[35px] p-8 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] max-w-xl w-full text-center">
        <button
          @click="closeBarcodeModal"
          class="absolute top-4 right-5 text-3xl font-black text-[#4A2E23] dark:text-[#E5B326]"
        >
          ×
        </button>

        <h3 class="text-2xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-2">
          Átvételi vonalkód
        </h3>

        <p class="font-bold text-[#4A2E23]/60 dark:text-[#D4C7B0]/60 mb-6">
          {{ selectedOffer.items?.name }}
        </p>

        <div class="bg-white rounded-2xl p-5 border-2 border-[#4A2E23]/10 flex justify-center overflow-hidden">
          <svg
            id="modal-barcode"
            class="w-full max-w-full h-auto"
          ></svg>
        </div>

        <p class="mt-4 font-black text-[#4A2E23] dark:text-[#FBF5E9] tracking-widest">
          {{ selectedOffer.offer_code }}
        </p>
      </div>
    </div>
  </Transition>
</template>