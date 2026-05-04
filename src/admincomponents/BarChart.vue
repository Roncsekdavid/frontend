<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';
import { adminState } from '../adminstate/state';

const kategoriaChart = ref(null);
const adminStore = adminState();
let chartInstance = null;

const props = defineProps({
  chartHeight: String
});

function renderChart() {
  if (!kategoriaChart.value) return;
  
  const approvedItems = adminStore.getApprovedItems();
  if (!approvedItems || approvedItems.length === 0) return;

  adminStore.calculateCategoryValues();
  adminStore.sortCategoriesByValueDesc();
  const top3 = adminStore.getTopThreeCategories();

  const labels = [];
  const values = [];

  for (let i = 0; i < top3.length; i++) {
    labels.push(top3[i].getCategory());
    values.push(top3[i].getAmount());
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(kategoriaChart.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Legértékesebb kategóriák',
          data: values,
          backgroundColor: 'rgba(0, 102, 204, 0.8)',
          borderColor: '#004aad',
          borderWidth: 2,
          borderRadius: 12,
          barThickness: 50,
          hoverBackgroundColor: 'rgba(0, 102, 204, 1)',
          hoverBorderColor: '#ffd700'
        }
      ]
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
          titleColor: '#fff',
          bodyColor: '#fff',
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
          ticks: {
            color: '#334155',
            font: { weight: '600' }
          },
          grid: { display: false }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });
}

onMounted(() => {
  watch(() => adminStore.getApprovedItems(), () => {
    renderChart();
  }, { deep: true, immediate: true });
});
</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="w-full">
    <canvas ref="kategoriaChart" class="w-full" :height="chartHeight"></canvas>
  </div>
</template>

<style scoped></style>