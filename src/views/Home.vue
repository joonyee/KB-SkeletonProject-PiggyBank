<template>
  <div class="dashboard">
    <!-- Header -->
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
        <button class="inputValue" @click="openModal">새 거래추가</button>

        <TransactionModal
          :isOpen="isModalOpen"
          :date="selectedDate"
          @close="closeModal"
        />
        <button class="logout" @click="logout">로그아웃</button>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summaryGrid">
      <div class="incomeCard">
        <div class="cardLabel" @click="goToMonthlyAnalysis">이번 달 수입</div>
        <div class="cardValue">₩{{ totalIncome.toLocaleString() }}</div>
      </div>
      <div class="expenseCard">
        <div class="cardLabel" @click="goToMonthlyAnalysis">이번 달 지출</div>
        <div class="cardValue">₩{{ totalExpense.toLocaleString() }}</div>
      </div>
      <div class="balanceCard">
        <div class="cardLabel" @click="goToMonthlyAnalysis">이번 달 잔액</div>
        <div class="cardValue">₩{{ balance.toLocaleString() }}</div>
      </div>
      <!-- <div class="piggyAni"></div> -->
      <div class="savingsCard">
        <div class="nowSavings">
          <div class="cardLabel" @click="goToMonthlyAnalysis">현재 저축률</div>
          <div class="cardValue">{{ savingsRate }}%</div>
        </div>
        <div class="goalSavings">
          <div class="cardLabel" @click="goToMonthlyAnalysis">목표 저축률</div>
          <div class="cardValue">{{ savingGoal }}%</div>
        </div>
      </div>
    </div>

    <!-- Monthly Chart & Category Spending -->
    <div class="chartSection">
      <div class="monthlyChart">
        <h2 class="sectionTitle" @click="monthlyClick">
          📈 월간 수입/지출 추이
        </h2>
        <PieChart :chartData="chartData" />
      </div>
      <div class="piggyAni">
        <h2 class="sectionTitle">🐷저축률을 높여 돼지를 키워주세요!</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :width="size"
          :height="size"
          viewBox="0 0 200 200"
        >
          <!-- 그라디언트 정의 -->
          <defs>
            <radialGradient id="faceGradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#FFD8F0" />
              <stop offset="100%" stop-color="#FFA8DC" />
            </radialGradient>
            <radialGradient id="earGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFD0EB" />
              <stop offset="100%" stop-color="#FF9FD6" />
            </radialGradient>
          </defs>

          <!-- 귀 -->
          <circle
            :cx="earLeft.cx"
            :cy="earLeft.cy"
            :r="earSize"
            fill="url(#earGradient)"
          />
          <circle
            :cx="earRight.cx"
            :cy="earRight.cy"
            :r="earSize"
            fill="url(#earGradient)"
          />

          <!-- 얼굴 -->
          <circle cx="100" cy="100" :r="faceRadius" fill="url(#faceGradient)" />

          <!-- 왼쪽 눈 -->
          <rect
            :x="eyeLeft.x"
            :y="eyeLeft.y"
            :width="eyeSize.width"
            :height="eyeSize.height"
            rx="3"
            fill="#000"
            class="blink"
          />
          <circle
            :cx="eyeLeft.x + eyeSize.width / 2"
            :cy="eyeLeft.y + eyeSize.height / 2"
            :r="eyeHighlightSize"
            fill="white"
          />

          <!-- 오른쪽 눈 -->
          <rect
            :x="eyeRight.x"
            :y="eyeRight.y"
            :width="eyeSize.width"
            :height="eyeSize.height"
            rx="3"
            fill="#000"
            class="blink"
          />
          <circle
            :cx="eyeRight.x + eyeSize.width / 2"
            :cy="eyeRight.y + eyeSize.height / 2"
            :r="eyeHighlightSize"
            fill="white"
          />

          <!-- 코 -->
          <ellipse
            cx="100"
            :cy="nosePosition.cy"
            :rx="noseSize.rx"
            :ry="noseSize.ry"
            fill="#FFB6DC"
          />
          <ellipse
            cx="100"
            :cy="nosePosition.cy"
            :rx="noseSize.rx"
            :ry="noseSize.ry"
            fill="rgba(0, 0, 0, 0.05)"
          />
          <circle
            :cx="noseHoles.left.cx"
            :cy="noseHoles.left.cy"
            :r="noseHoleSize"
            fill="#000"
          />
          <circle
            :cx="noseHoles.right.cx"
            :cy="noseHoles.right.cy"
            :r="noseHoleSize"
            fill="#000"
          />
        </svg>
        <p class="piggyMessage">
          {{ piggyMessage }}
        </p>
      </div>
    </div>

    <!-- Transaction Summary & History -->
    <div class="transactionSection">
      <div class="transactionHistory">
        <h2 class="sectionTitle" @click="goToExpenseList">🧾 최근 거래내역</h2>
        <ul>
          <li
            v-for="(tx, index) in transactions.slice(0, 3)"
            :key="index"
            class="transactionItem"
          >
            <div class="transactionDate">{{ tx.date }} {{ tx.category }}</div>
            <div class="transactionContent">
              <div>{{ tx.description }}</div>
              <div :class="tx.amount > 0 ? 'amountIncome' : 'amountExpense'">
                ₩{{ Math.abs(tx.amount).toLocaleString() }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="categorySummary">
        <h2 class="sectionTitle" @click="goToAgeExpenseAnalysis">
          📊 카테고리별 지출
        </h2>

        <CategoryPieChart :categorySpending="categorySpending" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import CategoryPieChart from '@/components/CategoryPieChart.vue';
import PieChart from '@/components/PieChart.vue';
import { RouterLink } from 'vue-router';
import IndividualPig from '@/components/IndividualPig.vue';
import PiggyFace from '@/components/Piggyface.vue';
import PiggyfaceDefault from '@/components/PiggyfaceDefault.vue';
import FinalPig from '@/components/FinalPig.vue';
import { useDashboardStore } from '@/stores/store.js';
import { useRouter } from 'vue-router';
import TransactionModal from '@/components/TransactionModal.vue';
// import { PigIntro } from '@/views/PigIntro.vue';

const router = useRouter();

// const store = useDashboardStore();
// console.log(store.savingsRate);

const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

//여기서 부터 pinia로 옮겨서 다른 컴포넌트도 사용할 수 있게 바꿉니다.
const chartData = ref([]);
const categorySpending = ref([]);
const transactions = ref([]);
const savingGoal = ref(null);
const loading = ref(true); // 로딩 상태 추가

const fetchData = async () => {
  try {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
      throw new Error('로그인 정보가 없습니다.');
    } else {
      console.log('현재 로그인한 유저 ID:', userId);
    }
    const responseGoal = await axios.get(
      `http://localhost:3000/user/${userId}`
    );
    savingGoal.value = responseGoal.data.goalSavings;

    const response = await axios.get('http://localhost:3000/money');
    const moneyData = response.data.filter((entry) => entry.userid == userId); // 👈 유저별 필터

    const monthlyTotals = {};
    moneyData.forEach((entry) => {
      const month = entry.date.slice(0, 7);
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expense: 0 };
      }
      if (entry.typeid === 1) {
        monthlyTotals[month].income += entry.amount;
      } else if (entry.typeid === 2) {
        monthlyTotals[month].expense += entry.amount;
      }
    });

    chartData.value = Object.entries(monthlyTotals).map(
      ([month, { income, expense }]) => ({
        month,
        income,
        expense,
      })
    );

    const sorted = moneyData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const latestMonth =
      sorted.length > 0
        ? new Date(sorted[0].date).toISOString().slice(0, 7)
        : null;

    const recentMonthData = moneyData.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return (
        entry.typeid === 2 &&
        entry.categoryid >= 5 &&
        entryMonth === latestMonth
      );
    });

    const recentMonthInData = moneyData.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return (
        entry.typeid === 1 &&
        entry.categoryid <= 4 &&
        entryMonth === latestMonth
      );
    });

    const categoryTotals = {};
    recentMonthData.forEach((entry) => {
      const catId = entry.categoryid;
      if (!categoryTotals[catId]) {
        categoryTotals[catId] = 0;
      }
      categoryTotals[catId] += entry.amount;
    });

    const categoryRes = await axios.get('http://localhost:3000/category');
    const categoryMap = categoryRes.data.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});

    const recentTransactions = sorted
      .filter((entry) => {
        const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
        return entryMonth === latestMonth;
      })
      .map((entry) => ({
        date: entry.date,
        category: categoryMap[entry.categoryid] || '기타',
        description: entry.memo,
        amount: entry.typeid === 1 ? entry.amount : -entry.amount,
      }));

    transactions.value = recentTransactions;
    categorySpending.value = Object.entries(categoryTotals).map(
      ([id, amount]) => ({
        category: categoryMap[id] || '기타',
        amount,
      })
    );
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
};

