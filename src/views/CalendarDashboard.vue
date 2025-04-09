<template>
  <div class="calendar-dashboard">
    <!-- Calendar 컴포넌트는 연도와 월을 양방향 바인딩(v-model)을 통해 관리 -->
    <Calendar v-model:year="currentYear" v-model:month="currentMonth" />

    <!-- SummaryChart는 현재 연도와 월을 props로 받아 해당 달 분석 그래프를 그림 -->
    <div class="summary-section">
      <SummaryChart :year="currentYear" :month="currentMonth + 1" />
    </div>

    <!-- 추가 분석 영역: 소비 패턴 분석 카드, FixedExpense 버튼 등 -->
    <div class="analysis-section">
      <div class="analysis-card">
        <h3>소비 패턴 분석</h3>
        <div class="analysis-content">
          <div>
            <p>충동적 소비</p>
            <h2 class="negative">{{ impulsiveCount }}회</h2>
          </div>
          <div>
            <p>계획적 소비</p>
            <h2 class="positive">{{ plannedCount }}회</h2>
          </div>
        </div>
        <!-- 분할 진행 바 -->
        <div class="segmented-progress-bar">
          <div
            class="segment segment-impulsive"
            :style="{ width: (impulsiveCount / totalCount) * 100 + '%' }"
          ></div>
          <div
            class="segment segment-planned"
            :style="{ width: (plannedCount / totalCount) * 100 + '%' }"
          ></div>
        </div>
        <p class="summary">총 지출 횟수 : {{ totalCount }}회</p>
      </div>

      <div class="analysis-card" @click="openModal">
        <FixedExpense />
      </div>
    </div>

    <FixedModal v-if="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Calendar from '@/components/Calendar.vue';
import SummaryChart from '@/components/SummaryChart.vue';
import FixedExpense from '@/components/FixedExpense.vue';
import FixedModal from '@/components/FixedModal.vue';

// Calendar에서 관리하는 연도, 월 (Calendar에서는 0-indexed로 관리하므로 SummaryChart에 전달할 때는 +1)
const currentYear = ref(2025);
const currentMonth = ref(3); // 3이면 달력에서는 4월

// 소비 패턴 데이터 (예시)
const impulsiveCount = ref(3);
const plannedCount = ref(8);
const totalCount = computed(() => impulsiveCount.value + plannedCount.value);

// 모달 제어
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
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
/* 분할 진행 바 스타일 */
.segmented-progress-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.segmented-progress-bar .segment {
  height: 100%;
}

.segment.segment-impulsive {
  background-color: #ef4444; /* 충동적 소비: 빨간색 */
}

.segment.segment-planned {
  background-color: #10b981; /* 계획적 소비: 초록색 */
}
</style>
