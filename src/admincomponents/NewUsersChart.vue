<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref, nextTick, watch } from 'vue';
import { adminState } from '../adminstate/state';

const chartRef = ref(null);
const adminStore = adminState();

const props = defineProps({
  chartHeight: String
});

let chartInstance = null;

async function initChart() {
  const data = adminStore.getNewUsersByDate();

  const labels = data.map(item => item.date);
  const values = data.map(item => item.count);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Új felhasználók",
        data: values,
        borderColor: "#1A4D8F",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#1A4D8F",
        pointHoverBackgroundColor: "#D4AF37",
        pointBorderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Ügyfelek regisztrálásának száma",
          color: "#0A1A2F",
          font: { size: 18, weight: "bold", family: "Inter, sans-serif" },
          padding: 16
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(10, 26, 47, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          borderWidth: 1,
          borderColor: "#D4AF37",
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: { ticks: { color: "#0A1A2F" }, grid: { display: false } },
        y: { ticks: { display: false }, grid: { display: false } }
      },
      animation: { duration: 1200, easing: "easeOutQuart" }
    }
  });
}

watch(
  () => adminStore.getUsers().length,
  async (newLen) => {
    if (newLen === 0) return;
    adminStore.calculateNewUsersByDate();
    await nextTick();
    initChart();
  }
);


onMounted(async () => {
  if (adminStore.getUsers().length > 0) {
    adminStore.calculateNewUsersByDate();
    await nextTick();
    initChart();
  }
});

</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="w-full">
    <canvas ref="chartRef" class="w-full"></canvas>
  </div>
</template>
