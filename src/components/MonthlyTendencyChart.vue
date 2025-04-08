<template>
  <div class="card chart-card">
    <div class="chart-header">
      <h3 class="chart-title">월별 지출 패턴</h3>
      <!-- 범례는 Chart.js 내부에서 오른쪽 정렬됨 -->
    </div>
    <canvas ref="chartRef" height="200"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = ref(null);

// 임시 데이터 (막대그래프 ui 테스트용)
const money = [
  { amount: 200000, tendency: "계획된 지출", date: "2025-01-10" },
  { amount: 300000, tendency: "계획된 지출", date: "2025-01-15" },
  { amount: 150000, tendency: "충동적 지출", date: "2025-01-20" },
  { amount: 250000, tendency: "계획된 지출", date: "2025-02-03" },
  { amount: 120000, tendency: "충동적 지출", date: "2025-02-12" },
  { amount: 280000, tendency: "계획된 지출", date: "2025-03-01" },
  { amount: 140000, tendency: "충동적 지출", date: "2025-03-05" },
  { amount: 220000, tendency: "계획된 지출", date: "2025-04-01" },
  { amount: 100000, tendency: "충동적 지출", date: "2025-04-02" },
];

onMounted(() => {
  const grouped = {};

  const filtered = money;

  const planned = filtered.filter((item) => item.tendency.includes("계획"));
  const impulse = filtered.filter((item) => item.tendency.includes("충동"));

  // 월별로 합산
  [...planned, ...impulse].forEach((item) => {
    const month = parseInt(item.date.split("-")[1], 10) + "월";
    if (!grouped[month]) grouped[month] = { 계획: 0, 충동: 0 };
    if (planned.includes(item)) grouped[month].계획 += item.amount;
    else grouped[month].충동 += item.amount;
  });

  const labels = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));
  const 계획Data = labels.map((month) => grouped[month].계획);
  const 충동Data = labels.map((month) => grouped[month].충동);

  new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "충동 지출",
          data: 충동Data,
          backgroundColor: "#EF4444",
          borderRadius: 4,
          borderSkipped: false,
          stack: "지출",
        },
        {
          label: "계획 지출",
          data: 계획Data,
          backgroundColor: "#22C55E",
          borderRadius: 4,
          borderSkipped: false,
          stack: "지출",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            font: { size: 13 },
          },
        },
        title: { display: false },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { size: 13 } },
          categoryPercentage: 0.2, // 카테고리 너비 비율
          barPercentage: 0.7, // 막대 비율
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { display: false },
          ticks: {
            maxTicksLimit: 5,
            callback: (value) => `₩${value.toLocaleString()}`,
            font: { size: 13 },
          },
        },
      },
    },
  });
});
</script>

<style scoped>
.card {
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.chart-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}
</style>
