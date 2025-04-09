<template>
  <div class="chart-container">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

const chartData = ref(null);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${
            context.dataset.label
          }: ₩${context.parsed.y.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => '₩' + value.toLocaleString(),
      },
    },
  },
};

// 🔁 차트 데이터 가공 함수
const updateChartData = () => {
  if (props.chartData && props.chartData.length > 0) {
    const labels = props.chartData.map((item) => item.month);
    const incomeData = props.chartData.map((item) => item.income);
    const expenseData = props.chartData.map((item) => item.expense);

    chartData.value = {
      labels,
      datasets: [
        {
          label: '수입',
          backgroundColor: '#4ade80',
          borderColor: '#4ade80',
          borderWidth: 1,
          data: incomeData,
        },
        {
          label: '지출',
          backgroundColor: '#f87171',
          borderColor: '#f87171',
          borderWidth: 1,
          data: expenseData,
        },
      ],
    };
  }
};

// 🚀 컴포넌트 마운트 시 데이터 초기화
onMounted(() => {
  updateChartData();
});

// 👀 props가 바뀔 때마다 차트 데이터 재계산
watch(() => props.chartData, updateChartData);
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
