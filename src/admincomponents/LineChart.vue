<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref } from 'vue';
import { adminState } from '../adminstate/state';

const bevetelChart = ref(null);
const adminStore = adminState();
const incomeByDate = ref([]);

const isChartLoading = ref(true);

const props = defineProps({
  chartHeight: {
    type: String,
    default: "300"
  }
});

onMounted(async () => {
  isChartLoading.value = true;
  
  try {
    await adminStore.getForSaleItemsFromApi();
    adminStore.calculateIncomeByDate();
    incomeByDate.value = adminStore.getIncomeByDate();

    const labels = [];
    const values = [];

    for (let i = 0; i < incomeByDate.value.length; i++) {
      labels.push(incomeByDate.value[i].getDate());
      values.push(incomeByDate.value[i].getIncome());
    }

    new Chart(bevetelChart.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Piacon levő tárgy",
            data: values,
            borderColor: "#1A4D8F",
            backgroundColor: "rgba(26, 77, 143, 0.15)",
            tension: 0.35,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: "#D4AF37",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            borderWidth: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(10, 26, 47, 0.9)",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 12,
            borderWidth: 1,
            borderColor: "#D4AF37",
            cornerRadius: 8
          },
          title: {
            display: true,
            text: "Piacon lévő tárgyak értékei és dátuma",
            color: "#0A1A2F",
            font: { size: 20, weight: "bold", family: "Inter, sans-serif" },
            padding: 20
          }
        },
        scales: {
          x: {
            ticks: { color: "#1A1A1A", font: { size: 14 } },
            grid: { display: false }
          },
          y: {
            ticks: { color: "#1A1A1A", font: { size: 14 } },
            grid: { color: "rgba(0,0,0,0.05)" }
          }
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart"
        }
      }
    });
  } catch (error) {
    console.error("Hiba a grafikon kirajzolásakor:", error);
  } finally {
    setTimeout(() => {
      isChartLoading.value = false;
    }, 400);
  }
});
</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="w-full relative overflow-hidden">
    
    <div v-if="isChartLoading" 
         class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 transition-opacity duration-300">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-[#1A4D8F] rounded-full animate-spin mb-2"></div>
      <p class="text-[10px] font-black text-[#1A4D8F] uppercase tracking-widest animate-pulse">Grafikon rajzolása...</p>
    </div>

    <canvas 
      ref="bevetelChart" 
      class="w-full" 
      :class="{ 'opacity-0': isChartLoading, 'opacity-100 transition-opacity duration-700': !isChartLoading }"
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