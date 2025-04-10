<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ExpenseChart from '../components/ExpenseChart.vue';
import { useRouter } from 'vue-router';

// 상태 변수
const selectedCategories = ref([]);
const isFilterModalOpen = ref(false);
const isTransactionModalOpen = ref(false);
const currentUser = ref(null);
const moneyData = ref([]);
const userList = ref([]);
const categoryList = ref([]);
const mySpending = ref({});
const avgSpending = ref({});

// 모달 제어 함수
const openFilterModal = () => (isFilterModalOpen.value = true);
const closeFilterModal = () => (isFilterModalOpen.value = false);
const applyFilter = (newSelection) => {
  selectedCategories.value = [...newSelection];
  closeFilterModal();
};

// 헤더 및 라우터 설정
const router = useRouter();
const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};
const goToHome = () => router.push('/home');
const mypageClick = () => router.push('/myPage');
const logout = () => {
  alert('로그아웃되었습니다.');
  localStorage.removeItem('loggedInUserId');
  router.push('/');
};

// 카테고리 이름 매핑 함수
const getCategoryNameById = (id) => {
  const category = categoryList.value.find((cat) => cat.id === id);
  return category ? category.name : '';
};

// 데이터 로딩 및 계산
onMounted(async () => {
  try {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const [moneyRes, userRes, categoryRes] = await Promise.all([
      axios.get('http://localhost:3000/money'),
      axios.get('http://localhost:3000/user'),
      axios.get('http://localhost:3000/category'),
    ]);

    moneyData.value = moneyRes.data;
    userList.value = userRes.data;
    categoryList.value = categoryRes.data.filter((cat) => cat.id >= 6);

    currentUser.value = userList.value.find((u) => u.id === loggedInUserId);
    if (!currentUser.value) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    const ageGroup = currentUser.value.age;
    const categoryIds = categoryList.value.map((cat) => cat.id);

    // 지출 데이터 초기화
    mySpending.value = {};
    avgSpending.value = {};
    categoryIds.forEach((id) => {
      mySpending.value[id] = 0;
      avgSpending.value[id] = 0;
    });

    selectedCategories.value = [...categoryIds];

    const myExpenses = moneyData.value.filter(
      (m) => m.userid === loggedInUserId && m.typeid === 2
    );

    const sameAgeUserIds = userList.value
      .filter((user) => user.age === ageGroup)
      .map((user) => user.id);

    const sameAgeExpenses = moneyData.value.filter(
      (m) => sameAgeUserIds.includes(m.userid) && m.typeid === 2
    );

    categoryIds.forEach((id) => {
      mySpending.value[id] = myExpenses
        .filter((m) => m.categoryid === id)
        .reduce((sum, cur) => sum + cur.amount, 0);

      const groupAmounts = sameAgeExpenses
        .filter((m) => m.categoryid === id)
        .map((m) => m.amount);

      avgSpending.value[id] = groupAmounts.length
        ? Math.round(
            groupAmounts.reduce((a, b) => a + b, 0) / groupAmounts.length
          )
        : 0;
    });
  } catch (err) {
    console.error('데이터 불러오기 오류:', err);
    alert('데이터를 불러오는 중 오류가 발생했습니다.');
  }
});

// 필터링된 데이터 계산
const filteredLabels = computed(() =>
  selectedCategories.value.map((id) => getCategoryNameById(id))
);
const filteredMySpending = computed(() =>
  selectedCategories.value.map((id) => mySpending.value[id] || 0)
);
const filteredAvgSpending = computed(() =>
  selectedCategories.value.map((id) => avgSpending.value[id] || 0)
);
</script>

<template>
  <header class="dashboardHeader">
    <h1 class="dashboardTitle">
      <img
        src="/src/assets/icons/logo.png"
        class="iconImage"
        @click="goToHome"
      />Piggy Bank
    </h1>
    <div class="flex items-center gap-2 relative">
      <button @click="toggleDarkMode" class="darkModeButton">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
      <button class="mypageButton" @click="mypageClick">마이페이지</button>
      <button class="inputValue" @click="openTransactionModal">
        새 거래추가
      </button>
      <button class="logout" @click="logout">로그아웃</button>
    </div>
  </header>

  <div class="age-expense-analysis">
    <div class="header"></div>

    <ExpenseChart
      :labels="filteredLabels"
      :my-data="filteredMySpending"
      :avg-data="filteredAvgSpending"
      :isDarkMode="isDarkMode"
    />

    <CategoryFilterModal
      v-if="isFilterModalOpen"
      :isOpen="isFilterModalOpen"
      :categories="allLabels"
      :selectedCategories="selectedCategories"
      @close="closeFilterModal"
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

/* 헤더  */
.body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--background-color);
}

.dark body {
  background-color: #121212;
  color: #f5f5f5;
}
.dashboard {
  padding: 2rem;
  margin: 0;
  background: linear-gradient(to bottom, #fff9fe, #ffffff);
  font-family: sans-serif;
  box-sizing: border-box;
  color: black;
}

.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fbcee8;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.dashboardTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
}
.iconImage {
  width: 60px;
  height: 60px;
  cursor: pointer;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mypageButton,
.logout,
.inputValue {
  background-color: rgb(254, 235, 253);
  border: 1px solid rgb(251, 209, 251);
  border-radius: 0.5rem;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-weight: 600;
  color: #333;
}
.dark .age-expense-analysis {
  background: linear-gradient(to bottom, #1a1a1a, #121212);
  color: #f5f5f5;
}

.dark .filter-button {
  background-color: #2c2c2c;
  border: 1px solid #f3daf0;
  color: #f9a8d4;
}

.dark .chart-title {
  color: #f9a8d4;
}

/* 차트 배경이 흰색이라면 다크모드용으로 투명 또는 어두운 배경 처리 */
.dark canvas {
  background-color: transparent !important;
}

/* 모달 스타일에 다크 테마 적용 시 필요한 예시 */
.dark .modal {
  background-color: #222;
  color: #fff;
  border: 1px solid #444;
}
</style>
