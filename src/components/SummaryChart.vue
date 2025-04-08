<template>
  <div class="transaction-graph">
    <h2>월별 수입/지출 및 지출률</h2>
    <Bar
      v-if="chartData && chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else>데이터를 불러오는 중...</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js';

// Chart.js 모듈 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

// 부모로부터 raw 거래 데이터와 날짜 범위를 prop으로 받음
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  rangeStart: {
    type: Date,
    required: true,
  },
  rangeEnd: {
    type: Date,
    required: true,
  },
});

// 시작부터 종료까지 월별 라벨 배열 생성 (YYYY-MM 형식)
function generateMonthLabels(start, end) {
  const labels = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  while (d <= end) {
    // 예: "2024-07"
    const monthStr = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(
      -2
    )}`;
    labels.push(monthStr);
    d.setMonth(d.getMonth() + 1);
  }
  return labels;
}
const monthLabels = computed(() =>
  generateMonthLabels(props.rangeStart, props.rangeEnd)
);

// 월별 거래 집계 computed: 각 월의 수입, 지출(절대값) 누적을 계산
const monthlyAggregates = computed(() => {
  const aggregates = {};
  monthLabels.value.forEach((label) => {
    aggregates[label] = { income: 0, expense: 0 };
  });
  props.transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    // 지정 범위 내의 거래만 집계
    if (txDate >= props.rangeStart && txDate <= props.rangeEnd) {
      const key = `${txDate.getFullYear()}-${(
        '0' +
        (txDate.getMonth() + 1)
      ).slice(-2)}`;
      if (aggregates[key] !== undefined) {
        if (tx.amount > 0) {
          aggregates[key].income += tx.amount;
        } else {
          aggregates[key].expense += Math.abs(tx.amount);
        }
      }
    }
  });
  return aggregates;
});

// Chart.js에 사용할 차트 데이터 구성: 라벨, 수입, 지출, 그리고 지출률 계산
const chartData = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return null;
  const labels = monthLabels.value;
  const incomeData = [];
  const expenseData = [];
  const expenseRateData = [];
  labels.forEach((label) => {
    const income = monthlyAggregates.value[label].income;
    const expense = monthlyAggregates.value[label].expense;
    incomeData.push(income);
    expenseData.push(expense);
    const rate = income > 0 ? Math.round((expense / income) * 100) : 0;
    expenseRateData.push(rate);
  });
  return {
    labels,
    datasets: [
      {
        type: 'bar',
        label: '수입',
        data: incomeData,
        backgroundColor: 'rgba(22, 163, 74, 0.6)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: '지출',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: '지출률 (%)',
        data: expenseRateData,
        borderColor: '#ffa500',
        backgroundColor: '#ffa500',
        tension: 0.2,
        fill: false,
        yAxisID: 'y1',
        pointRadius: 4,
      },
    ],
  };
});

// Chart.js 옵션 설정 (왼쪽 y축은 금액, 오른쪽 y축은 지출률)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: '월별 수입/지출 및 지출률' },
  },
  scales: {
    y: {
      type: 'linear',
      position: 'left',
      beginAtZero: true,
      title: { display: true, text: '금액 (원)' },
    },
    y1: {
      type: 'linear',
      position: 'right',
      beginAtZero: true,
      min: 0,
      max: 100,
      title: { display: true, text: '지출률 (%)' },
      grid: { drawOnChartArea: false },
      ticks: { callback: (value) => value + '%' },
    },
  },
};

// props.monthlyData(또는 여기서는 props.transactions)가 변경되면 자동 업데이트
watch(
  () => props.transactions,
  () => {
    // chartData는 computed이므로 자동 업데이트됨
  },
  { deep: true }
);
</script>

<style scoped>
.transaction-graph {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}
.transaction-graph h2 {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
