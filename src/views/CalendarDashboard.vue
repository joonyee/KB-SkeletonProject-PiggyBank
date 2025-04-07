<template>
  <div class="calendar-dashboard">
    <!-- 달력 -->
    <Calendar />

    <!-- 요약 섹션 -->
    <div class="summary-section">
      <div class="summary-card income">
        <p class="summary-label">수입</p>
        <p class="summary-amount">₩{{ totalIncome.toLocaleString() }}</p>
      </div>
      <div class="summary-card expense">
        <p class="summary-label">지출</p>
        <p class="summary-amount">₩{{ totalExpense.toLocaleString() }}</p>
      </div>
      <div class="summary-card balance">
        <p class="summary-label">잔액</p>
        <p class="summary-amount">₩{{ balance.toLocaleString() }}</p>
      </div>
    </div>

    <!-- 분석 섹션 -->
    <div class="analysis-section">
      <h3>소비 패턴 분석</h3>

      <!-- <BarChart :chartData="barData" :options="barOptions" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Calendar from '@/components/Calendar.vue';
// import BarChart from '@/components/BarChart.vue';

// 전체 거래 목록
const transactions = ref([]);

// 수입/지출/잔액 계산
const totalIncome = computed(() =>
  transactions.value
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const totalExpense = computed(() =>
  transactions.value
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
);

const balance = computed(() => totalIncome.value - totalExpense.value);

// 막대 그래프 데이터
// const barData = ref({
//   labels: [],
//   datasets: [],
// });
// const barOptions = ref({ responsive: true, maintainAspectRatio: false });

// onMounted(async () => {
//   try {
//     // transactions 데이터 불러오기
//     const res = await axios.get('http://localhost:3000/transactions');
//     transactions.value = res.data;
//     updateChartData();
//   } catch (error) {
//     console.error('데이터 로딩 실패:', error);
//   }
// });

// function updateChartData() {
//   // 1) 소비 패턴 분석 (예: 월별 지출, or 카테고리별 지출)
//   // 여기서는 예시로 '카테고리별 지출 합계'를 막대 그래프로 표시한다고 가정
//   const categoryMap = {};
//   transactions.value.forEach((tx) => {
//     if (tx.amount < 0) {
//       const cat = tx.category;
//       if (!categoryMap[cat]) categoryMap[cat] = 0;
//       categoryMap[cat] += Math.abs(tx.amount);
//     }
//   });

//   const labels = Object.keys(categoryMap);
//   const amounts = Object.values(categoryMap);

//   barData.value = {
//     labels,
//     datasets: [
//       {
//         label: '지출',
//         data: amounts,
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//       },
//     ],
//   };
// }
</script>

<style scoped>
.calendar-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 요약 섹션 */
.summary-section {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
.summary-card {
  flex: 1;
  background: #fff;
  margin: 0 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 1rem;
}
.summary-label {
  font-size: 1rem;
  color: #6b7280;
}
.summary-amount {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
.income .summary-amount {
  color: #16a34a;
}
.expense .summary-amount {
  color: #ef4444;
}
.balance .summary-amount {
  color: #3b82f6;
}

/* 분석 섹션 */
.analysis-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.analysis-box {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
.analysis-box h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #374151;
}
/* 차트 높이 지정 (예: 300px) */
.analysis-box {
  height: 300px;
  overflow: hidden;
  position: relative;
}
</style>
ㅂ
