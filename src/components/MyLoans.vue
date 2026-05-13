<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const loans = ref([])
const loading = ref(true)
const errorMsg = ref('')

async function fetchLoans() {
  loading.value = true
  errorMsg.value = ''

  try {
    const { data } = await api.get('/loans/my-loans')
    loans.value = data
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'A hitelek betöltése sikertelen.'
  } finally {
    loading.value = false
  }
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'bg-green-100 text-green-700'
  if (status === 'EXTENDED') return 'bg-blue-100 text-blue-700'
  if (status === 'CLOSED') return 'bg-gray-100 text-gray-700'
  if (status === 'DEFAULTED') return 'bg-red-100 text-red-700'
  if (status === 'OVERDUE') return 'bg-yellow-100 text-yellow-700'
  return 'bg-[#E5B326] text-[#4A2E23]'
}
function statusLabel(status) {
  if (status === 'ACTIVE') return 'Aktív'
  if (status === 'EXTENDED') return 'Meghosszabbított'
  if (status === 'CLOSED') return 'Lezárt'
  if (status === 'DEFAULTED') return 'Meghiúsult'
  if (status === 'OVERDUE') return 'Lejárt'
  return status
}

onMounted(fetchLoans)
</script>

<template>
  <div class="bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-[8px_8px_0px_#4A2E23] dark:shadow-[8px_8px_0px_#E5B326] transition-colors">
    <h2 class="text-2xl md:text-3xl font-black text-[#4A2E23] dark:text-[#E5B326] uppercase mb-8 flex items-center">
      <i class="bi bi-cash-coin mr-3 md:mr-4 text-[#E5B326]"></i>
      Hiteleim
    </h2>

    <div v-if="errorMsg" class="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs font-bold text-center">
      {{ errorMsg }}
    </div>

    <div v-if="loading" class="font-black text-[#4A2E23]/50 dark:text-[#D4C7B0]/50 text-center py-12">
      Hitelek betöltése...
    </div>

    <div v-else-if="loans.length" class="space-y-5">
      <div
        v-for="loan in loans"
        :key="loan.id"
        class="bg-gray-50 dark:bg-[#1A1614] border-2 border-[#4A2E23]/20 dark:border-[#E5B326]/20 rounded-[25px] p-5 transition-colors"
      >
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
          <div>
            <h3 class="text-xl font-black text-[#4A2E23] dark:text-[#FBF5E9]">
              {{ loan.offers?.items?.name || 'Kölcsön' }}
            </h3>
            <p class="text-sm font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
              Létrehozva: {{ new Date(loan.created_at).toLocaleDateString('hu-HU') }}
            </p>
          </div>

          <span
            class="self-start font-black text-xs px-3 py-1 rounded-full"
            :class="statusClass(loan.status)"
          >
            {{ statusLabel(loan.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Kölcsönösszeg</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">{{ loan.principal_amount.toLocaleString('hu-HU') }} Ft</p>
          </div>

          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Futamidő</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">{{ loan.duration_months }} hónap</p>
          </div>

          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Kezdés</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
              {{ new Date(loan.start_date).toLocaleDateString('hu-HU') }}
            </p>
          </div>

          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Lejárat</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
              {{ new Date(loan.due_date).toLocaleDateString('hu-HU') }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Kamatláb</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">{{ loan.interest_rate }} %</p>
          </div>

          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Havi törlesztő</p>
            <p class="font-black text-[#E5B326]">
              {{ Math.round(loan.principal_amount * (1 + loan.interest_rate / 100) / loan.duration_months).toLocaleString('hu-HU') }} Ft
            </p>
          </div>

          <div class="bg-white dark:bg-[#26211E] rounded-2xl p-4 border-2 border-[#4A2E23]/10 dark:border-[#E5B326]/10">
            <p class="text-xs font-black text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase">Visszafizetendő végösszeg</p>
            <p class="font-black text-[#4A2E23] dark:text-[#FBF5E9]">
              {{ Math.round(loan.principal_amount * (1 + loan.interest_rate / 100)).toLocaleString('hu-HU') }} Ft
            </p>
          </div>
        </div>

        <p v-if="loan.note" class="mt-4 text-sm font-bold text-[#4A2E23]/60 dark:text-[#D4C7B0]/60">
          {{ loan.note }}
        </p>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-[#1A1614] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30">
        <i class="bi bi-cash-coin text-3xl text-gray-300 dark:text-[#D4C7B0]/30"></i>
      </div>
      <p class="font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 uppercase tracking-wide text-sm">
        Jelenleg nincs aktív hiteled
      </p>
    </div>
  </div>
</template>