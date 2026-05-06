<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminHeader from '../admincomponents/AdminHeader.vue'
import AdminMenu from '../admincomponents/AdminMenu.vue'
import api from '../services/api'

const sales = ref([])
const loading = ref(true)
const errorMsg = ref('')

const activeFilter = ref('ALL')
const activeModal = ref(null) // null, 'sold', 'cancel', 'price'
const selectedSale = ref(null)

const salePriceInput = ref('')
const cancelReason = ref('')
const isProcessing = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const filters = [
  { value: 'ALL', label: 'Összes', icon: 'bi-grid-fill' },
  { value: 'LISTED', label: 'Eladás alatt', icon: 'bi-tag-fill' },
  { value: 'SOLD', label: 'Eladva', icon: 'bi-bag-check-fill' },
  { value: 'CANCELLED', label: 'Visszavonva', icon: 'bi-x-circle-fill' }
]

const statusMap = {
  LISTED: {
    label: 'Eladás alatt',
    cls: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  SOLD: {
    label: 'Eladva',
    cls: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  },
  CANCELLED: {
    label: 'Visszavonva',
    cls: 'bg-red-100 text-red-600 border-red-300'
  }
}

const filteredSales = computed(() => {
  if (activeFilter.value === 'ALL') return sales.value
  return sales.value.filter(sale => sale.status === activeFilter.value)
})

async function fetchSales() {
  loading.value = true
  errorMsg.value = ''

  try {
    const { data } = await api.get('/sales')
    sales.value = data
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Az eladások lekérése sikertelen.'
  } finally {
    loading.value = false
  }
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('hu-HU') + ' Ft'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('hu-HU')
}

function primaryImage(sale) {
  const images = sale.items?.item_images || []
  const primary = images.find(img => img.is_primary)
  return primary?.url || images[0]?.url || null
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

function openSoldModal(sale) {
  if (sale.status !== 'LISTED') return

  selectedSale.value = sale
  salePriceInput.value = sale.sale_price
  activeModal.value = 'sold'
}

function openPriceModal(sale) {
  if (sale.status !== 'LISTED') return

  selectedSale.value = sale
  salePriceInput.value = sale.sale_price
  activeModal.value = 'price'
}

function openCancelModal(sale) {
  if (sale.status !== 'LISTED') return

  selectedSale.value = sale
  cancelReason.value = ''
  activeModal.value = 'cancel'
}

function closeModal() {
  activeModal.value = null
  selectedSale.value = null
  salePriceInput.value = ''
  cancelReason.value = ''
}

async function confirmSold() {
  if (!selectedSale.value) return

  if (!salePriceInput.value || Number(salePriceInput.value) <= 0) {
    showToast('Adj meg érvényes eladási árat!', 'error')
    return
  }

  isProcessing.value = true

  try {
    await api.patch(`/sales/${selectedSale.value.id}/sold`, {
      sale_price: Number(salePriceInput.value)
    })

    showToast('Eladás sikeresen eladottnak jelölve.')
    closeModal()
    await fetchSales()
  } catch (error) {
    const msg = error.response?.data?.error || 'Az eladás lezárása sikertelen.'
    showToast(msg, 'error')
  } finally {
    isProcessing.value = false
  }
}

async function confirmPriceUpdate() {
  if (!selectedSale.value) return

  if (!salePriceInput.value || Number(salePriceInput.value) <= 0) {
    showToast('Adj meg érvényes eladási árat!', 'error')
    return
  }

  isProcessing.value = true

  try {
    await api.patch(`/sales/${selectedSale.value.id}/price`, {
      sale_price: Number(salePriceInput.value)
    })

    showToast('Eladási ár módosítva.')
    closeModal()
    await fetchSales()
  } catch (error) {
    const msg = error.response?.data?.error || 'Az ár módosítása sikertelen.'
    showToast(msg, 'error')
  } finally {
    isProcessing.value = false
  }
}

async function confirmCancel() {
  if (!selectedSale.value) return

  isProcessing.value = true

  try {
    await api.patch(`/sales/${selectedSale.value.id}/cancel`, {
      reason: cancelReason.value.trim()
    })

    showToast('Eladás visszavonva.')
    closeModal()
    await fetchSales()
  } catch (error) {
    const msg = error.response?.data?.error || 'Az eladás visszavonása sikertelen.'
    showToast(msg, 'error')
  } finally {
    isProcessing.value = false
  }
}

onMounted(fetchSales)
</script>

<template>
  <div class="grid grid-cols-6 min-h-screen relative">
    <AdminMenu />

    <div class="w-full bg-[#F7F8F0] col-span-6 md:col-span-4 lg:col-span-5 p-6 relative">
      <AdminHeader />

      <div class="max-w-6xl mx-auto mt-8 p-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 class="text-4xl font-black text-[#051826]">Eladások</h2>
            <p class="font-bold text-[#051826]/40 mt-1">
              Nemfizetés után eladásra került zálogtárgyak kezelése.
            </p>
          </div>

          <button
            @click="fetchSales"
            class="bg-white border-4 border-[#051826] px-5 py-3 rounded-xl font-black text-[#051826] shadow-[4px_4px_0px_#051826] active:translate-y-1 active:shadow-none transition-all uppercase text-xs"
          >
            <i class="bi bi-arrow-clockwise mr-2"></i>
            Frissítés
          </button>
        </div>

        <div v-if="errorMsg" class="mb-6 bg-red-100 border-4 border-red-300 text-red-700 p-4 rounded-2xl font-black text-center">
          {{ errorMsg }}
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="inline-flex items-center gap-2 text-[11px] font-black uppercase px-4 py-2 rounded-full border-4 transition-all"
            :class="activeFilter === filter.value
              ? 'bg-[#E5B326] border-[#051826] text-[#051826] shadow-[3px_3px_0px_#051826]'
              : 'bg-white border-[#051826]/20 text-[#051826]/50 hover:border-[#051826]'"
          >
            <i class="bi" :class="filter.icon"></i>
            {{ filter.label }}
            <span class="bg-[#051826]/10 rounded-full px-2">
              {{ filter.value === 'ALL' ? sales.length : sales.filter(s => s.status === filter.value).length }}
            </span>
          </button>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 border-8 border-gray-200 border-t-[#051826] rounded-full animate-spin mb-4"></div>
          <p class="font-black text-[#051826] uppercase tracking-tight">Eladások betöltése...</p>
        </div>

        <div v-else-if="filteredSales.length === 0" class="bg-white border-4 border-[#051826] rounded-[2rem] p-12 text-center shadow-[8px_8px_0px_#051826]">
          <i class="bi bi-tags text-5xl text-gray-300"></i>
          <p class="font-black text-gray-400 uppercase mt-4">
            Nincs megjeleníthető eladás
          </p>
        </div>

        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div
            v-for="sale in filteredSales"
            :key="sale.id"
            class="bg-white border-4 border-[#051826] rounded-[2rem] p-5 shadow-[6px_6px_0px_#051826]"
          >
            <div class="flex flex-col sm:flex-row gap-5">
              <div class="w-full sm:w-40 h-40 rounded-2xl border-4 border-[#051826] overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  v-if="primaryImage(sale)"
                  :src="primaryImage(sale)"
                  :alt="sale.items?.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="bi bi-image text-4xl text-gray-300"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 class="text-xl font-black text-[#051826] leading-tight">
                      {{ sale.items?.name || 'Ismeretlen tárgy' }}
                    </h3>
                    <p class="text-sm font-bold text-[#051826]/40">
                      {{ sale.items?.users?.name || 'Ismeretlen ügyfél' }}
                    </p>
                  </div>

                  <span
                    class="text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 whitespace-nowrap"
                    :class="statusMap[sale.status]?.cls || 'bg-gray-100 text-gray-500 border-gray-300'"
                  >
                    {{ statusMap[sale.status]?.label || sale.status }}
                  </span>
                </div>

                <p class="text-sm text-[#051826]/60 font-medium line-clamp-2 mb-4">
                  {{ sale.items?.description }}
                </p>

                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-3">
                    <p class="text-[10px] font-black text-gray-400 uppercase">Eladási ár</p>
                    <p class="font-black text-[#051826]">{{ formatPrice(sale.sale_price) }}</p>
                  </div>

                  <div class="bg-gray-50 border-2 border-gray-100 rounded-xl p-3">
                    <p class="text-[10px] font-black text-gray-400 uppercase">Dátum</p>
                    <p class="font-black text-[#051826]">{{ formatDate(sale.sale_date) }}</p>
                  </div>
                </div>

                <div v-if="sale.status === 'LISTED'" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    @click="openSoldModal(sale)"
                    class="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl border-4 border-[#051826] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none transition-all uppercase text-[10px]"
                  >
                    Eladva
                  </button>

                  <button
                    @click="openPriceModal(sale)"
                    class="bg-[#E5B326] hover:bg-[#d0a01e] text-[#051826] font-black py-3 rounded-xl border-4 border-[#051826] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none transition-all uppercase text-[10px]"
                  >
                    Ár módosítás
                  </button>

                  <button
                    @click="openCancelModal(sale)"
                    class="bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl border-4 border-[#051826] shadow-[3px_3px_0px_#051826] active:translate-y-1 active:shadow-none transition-all uppercase text-[10px]"
                  >
                    Visszavonás
                  </button>
                </div>

                <div v-else class="bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-center">
                  <p class="font-black text-gray-400 uppercase text-xs">
                    Nincs elérhető művelet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="activeModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051826]/40 backdrop-blur-sm"
      >
        <div class="bg-white border-4 border-[#051826] rounded-[2rem] p-8 max-w-md w-full shadow-[12px_12px_0px_#051826] animate-popIn">
          <template v-if="activeModal === 'sold'">
            <h3 class="text-2xl font-black text-emerald-600 mb-4">Eladás lezárása</h3>
            <p class="text-gray-600 font-bold mb-5">
              Biztosan eladottnak jelölöd ezt a tárgyat?
            </p>

            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Végleges eladási ár
            </label>
            <input
              v-model="salePriceInput"
              type="number"
              min="1"
              class="w-full border-4 border-[#051826] rounded-xl p-3 font-black focus:outline-none focus:border-emerald-500 mb-6"
            />

            <div class="flex gap-4">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl"
              >
                Mégse
              </button>
              <button
                @click="confirmSold"
                :disabled="isProcessing"
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826]"
              >
                Eladva
              </button>
            </div>
          </template>

          <template v-if="activeModal === 'price'">
            <h3 class="text-2xl font-black text-[#051826] mb-4">Eladási ár módosítása</h3>

            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Új eladási ár
            </label>
            <input
              v-model="salePriceInput"
              type="number"
              min="1"
              class="w-full border-4 border-[#051826] rounded-xl p-3 font-black focus:outline-none focus:border-[#E5B326] mb-6"
            />

            <div class="flex gap-4">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl"
              >
                Mégse
              </button>
              <button
                @click="confirmPriceUpdate"
                :disabled="isProcessing"
                class="flex-1 bg-[#E5B326] hover:bg-[#d0a01e] text-[#051826] font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826]"
              >
                Mentés
              </button>
            </div>
          </template>

          <template v-if="activeModal === 'cancel'">
            <h3 class="text-2xl font-black text-red-600 mb-4">Eladás visszavonása</h3>
            <p class="text-gray-600 font-bold mb-5">
              A tárgy visszakerül APPROVED státuszba.
            </p>

            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Indoklás
            </label>
            <textarea
              v-model="cancelReason"
              rows="3"
              placeholder="Pl: hibásan került eladásra..."
              class="w-full border-4 border-[#051826] rounded-xl p-3 font-medium focus:outline-none focus:border-red-500 resize-none mb-6"
            ></textarea>

            <div class="flex gap-4">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 font-black py-3 border-4 border-[#051826] rounded-xl"
              >
                Mégse
              </button>
              <button
                @click="confirmCancel"
                :disabled="isProcessing"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-3 border-4 border-[#051826] rounded-xl shadow-[4px_4px_0px_#051826]"
              >
                Visszavonás
              </button>
            </div>
          </template>
        </div>
      </div>

      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-8 right-8 z-50 border-4 border-[#051826] rounded-xl p-4 shadow-[6px_6px_0px_#051826] flex items-center gap-3 animate-slideIn',
          toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        ]"
      >
        <i :class="toast.type === 'error' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-check-circle-fill'"></i>
        <span class="font-black tracking-wide">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-popIn {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-slideIn {
  animation: slideIn 0.4s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>