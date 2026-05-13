<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref, watch, computed } from 'vue';
import { adminState } from '../adminstate/state';

const kategoriaChart = ref(null);
const adminStore = adminState();
let chartInstance = null;

const props = defineProps({
  chartHeight: {
    type: String,
    default: "400"
  }
});

const isLoading = ref(true);
const approvedItems = computed(() => adminStore.getApprovedItems());
const hasData = computed(() => approvedItems.value && approvedItems.value.length > 0);

function renderChart() {
  if (!kategoriaChart.value || !hasData.value) {
    isLoading.value = false;
    return;
  }

  adminStore.calculateCategoryValues();
  adminStore.sortCategoriesByValueDesc();
  const top3 = adminStore.getTopThreeCategories();

  if (!top3 || top3.length === 0) {
    isLoading.value = false;
    return;
  }

  const labels = top3.map(item => item.getCategory());
  const values = top3.map(item => item.getAmount());

  if (chartInstance) chartInstance.destroy();
  
  chartInstance = new Chart(kategoriaChart.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Legértékesebb kategóriák',
        data: values,
        backgroundColor: 'rgba(0, 102, 204, 0.8)',
        borderColor: '#004aad',
        borderWidth: 2,
        borderRadius: 12,
        barThickness: 50,
        hoverBackgroundColor: 'rgba(0, 102, 204, 1)',
        hoverBorderColor: '#ffd700'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          borderColor: '#ffd700',
          borderWidth: 1,
          padding: 12,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            color: '#475569',
            callback: (value) => value.toLocaleString('hu-HU') + ' Ft'
          }
        },
        x: {
          ticks: { color: '#334155', font: { weight: '600' } },
          grid: { display: false }
        }
      }
    }
  });
  
  isLoading.value = false;
}

onMounted(() => {

  watch(() => adminStore.getApprovedItems(), () => {
    renderChart();
  }, { deep: true, immediate: true });
});
</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="relative w-full flex items-center justify-center">

    <div v-if="isLoading" class="flex flex-col items-center animate-pulse">
      <div class="flex items-end space-x-4 h-48 mb-4">
        <div class="w-12 bg-gray-200 rounded-t-lg h-24"></div>
        <div class="w-12 bg-gray-200 rounded-t-lg h-40"></div>
        <div class="w-12 bg-gray-200 rounded-t-lg h-16"></div>
      </div>
      <p class="text-gray-400 text-sm italic">Kategóriák elemzése...</p>
    </div>

    <div v-else-if="!hasData" class="text-center p-6">
      <i class="bi bi-bar-chart-steps text-5xl text-gray-300"></i>
      <h4 class="text-lg font-semibold text-gray-500 mt-2">Nincs elemzésre váró adat</h4>
      <p class="text-gray-400 text-sm">A jóváhagyott tárgyak statisztikája itt jelenik meg.</p>
    </div>

    <canvas 
      v-show="!isLoading && hasData" 
      ref="kategoriaChart" 
      class="w-full" 
      :height="chartHeight"
    ></canvas>
    
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