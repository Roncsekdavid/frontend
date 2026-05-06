<script setup>
import { computed } from 'vue';

const props = defineProps({
  loan: {
    type: Object, 
    required: true
  }
});

const emit = defineEmits(['open']);


const statusClass = computed(() => {
  const status = props.loan.getStatus()?.toUpperCase();
  switch (status) {
    case 'OVERDUE':
    case 'EXTENDED': 
      return 'bg-yellow-100 text-yellow-700 border-yellow-500'; 
    case 'DEFAULTED':
    case 'CLOSED': 
      return 'bg-red-100 text-red-700 border-red-500'; 
    case 'ACTIVE': 
      return 'bg-blue-100 text-blue-700 border-blue-500'; 
    case 'PAID': 
      return 'bg-emerald-100 text-emerald-700 border-emerald-500'; 
    default: 
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
});
</script>

<template>
  <div 
    class="bg-white rounded-[2rem] border-4 border-[#051826] shadow-[8px_8px_0px_#051826] hover:shadow-[12px_12px_0px_#051826] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full group"
    @click="emit('open', loan)"
  >
    <div class="p-6 border-b-2 border-gray-100 flex justify-between items-start">
      <div>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hitel azonosító</p>
        <h3 class="text-xl font-black text-[#051826]">#{{ loan.getId() }}</h3>
      </div>
      <span :class="['px-3 py-1 rounded-lg border-2 text-[10px] font-black uppercase shadow-sm transition-colors', statusClass]">
        {{ loan.getStatus() }}
      </span>
    </div>

    <div class="p-6 flex-1">
      <div class="mb-6">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hitelösszeg</p>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-[#051826]">{{ loan.getPrincipalAmount().toLocaleString('hu-HU') }}</span>
          <span class="text-sm font-bold text-gray-500">Ft</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Futamidő</p>
          <p class="font-bold text-[#051826] flex items-center gap-1">
            <i class="bi bi-clock-history"></i> {{ loan.getDurationMonths() }} hó
          </p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[9px] font-black text-slate-400 uppercase mb-1">Kamat</p>
          <p class="font-bold text-blue-600 flex items-center gap-1">
            <i class="bi bi-percent"></i> {{ loan.getInterestRate() }}%
          </p>
        </div>
      </div>
    </div>

    <div class="p-6 bg-slate-50 border-t-2 border-gray-100 mt-auto">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-gray-400 uppercase">Lejárat</span>
          <span :class="['text-xs font-bold', loan.getStatus() === 'OVERDUE' ? 'text-red-500' : 'text-gray-600']">
            {{ loan.getDueDate() }}
          </span>
        </div>
        <div class="w-10 h-10 rounded-full bg-[#051826] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
          <i class="bi bi-arrow-up-right text-lg"></i>
        </div>
      </div>

      <div v-if="loan.getStatus() === 'DEFAULTED' && loan.getDefaultReason()" 
           class="mt-4 p-3 bg-red-100/50 border-2 border-red-500 border-dashed rounded-xl">
        <p class="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Bedőlés oka:</p>
        <p class="text-[11px] font-bold text-red-800 italic leading-relaxed">
          "{{ loan.getDefaultReason() }}"
        </p>
      </div>
    </div>
  </div>
</template>