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

// ✅ 최근 6개월을 기준으로 데이터 가공
const updateChartData = () => {
  if (props.chartData && props.chartData.length > 0) {
    const now = new Date();
    const recentSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      recentSixMonths.push(`${year}-${month}`);
    }

    // recentSixMonths 배열 기준으로 데이터 정렬 및 누락 채우기
    const filtered = recentSixMonths.map((monthStr) => {
      const found = props.chartData.find((item) => item.month === monthStr);
      return {
        month: `${parseInt(monthStr.split('-')[1])}월`,
        income: found?.income || 0,
        expense: found?.expense || 0,
      };
    });

    const labels = filtered.map((item) => item.month);
    const incomeData = filtered.map((item) => item.income);
    const expenseData = filtered.map((item) => item.expense);

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
