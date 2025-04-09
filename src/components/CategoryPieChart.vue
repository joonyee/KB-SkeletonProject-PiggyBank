<template>
  <div class="category-chart">
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  categorySpending: {
    type: Array,
    required: true,
  },
});

const chartData = computed(() => {
  if (!props.categorySpending) return null;
  return {
    labels: props.categorySpending.map((item) => item.category),
    datasets: [
      {
        data: props.categorySpending.map((item) => item.amount),
        backgroundColor: [
          '#f87171',
          '#60a5fa',
          '#34d399',
          '#facc15',
          '#a78bfa',
          '#f472b6',
        ],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (context) => `₩${Number(context.raw).toLocaleString()}`,
      },
    },
  },
};
</script>

<style scoped>
.category-chart {
  width: 100%;
  height: 300px;
  padding: 1rem;
}
</style>
