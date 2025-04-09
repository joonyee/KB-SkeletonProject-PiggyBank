<!-- <script setup>
import ExpenseChart from '../components/ExpenseChart.vue';

const labels = ['식비', '교통비', '쇼핑', '여가', '주거비'];
const mySpending = [80000, 15000, 89000, 120000, 450000];
const averageSpending = [65000, 25000, 45000, 80000, 600000];
</script>

<template>
  <div class="age-expense-analysis">
    <div class="card">
      <h2 class="title">연령대별 소비 분석</h2>
      <ExpenseChart
        title=""
        :labels="labels"
        :my-data="mySpending"
        :avg-data="averageSpending"
      />
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/global.css';

.age-expense-analysis {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
}
.card {
  background-color: var(--background-color);
  padding: 30px;
  border-radius: 15px;
  width: 1200px;
  height: auto;
  margin: auto;
  border: 2px solid var(--primary-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.title {
  font: var(--ng-bold-28);
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 20px;
}
</style>
 -->

<!-- 
<script setup>
import { ref, computed } from 'vue';
import ExpenseChart from '../components/ExpenseChart.vue';
import CategoryFilterModal from '../components/CategoryFilterModal.vue';

const allLabels = [
  '식사/카페',
  '배달/간식',
  '쇼핑',
  '교통/차량',
  '주거/관리',
  '건강/병원',
  '취미/여가',
  '구독서비스',
  '여행/외출',
  '기타지출',
];

const mySpending = [
  70000, 23000, 120000, 40000, 300000, 15000, 60000, 17000, 80000, 10000,
];
const avgSpending = [
  60000, 20000, 80000, 50000, 280000, 20000, 55000, 15000, 60000, 12000,
];

// 상태 관리
const selectedCategories = ref([...allLabels]);
const isModalOpen = ref(false);

// 필터링된 데이터
const filteredLabels = computed(() =>
  allLabels.filter((label) => selectedCategories.value.includes(label))
);
const filteredMySpending = computed(() =>
  allLabels
    .map((label, i) =>
      selectedCategories.value.includes(label) ? mySpending[i] : null
    )
    .filter((v) => v !== null)
);
const filteredAvgSpending = computed(() =>
  allLabels
    .map((label, i) =>
      selectedCategories.value.includes(label) ? avgSpending[i] : null
    )
    .filter((v) => v !== null)
);

// 모달 제어
const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);
const applyFilter = (newSelection) => {
  selectedCategories.value = [...newSelection];
  closeModal();
};
</script>

<template>
  <div class="age-expense-analysis">
    <div class="header">
      <h2>이번 달 연령대별 소비 분석</h2>
      <button @click="openModal" class="filter-button">카테고리</button>
    </div>

    <ExpenseChart
      :labels="filteredLabels"
      :my-data="filteredMySpending"
      :avg-data="filteredAvgSpending"
    />

    <CategoryFilterModal
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :categories="allLabels"
      :selectedCategories="selectedCategories"
      @close="closeModal"
      @apply="applyFilter"
    />
  </div>
</template>

<style scoped>
.age-expense-analysis {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-button {
  padding: 8px 14px;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  background-color: white;
  color: var(--primary-color);
  font: var(--ng-reg-14);
  cursor: pointer;
  transition: 0.2s;
}

.filter-button:hover {
  background-color: var(--primary-color);
  color: white;
}
</style> -->

<script setup>
import { ref, computed } from 'vue';
import ExpenseChart from '../components/ExpenseChart.vue';
import CategoryFilterModal from '../components/CategoryFilterModal.vue';

const allLabels = [
  '식사/카페',
  '배달/간식',
  '쇼핑',
  '교통/차량',
  '주거/관리',
  '건강/병원',
  '취미/여가',
  '구독서비스',
  '여행/외출',
  '기타지출',
];

const selectedCategories = ref([
  '식사/카페',
  '교통/차량',
  '쇼핑',
  '취미/여가',
  '주거/관리',
]);

const mySpending = [
  70000, 23000, 120000, 40000, 300000, 15000, 60000, 17000, 80000, 10000,
];
const avgSpending = [
  60000, 20000, 80000, 50000, 280000, 20000, 55000, 15000, 60000, 12000,
];

const isModalOpen = ref(false);

// 필터링된 데이터
const filteredLabels = computed(() =>
  allLabels.filter((label) => selectedCategories.value.includes(label))
);
const filteredMySpending = computed(() =>
  allLabels
    .map((label, i) =>
      selectedCategories.value.includes(label) ? mySpending[i] : null
    )
    .filter((v) => v !== null)
);
const filteredAvgSpending = computed(() =>
  allLabels
    .map((label, i) =>
      selectedCategories.value.includes(label) ? avgSpending[i] : null
    )
    .filter((v) => v !== null)
);

// 모달 제어
const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);
const applyFilter = (newSelection) => {
  selectedCategories.value = [...newSelection];
  closeModal();
};
</script>

<template>
  <div class="age-expense-analysis">
    <div class="header">
      <button @click="openModal" class="filter-button">카테고리</button>
    </div>

    <ExpenseChart
      :labels="filteredLabels"
      :my-data="filteredMySpending"
      :avg-data="filteredAvgSpending"
    />

    <CategoryFilterModal
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :categories="allLabels"
      :selectedCategories="selectedCategories"
      @close="closeModal"
      @apply="applyFilter"
    />
  </div>
</template>

<style scoped>
.age-expense-analysis {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  padding-right: 20px;
}
.chart-title {
  font: var(--ng-bold-24);
  color: var(--primary-color);
}

.filter-button {
  padding: 8px 16px;
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  background-color: white;
  color: var(--primary-color);
  font: var(--ng-reg-14);
  cursor: pointer;
}

/* .filter-button:hover {
  background-color: var(--primary-color);
  color: white;
} */
</style>
