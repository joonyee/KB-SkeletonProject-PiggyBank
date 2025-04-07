<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1 class="dashboard-title">💡 Piggy Bank</h1>
      <div class="flex items-center gap-2 relative">
        <button @click="toggleDarkMode" class="darkMode-button">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <button class="mypage-button">마이페이지</button>
        <button class="inputValue">새 거래추가</button>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="income-card">
        <div class="card-label">이번 달 수입</div>
        <div class="card-value">₩{{ totalIncome.toLocaleString() }}</div>
      </div>
      <div class="expense-card">
        <div class="card-label">이번 달 지출</div>
        <div class="card-value">₩{{ totalExpense.toLocaleString() }}</div>
      </div>
      <div class="balance-card">
        <div class="card-label">이번 달 잔액</div>
        <div class="card-value">₩{{ balance.toLocaleString() }}</div>
      </div>
      <div class="savings-card">
        <div class="card-label">저축률</div>
        <div class="card-value">{{ savingsRate }}%</div>
      </div>
    </div>

    <!-- Monthly Chart & Category Spending -->
    <div class="chart-section">
      <div class="monthly-chart">
        <h2 class="section-title">📈 월간 수입/지출 추이</h2>
        <PieChart :chartData="chartData" />

        <!-- <div class="chart-bars">
            <div
              v-for="(item, index) in chartData"
              :key="index"
              class="chart-bar"
            >
              <div class="bar-wrapper">
                <div
                  class="income-bar"
                  :style="{ height: (item.income / maxChartValue) * 100 + '%' }"
                ></div>
                <div
                  class="expense-bar"
                  :style="{ height: (item.expense / maxChartValue) * 100 + '%' }"
                ></div>
              </div>
              <div class="chart-label">{{ item.month }}월</div>
            </div>
          </div> -->
        <!-- <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot income-dot"></span> 수입
            </div>
            <div class="legend-item">
              <span class="legend-dot expense-dot"></span> 지출
            </div>
          </div> -->
      </div>
      <div class="category-summary">
        <h2 class="section-title">📊 카테고리별 지출</h2>
        <CategoryPieChart :categorySpending="categorySpending" />
      </div>
    </div>

    <!-- Transaction Summary & History -->
    <div class="transaction-section">
      <div class="transaction-history">
        <h2 class="section-title">🧾 최근 거래내역</h2>
        <ul>
          <li
            v-for="(tx, index) in transactions"
            :key="index"
            class="transaction-item"
          >
            <div class="transaction-date">{{ tx.date }} {{ tx.category }}</div>
            <div class="transaction-content">
              <div>{{ tx.description }}</div>
              <div :class="tx.amount > 0 ? 'amount-income' : 'amount-expense'">
                ₩{{ Math.abs(tx.amount).toLocaleString() }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="monthly-summary">
        <h2 class="section-title">📌 이번 달 요약</h2>
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
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref, computed } from 'vue';
import CategoryPieChart from '@/components/CategoryPieChart.vue';
import PieChart from '@/components/PieChart.vue';

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

const chartData = [
  { month: 9, income: 100, expense: 70 },
  { month: 10, income: 120, expense: 90 },
  { month: 11, income: 110, expense: 80 },
  { month: 12, income: 115, expense: 85 },
  { month: 1, income: 110, expense: 40 },
];

const maxChartValue = Math.max(
  ...chartData.map((item) => Math.max(item.income, item.expense))
);

const categorySpending = [
  { category: '식비', amount: 320000, percent: 32 },
  { category: '교통비', amount: 150000, percent: 15 },
  { category: '주거비', amount: 250000, percent: 25 },
  { category: '통신비', amount: 130000, percent: 13 },
];

const transactions = [
  {
    date: '2024-01-15',
    category: '식비',
    description: '점심식사',
    amount: -15000,
  },
  {
    date: '2024-01-14',
    category: '급여',
    description: '1월 급여',
    amount: 3000000,
  },
  {
    date: '2024-01-13',
    category: '교통비',
    description: '택시',
    amount: -25000,
  },
];

const totalIncome = computed(() =>
  transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
);
const totalExpense = computed(() =>
  transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
);
const balance = computed(() => totalIncome.value - totalExpense.value);

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return Math.round((balance.value / totalIncome.value) * 100);
});
</script> -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import CategoryPieChart from '@/components/CategoryPieChart.vue';
import PieChart from '@/components/PieChart.vue';

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
.darkMode-button {
  padding: 8px 12px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* 마이페이지 버튼 */
.mypage-button {
  background-color: white;
  border: black solid 1px;
  border-radius: 0.5rem;
  padding: 8px 16px;
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

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9a8d4;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}
.income-card,
.expense-card,
.balance-card,
.savings-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-section,
.transaction-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: stretch;
}

.monthly-chart,
.transaction-history,
.category-summary,
.monthly-summary {
  flex: 1;
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.transaction-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.transaction-history {
  flex: 7;
}

.monthly-summary {
  flex: 3;
}

.chart-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.monthly-chart {
  flex: 7;
}

.category-summary {
  flex: 3;
}

/* .chart-bars {
    display: flex;
    justify-content: space-around; 
    align-items: flex-end;
    width: 100%;
    height: 200px;
    margin-top: 1rem;
    padding: 0 1rem;
  }
  
  .chart-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    height: 100%;
  }
  
  .bar-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 100%;
  }
  .income-bar,
  .expense-bar {
    width: 12px;
    border-radius: 4px;
  }
  
  .income-bar {
    background-color: #4ade80; 
  }
  
  .expense-bar {
    background-color: #f87171; 
  } */

.chart-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.transaction-history {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.transaction-item {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.transaction-date {
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
}

.transaction-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-income {
  color: #1abc9c;
  font-weight: bold;
}

.amount-expense {
  color: #e74c3c;
  font-weight: bold;
}
.chart-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 14px;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.income-dot {
  background-color: #2ecc71;
}

.expense-dot {
  background-color: #e74c3c;
}

.summary-cards {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1 1 30%;
  padding: 16px;
  border-radius: 12px;
  background-color: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.summary-label {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.summary-amount {
  font-size: 20px;
  font-weight: bold;
}

.income .summary-amount {
  color: #10b981;
}

.expense .summary-amount {
  color: #ef4444;
}

.balance .summary-amount {
  color: #6366f1;
}
</style>