//여기까지
onMounted(() => {
  fetchData();
});

const maxChartValue = computed(() =>
  Math.max(
    ...chartData.value.map((item) => Math.max(item.income, item.expense))
  )
);

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

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return Math.round((balance.value / totalIncome.value) * 100);
});
console.log(savingsRate);

const mypageClick = () => {
  router.push('./myPage');
};
const logout = () => {
  alert('안녕히가세요!');

  localStorage.removeItem('loggedInUserId');
  localStorage.removeItem('loggedInUserInfo');

  router.push('/');
};

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const goToHome = () => {
  router.push('./home');
};

const monthlyClick = () => {
  router.push('./calendar');
};

const goToExpenseList = () => {
  router.push('/expenseList');
};
const goToAgeExpenseAnalysis = () => {
  router.push('/ageExpenseAnalysis');
};
const goToMonthlyAnalysis = () => {
  router.push('/monthlyAnalysis');
};
const baseSize = 200;

// 크기 비율 계산 (저축률 기반)
const sizeRatio = computed(() => savingsRate.value / 100 + 0.2);
const size = computed(() => baseSize * (0.6 + sizeRatio.value * 0.4));
const faceRadius = computed(() => 80 * sizeRatio.value);
const earSize = computed(() => 15 * sizeRatio.value);

