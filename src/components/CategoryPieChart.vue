<template>
  <div class="category-chart">
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  categorySpending: {
    type: Array,
    required: true,
  },
});

const chartData = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0, // 애니메이션 비활성화
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      enabled: true, // 툴팁 활성화
      position: 'nearest', // 툴팁이 가까운 요소에 바로 표시되도록
      animation: {
        duration: 0, // 툴팁 애니메이션 비활성화
      },
      callbacks: {
        label: (context) => `₩${Number(context.raw).toLocaleString()}`,
      },
    },
  },
};

// ✅ categorySpending 데이터 변경 시 차트 데이터 갱신
watch(
  () => props.categorySpending,
  (newData) => {
    if (newData && newData.length > 0) {
      chartData.value = {
        labels: newData.map((item) => item.category),
        datasets: [
          {
            data: newData.map((item) => item.amount),
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
    }
  },
  { immediate: true }
); // 초기 데이터가 있을 경우 바로 실행
</script>

<style scoped>
.category-chart {
  width: 100%;
  height: 300px;
  padding: 1rem;
}
</style>
