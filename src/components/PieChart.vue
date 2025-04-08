<template>
  <div class="chart-container">
    <Bar v-if="chartData" :data="chartData" :options="options" />
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

// 상태 관리용 ref 선언
const labels = ref([]);
const income = ref([]);
const expense = ref([]);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '수입',
      backgroundColor: '#4ade80',
      borderColor: '#4ade80',
      borderWidth: 1,
      data: [],
    },
    {
      label: '지출',
      backgroundColor: '#f87171',
      borderColor: '#f87171',
      borderWidth: 1,
      data: [],
    },
  ],
});

// 옵션 설정
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
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
        callback: function (value) {
          return '₩' + value.toLocaleString();
        },
      },
    },
  },
};

// props.chartData가 변할 때마다 차트 데이터를 업데이트
const updateChartData = () => {
  if (props.chartData && props.chartData.length > 0) {
    labels.value = props.chartData.map((item) => item.month);
    income.value = props.chartData.map((item) => item.income);
    expense.value = props.chartData.map((item) => item.expense);

    chartData.value = {
      labels: labels.value,
      datasets: [
        {
          label: '수입',
          backgroundColor: '#4ade80',
          borderColor: '#4ade80',
          borderWidth: 1,
          data: income.value,
        },
        {
          label: '지출',
          backgroundColor: '#f87171',
          borderColor: '#f87171',
          borderWidth: 1,
          data: expense.value,
        },
      ],
    };
  }
};

// 초기 데이터 처리
onMounted(() => {
  updateChartData();
});

// chartData 변경 시 업데이트
watch(() => props.chartData, updateChartData);
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px; /* 그래프 높이 설정 */
  width: 100%; /* 그래프 너비 설정 */
}
</style>
