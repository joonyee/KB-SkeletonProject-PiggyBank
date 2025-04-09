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

onMounted(async () => {
  const res = await fetch("http://localhost:3000/money");
  const data = await res.json();

  // 수입 또는 null인 항목 제외
  const filtered = data.filter(
    (item) => item.tendency !== null && item.tendency !== "수입"
  );

  // 최근 4개월 목록 생성
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const recentMonths = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`; // e.g., "2025-04"
  });

  // 최근 4개월 데이터만 필터
  const recentFiltered = filtered.filter((item) =>
    recentMonths.includes(item.date.slice(0, 7))
  );

  // 계획/충동 분리
  const planned = recentFiltered.filter((item) =>
    item.tendency.includes("계획")
  );
  const impulse = recentFiltered.filter((item) =>
    item.tendency.includes("충동")
  );

  // 월별 합산
  const grouped = {};
  [...planned, ...impulse].forEach((item) => {
    const month = parseInt(item.date.split("-")[1], 10) + "월";
    if (!grouped[month]) grouped[month] = { 계획: 0, 충동: 0 };
    if (planned.includes(item)) grouped[month].계획 += item.amount;
    else grouped[month].충동 += item.amount;
  });

  // 정렬된 월, 데이터 생성
  const labels = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));
  const 계획Data = labels.map((month) => grouped[month].계획);
  const 충동Data = labels.map((month) => grouped[month].충동);

  // Chart.js 렌더링
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
          maxBarThickness: 80,
        },
        {
          label: "계획 지출",
          data: 계획Data,
          backgroundColor: "#22C55E",
          borderRadius: 4,
          borderSkipped: false,
          stack: "지출",
          maxBarThickness: 80,
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
          categoryPercentage: 0.5,
          barPercentage: 0.7,
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
  max-width: 1300px;
  margin: 0 auto 2rem auto; /* 가운데 정렬 및 하단 여백 */
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