const earLeft = computed(() => ({
  cx: 100 - faceRadius.value * 0.55,
  cy: 100 - faceRadius.value * 0.7,
}));
const earRight = computed(() => ({
  cx: 100 + faceRadius.value * 0.55,
  cy: 100 - faceRadius.value * 0.7,
}));

const eyeSize = computed(() => ({
  width: 10 * sizeRatio.value,
  height: 25 * sizeRatio.value,
}));
const eyeHighlightSize = computed(() => 2 * sizeRatio.value);

const eyeLeft = computed(() => ({
  x: 100 - faceRadius.value * 0.3 - eyeSize.value.width / 2,
  y: 100 - faceRadius.value * 0.1 - eyeSize.value.height / 2,
}));
const eyeRight = computed(() => ({
  x: 100 + faceRadius.value * 0.3 - eyeSize.value.width / 2,
  y: 100 - faceRadius.value * 0.1 - eyeSize.value.height / 2,
}));

const noseSize = computed(() => ({
  rx: 30 * sizeRatio.value,
  ry: 20 * sizeRatio.value,
}));
const nosePosition = computed(() => ({
  cy: 100 + faceRadius.value * 0.3,
}));
const noseHoleSize = computed(() => 5 * sizeRatio.value);
const noseHoles = computed(() => ({
  left: {
    cx: 100 - noseSize.value.rx * 0.4,
    cy: nosePosition.value.cy,
  },
  right: {
    cx: 100 + noseSize.value.rx * 0.4,
    cy: nosePosition.value.cy,
  },
}));
const piggyMessage = computed(() => {
  if (savingsRate.value < 0) return '돼지가 집을 나가버렸어요 😰';
  if (savingsRate.value < 50) return '돼지가 배가 고파요 😢';
  if (savingsRate.value < 70) return '돼지가 괜찮아해요 🙂';
  if (savingsRate.value < 90) return '돼지가 행복해해요 😄';
  return '돼지가 완전 포동포동해요 🐷💖';
});

// const sizeRatio = savingsRate.value / 100 + 0.2; // 크기 비율 (0~1 사이) + 기본값 0.2
// const size = baseSize * (0.6 + sizeRatio * 0.4); // 결과 60% ~ 100% 크기
// console.log(savingsRate.value);
// console.log(size);

// // 얼굴 크기
// const faceRadius = 80 * sizeRatio; // 얼굴 반지름

// // 귀 크기와 위치 계산
// const earSize = 15 * sizeRatio; // 귀 크기
// const earLeft = { cx: 100 - faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 왼쪽 귀 중심
// const earRight = { cx: 100 + faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 오른쪽 귀 중심

// // 눈 크기와 위치 계산
// const eyeSize = {
//   width: 10 * sizeRatio, // 눈 너비
//   height: 25 * sizeRatio, // 눈 높이
// };
// const eyeHighlightSize = 2 * sizeRatio; // 눈 하이라이트 크기
// const eyeLeft = {
//   x: 100 - faceRadius * 0.3 - eyeSize.width / 2,
//   y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
// };
// const eyeRight = {
//   x: 100 + faceRadius * 0.3 - eyeSize.width / 2,
//   y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
// };

