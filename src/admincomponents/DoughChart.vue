<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';
import { adminState } from '../adminstate/state';

const felhasznalokChart = ref(null)
const adminStore = adminState();
let chartInstance = null;

const props = defineProps({
  chartHeight: String
})

function renderChart() {
  if (!felhasznalokChart.value) return;

  const approvedItems = adminStore.getApprovedItems();
  if (!approvedItems || approvedItems.length === 0) return;

  adminStore.calculateAmountOfCategories()
  const categoryOfItems = adminStore.getCategoryOfItems()

  const labels = []
  const values = []

  for (let i = 0; i < categoryOfItems.length; i++) {
    labels.push(categoryOfItems[i].getCategory())
    values.push(categoryOfItems[i].getAmount())
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(felhasznalokChart.value, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#D4AF37", "#1A4D8F", "#255C99", "#0A1A2F",
          "#A7C7E7", "#6FA8DC", "#8EC5FC", "#3A6EA5",
          "#B4C7E7", "#7BA4D9", "#5B8CC0", "#2F4A6D"
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 14,
        spacing: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Tárgyak mennyisége kategóriákra bontva",
          color: "#0A1A2F",
          font: {
            size: 20,
            weight: "bold",
            family: "Inter, sans-serif"
          },
          padding: 20
        },
        tooltip: {
          backgroundColor: "rgba(10, 26, 47, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          borderWidth: 1,
          borderColor: "#D4AF37",
          cornerRadius: 8
        }
      },
      cutout: "58%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: "easeOutQuart"
      }
    }
  });
}

onMounted(() => {
  watch(() => adminStore.getApprovedItems(), () => {
    renderChart();
  }, { immediate: true, deep: true });
});
</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="w-full">
    <canvas ref="felhasznalokChart" class="w-full" :height="chartHeight"></canvas>
  </div>
</template>

<style scoped></style>