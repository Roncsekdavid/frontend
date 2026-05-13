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

  adminStore.calculateAmountOfCategories();
  const categoryOfItems = adminStore.getCategoryOfItems();

  const labels = [];
  const values = [];
  const backgroundColors = [];

  // Alapértelmezett kék árnyalatok a többi kategóriának
  const blueShades = [
    "#1A4D8F", "#255C99", "#0A1A2F", "#3A6EA5", 
    "#5B8CC0", "#2F4A6D", "#6FA8DC", "#7BA4D9"
  ];

  for (let i = 0; i < categoryOfItems.length; i++) {
    const categoryName = categoryOfItems[i].getCategory();
    labels.push(categoryName);
    values.push(categoryOfItems[i].getAmount());

    // Dinamikus színkiosztás: ha Ékszer & Arany, akkor arany, egyébként kék
    if (categoryName === "Ékszer & Arany") {
      backgroundColors.push("#D4AF37");
    } else {
      // Kiveszünk egy színt a kék listából (vagy maradékos osztással pörgünk rajta)
      backgroundColors.push(blueShades[i % blueShades.length]);
    }
  }

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(felhasznalokChart.value, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors, // Itt már a dinamikus tömböt használjuk
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 14,
        spacing: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // ... a többi opció változatlan
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Tárgyak mennyisége kategóriákra bontva",
          color: "#0A1A2F",
          font: { size: 20, weight: "bold", family: "Inter, sans-serif" },
          padding: 20
        },
        tooltip: {
          backgroundColor: "rgba(10, 26, 47, 0.9)",
          borderColor: "#D4AF37",
          borderWidth: 1,
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