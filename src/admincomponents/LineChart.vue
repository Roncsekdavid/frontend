<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted, ref } from 'vue';
import { adminState } from '../adminstate/state';

const bevetelChart = ref(null);

const adminStore = adminState();
const incomeByDate = ref([]);

console.log("incomeByDate:", incomeByDate.value)

const props = defineProps({
  chartHeight: {
    type: String,
    default: "300"
  }
});



onMounted(async () => {

  await adminStore.getForSaleItemsFromApi()
  adminStore.calculateIncomeByDate()
  incomeByDate.value = adminStore.getIncomeByDate();

 
    await adminStore.getForSaleItemsFromApi()
    adminStore.calculateIncomeByDate()
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
        legend: {
          display: false
        },

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
          text: "Piacon lévő tárgyak értékei, és dátuma",
          color: "#0A1A2F",
          font: {
            size: 20,
            weight: "bold",
            family: "Inter, sans-serif"
          },
          padding: 20
        }
      },

      scales: {
        x: {
          ticks: {
            color: "#1A1A1A",
            font: {
              size: 14
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: "#1A1A1A",
            font: {
              size: 14
            }
          },
          grid: {
            color: "rgba(0,0,0,0.05)"
          }
        }
      },

      animation: {
        duration: 1200,
        easing: "easeOutQuart"
      }
    }
  });
});

</script>

<template>
  <div :style="{ height: chartHeight + 'px' }" class="w-full">
    <canvas ref="bevetelChart" class="w-full"></canvas>
  </div>
</template>