// // 코 크기와 위치 계산
// const noseSize = {
//   rx: 30 * sizeRatio, // 코 타원의 x 반지름
//   ry: 20 * sizeRatio, // 코 타원의 y 반지름
// };
// const nosePosition = {
//   cy: 100 + faceRadius * 0.3, // 얼굴 크기에 따라 코의 y 위치를 조정
// };

// // 코 구멍 크기와 위치
// const noseHoleSize = 5 * sizeRatio; // 코 구멍 크기
// const noseHoles = {
//   left: {
//     cx: 100 - noseSize.rx * 0.4, // 코 타원의 중심에서 좌측 위치
//     cy: nosePosition.cy, // 코 위치와 동일
//   },
//   right: {
//     cx: 100 + noseSize.rx * 0.4, // 코 타원의 중심에서 우측 위치
//     cy: nosePosition.cy, // 코 위치와 동일
//   },
// };
</script>

<style scoped>
.blink {
  animation: blinkAnim 3s infinite;
  transform-origin: center center;
}

@keyframes blinkAnim {
  0%,
  94%,
  100% {
    transform: scaleY(1);
  }
  95%,
  97% {
    transform: scaleY(0.1);
  }
}
.piggyMessage {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center; /* 아이콘과 텍스트 수직 정렬 */
  gap: 8px;
}
.iconImage {
  width: 60px;
  height: 60px;
  /* object-fit: contain; */
}
.dashboardTitle {
  gap: 10px;
}
.dashboard {
  padding: 2rem;
  margin: 0;
  background: linear-gradient(to bottom, #fff9fe, #ffffff);
  font-family: sans-serif;
  box-sizing: border-box;
  color: black;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem; /* 버튼들 간 간격 */
}

/* 다크모드 버튼 */
.darkModeButton {
  padding: 8px 12px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* 마이페이지 버튼 */
.mypageButton {
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
.logout {
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

/* 새 거래추가 버튼 */
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
.dark .dashboard {
  background: linear-gradient(to bottom, #121212, #121212);
  color: #1a1a2e;
}
.dark .dashboardHeader {
  background-color: #fbcee8;
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

.sectionGrid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.summaryGrid {
  display: flex;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}
/* .piggyAni {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex: 7;
} */
.dark .incomeCard,
.dark .expenseCard,
.dark .balanceCard,
.dark .savingsCard {
  background-color: #2e2e4d;
  /* opacity: 0.8; */
}
.incomeCard,
.expenseCard,
.balanceCard,
.savingsCard {
  /* flex: 3; */
  /* float: right; */
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* .savingsCard > .nowSavings,
.goalSavings {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
} */
.incomeCard > .cardValue {
  color: #10b981;
  font-size: 20px;
  font-weight: bold;
}
.expenseCard > .cardValue {
  color: #ef4444;
  font-size: 20px;
  font-weight: bold;
}
.balanceCard > .cardValue {
  color: #6366f1;
  font-size: 20px;
  font-weight: bold;
}

.savingsCard > .nowSavings > .cardValue,
.goalSavings > .cardValue {
  color: #f9a8d4;
  font-size: 20px;
  font-weight: bold;
}

.chartSection,
.transactionSection {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: stretch;
  width: 100%;
}

.dark .monthlyChart,
.dark .transactionHistory,
.dark .categorySummary,
.dark .piggyAni {
  background-color: #2e2e4d;
  opacity: 0.8;
}

.monthlyChart,
.transactionHistory {
  flex: 7;
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 0;
}

.categorySummary,
.piggyAni {
  flex: 3;
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 0;

  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
  align-items: center; /* 가로 가운데 정렬 */
  justify-content: flex-start;
}

.chartLabel {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.sectionTitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center; /* 아이콘과 텍스트 수직 정렬 */
  gap: 8px;
}

.transactionItem {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.transactionDate {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.transactionContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amountIncome {
  color: #1abc9c;
  font-weight: bold;
}

.amountExpense {
  color: #e74c3c;
  font-weight: bold;
}
.chartLegend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 14px;
  color: #333;
}

.legendItem {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.legendDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.incomeDot {
  background-color: #2ecc71;
}

.expenseDot {
  background-color: #e74c3c;
}

.summaryCards {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.dark .transactionItem {
  background-color: #e8e8e8;
}
.summaryCard {
  flex: 1 1 30%;
  padding: 16px;
  border-radius: 12px;
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.summaryLabel {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.summaryAmount {
  font-size: 20px;
  font-weight: bold;
}

.income .summaryAmount {
  color: #10b981;
}

.expense .summaryAmount {
  color: #ef4444;
}

.balance .summaryAmount {
  color: #6366f1;
}
</style>
