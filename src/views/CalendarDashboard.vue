<template>
  <div class="calendar-dashboard">
    <Calendar />

    <!-- <div class="summary-section">
      <SummaryChart
        :transactions="transactions"
        :rangeStart="rangeStart"
        :rangeEnd="rangeEnd"
      />
    </div> -->
    <div class="analysis-section">
      <div class="analysis-card">
        <h3>소비 패턴 분석</h3>
        <div class="analysis-content">
          <div>
            <p>총 지출 횟수</p>
            <h2 class="negative">3회</h2>
          </div>
          <div>
            <p>지출이 없는 날</p>
            <h2 class="positive">8회</h2>
          </div>
        </div>
        <p class="summary">총 소비 수: 11회</p>
      </div>

      <div class="analysis-card" @click="openModal">
        <FixedExpense />
      </div>
    </div>
    <FixedModal v-if="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import axios from 'axios';
import Calendar from '@/components/Calendar.vue';
import SummaryChart from '@/components/SummaryChart.vue';
import FixedExpense from '@/components/FixedExpense.vue';
import FixedModal from '@/components/FixedModal.vue'; // FixedModal 컴포넌트 임포트

// const transactions = ref([]);
const isModalOpen = ref(false);

// 날짜 범위는 2024-07-01부터 2025-04-08까지로 고정
const rangeStart = new Date('2024-07-01');
const rangeEnd = new Date('2025-04-08');

const openModal = () => {
  isModalOpen.value = true;
};
// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

// const fetchData = async () => {
//   try {
//     const res = await axios.get('http://localhost:3000/transactions');

//     transactions.value = res.data;
//     console.log('거래 데이터:', transactions.value);
//   } catch (error) {
//     console.error('데이터 로딩 실패:', error);
//   }
// };

// onMounted(() => {
//   fetchData();
// });
</script>

<style scoped>
.calendar-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.analysis-section {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.analysis-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.analysis-card:first-child {
  flex: 1;
  margin-right: 1rem;
}

/* 두 번째 카드의 비율을 2로 설정 */
.analysis-card:last-child {
  flex: 2;
  margin-right: 0;
}

.analysis-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.analysis-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.analysis-content div {
  text-align: center;
}

.negative {
  color: #ef4444;
  font-size: 2rem;
  font-weight: bold;
}

.positive {
  color: #22c55e;
  font-size: 2rem;
  font-weight: bold;
}

.summary {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
