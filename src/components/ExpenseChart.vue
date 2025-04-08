<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas" class="chart-canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  title: String,
  labels: Array,
  myData: Array,
  avgData: Array,
});

const chartCanvas = ref(null);
let chartInstance = null;

function getCSSVariable(variableName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

onMounted(() => {
  const primaryColor = getCSSVariable('--primary-color');
  const secondaryColor = getCSSVariable('--secondary-color');
  const textColor = getCSSVariable('--text-color');

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: '나의 소비',
          data: props.myData,
          backgroundColor: primaryColor,
          borderRadius: 5,
          borderSkipped: false,
          barThickness: 30,
        },
        {
          label: '평균 소비',
          data: props.avgData,
          backgroundColor: secondaryColor,
          borderRadius: 5,
          borderSkipped: false,
          barThickness: 30,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 16,
              family: getCSSVariable('--font-nanum-gothic'),
            },
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${
                context.dataset.label
              }: ₩${context.raw.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `₩${value.toLocaleString()}`,
            font: {
              size: 14,
              family: getCSSVariable('--font-nanum-gothic'),
            },
            color: textColor,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 14,
              family: getCSSVariable('--font-nanum-gothic'),
            },
            color: textColor,
          },
        },
      },
    },
  });
});
</script>

<style scoped>
@import '@/assets/styles/global.css';

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-wrapper {
  position: relative;
  width: 1000px;
  height: 500px;
  overflow: hidden; /* 스크롤 방지 */
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.chart-title {
  font: var(--ng-bold-20);
  text-align: center;
  margin-bottom: 10px;
  color: var(--primary-color); /* 글로벌 변수 사용 */
}
</style>
git remote set-url origin
https://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@github.com/KB-SkeletonProject/KB_skeleton_project.git
