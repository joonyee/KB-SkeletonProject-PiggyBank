<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  labels: Array,
  myData: Array,
  avgData: Array,
});

const barChartRef = ref(null);
const donutChartRef = ref(null);

let barChart = null;
let donutChart = null;

const myTotal = computed(() => props.myData.reduce((a, b) => a + b, 0));
const avgTotal = computed(() => props.avgData.reduce((a, b) => a + b, 0));

const primaryColor = '#FF69B4';
const softColor = '#FFD1E8';

const initBarChart = () => {
  if (barChart) barChart.destroy();

  barChart = new Chart(barChartRef.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: '나의 소비',
          data: props.myData,
          backgroundColor: primaryColor,
          borderRadius: 5,
          barThickness: 30,
        },
        {
          label: '평균 소비',
          data: props.avgData,
          backgroundColor: softColor,
          borderRadius: 5,
          barThickness: 30,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ₩${ctx.raw.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (v) => `₩${v.toLocaleString()}`,
            color: '#333',
          },
        },
        y: {
          ticks: {
            color: '#333',
          },
        },
      },
    },
  });
};

const initDonutChart = () => {
  if (donutChart) donutChart.destroy();

  donutChart = new Chart(donutChartRef.value, {
    type: 'doughnut',
    data: {
      labels: ['나의 소비', '평균 소비'],
      datasets: [
        {
          data: [myTotal.value, avgTotal.value],
          backgroundColor: [primaryColor, softColor],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ₩${ctx.raw.toLocaleString()}`,
          },
        },
      },
    },
  });
};

onMounted(() => {
  initBarChart();
  initDonutChart();
});

watch(
  () => [props.myData, props.avgData],
  () => {
    initBarChart();
    initDonutChart();
  }
);
</script>
<template>
  <div class="chart-container">
    <div class="chart-section">
      <h3 class="chart-title">카테고리별 소비 비교</h3>
      <canvas ref="barChartRef" class="chart-canvas"></canvas>
    </div>

    <div class="summary-section">
      <p class="summary-text">
        총 소비 : <strong>{{ myTotal.toLocaleString() }}원</strong><br />
        또래 평균 : <strong>{{ avgTotal.toLocaleString() }}원</strong>
      </p>

      <p class="result-text">
        <span v-if="myTotal > avgTotal" class="over-msg">
          ⚠️ 평균보다
          <strong>{{ (myTotal - avgTotal).toLocaleString() }}원</strong> 더
          사용하셨습니다.
        </span>
        <span v-else class="good-msg">
          🎉 평균보다
          <strong>{{ (avgTotal - myTotal).toLocaleString() }}원</strong> 적게
          사용하셨습니다!
        </span>
      </p>

      <div class="chart-section">
        <h3 class="chart-title">총 소비 비교</h3>
        <canvas ref="donutChartRef" class="chart-canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  width: 100%;
  padding: 30px 10px;
}

.chart-section {
  width: 100%;
  max-width: 1000px;
  height: 400px;
}

.chart-title {
  font: var(--ng-reg-22);
  text-align: center;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.summary-section {
  text-align: center;
  margin-top: 30px;
  font: var(--ng-reg-18);
  color: var(--text-color);
}

.summary-text {
  margin-bottom: 20px;
  font: var(--ng-reg-20);
}

.result-text {
  margin-bottom: 30px;
  font-size: 16px;
  font: var(--ng-reg-18);
}

.over-msg {
  color: #ff4d4f;
  font: var(--ng-reg-18);
}

.good-msg {
  color: var(--text-success);
  font: var(--ng-reg-18);
}
</style>
