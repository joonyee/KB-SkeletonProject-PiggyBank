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
          '#FF6384', // 연한 빨강
          '#36A2EB', // 파랑
          '#FFCE56', // 노랑
          '#4BC0C0', // 청록
          '#9966FF', // 보라
          '#FF9F40', // 주황
          '#C9CBCF', // 회색
          '#8DD17E', // 연두
          '#FF6F91', // 핑크
          '#00C49F',
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
