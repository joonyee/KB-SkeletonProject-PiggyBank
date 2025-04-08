<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboardHeader">
      <h1 class="dashboardTitle">💡 Piggy Bank</h1>
      <div class="flex items-center gap-2 relative">
        <button @click="toggleDarkMode" class="darkModeButton">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <button class="mypageButton" @click="mypageClick">마이페이지</button>
        <button class="inputValue" @click="inputClick">새 거래추가</button>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summaryGrid">
      <div class="incomeCard">
        <div class="cardLabel" @click="monthAmount">이번 달 수입</div>
        <div class="cardValue">₩{{ totalIncome.toLocaleString() }}</div>
      </div>
      <div class="expenseCard">
        <div class="cardLabel" @click="monthAmount">이번 달 지출</div>
        <div class="cardValue">₩{{ totalExpense.toLocaleString() }}</div>
      </div>
      <div class="balanceCard">
        <div class="cardLabel" @click="monthAmount">이번 달 잔액</div>
        <div class="cardValue">₩{{ balance.toLocaleString() }}</div>
      </div>
      <!-- <div class="piggyAni"></div> -->
      <div class="savingsCard">
        <div class="nowSavings">
          <div class="cardLabel" @click="savingClick">현재 저축률</div>
          <div class="cardValue">{{ savingsRate }}%</div>
        </div>
        <div class="goalSavings">
          <div class="cardLabel" @click="savingClick">목표 저축률</div>
          <div class="cardValue">{{ savingsRate }}%</div>
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
        <!-- <h2 class="section-title" @click="nowMonthClick">📌 이번 달 요약</h2>
        <div class="summary-cards">
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
        </div> -->
      </div>
    </div>

    <!-- Transaction Summary & History -->
    <div class="transactionSection">
      <div class="transactionHistory">
        <h2 class="sectionTitle" @click="transactionsClick">
          🧾 최근 거래내역
        </h2>
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
        <h2 class="sectionTitle" @click="categoryClick">📊 카테고리별 지출</h2>
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

const dropdownOpen = ref(false);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const logout = () => {
  console.log('로그아웃 실행됨');
};

const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

const chartData = ref([]);
const categorySpending = ref([]);
const transactions = ref([]);
const loading = ref(true); // 로딩 상태 추가

const fetchData = async () => {
  try {
    const chartResponse = await axios.get('http://localhost:3000/chartData');
    chartData.value = chartResponse.data;
    console.log('chartData:', chartData.value); // 데이터 형식 확인

    const categoryResponse = await axios.get(
      'http://localhost:3000/categorySpending'
    );
    categorySpending.value = categoryResponse.data;

    const transactionResponse = await axios.get(
      'http://localhost:3000/transactions'
    );
    transactions.value = transactionResponse.data;
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  } finally {
    loading.value = false; // 로딩 상태 종료
  }
};

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

const mypageClick = () => {
  //router.push('./mypage');
  alert('mypage page');
};

const inputClick = () => {
  //router.push('./inputValue');
  alert('money input');
};

const savingClick = () => {
  //router.push('./savings-card');
  alert('저축률 페이지');
};

const monthlyClick = () => {
  //router.push('./monthlychart');
  alert('월간 수입/지출 페이지');
};

const categoryClick = () => {
  //router.push('./categorypage');
  alert('카테고리 페이지 이동');
};

const transactionsClick = () => {
  //   router.push('/transaction'); 페이지 만들어서 라우팅 하면 끝
  alert('최근 거래내역 페이지 이동');
};

const monthAmount = () => {
  //router.push('./monthAmount');
  alert('이번달 요약이동');
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  margin: 0;
  background: linear-gradient(to bottom right, #ffe4e6, #ffffff);
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
  background-color: white;
  border: black solid 1px;
  border-radius: 0.5rem;
  padding: 12px 24px;
  cursor: pointer;
}

/* 새 거래추가 버튼 */
.inputValue {
  background-color: white;
  border: black solid 1px;
  border-radius: 0.5rem;
  padding: 12px 24px;
  cursor: pointer;
  flex-grow: 1;
  background-color: white;
}
.dark .dashboard {
  background: linear-gradient(to bottom right, #1f2937, #111827);
  color: black;
}
.dark .dashboardHeader {
  background-color: #ae7695;
}
.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9a8d4;
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
  background-color: #cecece;
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
  background-color: #cecece;
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
}

.chartLabel {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.sectionTitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
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
