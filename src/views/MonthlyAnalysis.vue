<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ChartCard from '../components/ChartCard.vue';
import SavingsModal from '../components/SavingsModal.vue';

const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

const income = ref(0);
const expense = ref(0);
const balance = ref(0);
const savingsRate = ref(0);
const previousExpense = ref(0);
const budget = ref(700000);

const savingsModalVisible = ref(false);
const goalRate = ref(80);

const toggleSavingsModal = () => {
  savingsModalVisible.value = !savingsModalVisible.value;
};

const updateSavingsSettings = ({ monthlyIncome, savingsRate: newRate }) => {
  income.value = monthlyIncome;
  savingsRate.value = newRate;
};

const fetchMonthlyData = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.id) {
      console.error('로그인한 사용자 정보가 없습니다.');
      return;
    }

    const res = await axios.get('http://localhost:3000/money');
    const data = res.data;

    const userData = data.filter((item) => item.userid === currentUser.id);

    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .slice(0, 7);

    const currentMonthData = userData.filter(
      (item) => item.date.slice(0, 7) === currentMonth
    );
    const prevMonthData = userData.filter(
      (item) => item.date.slice(0, 7) === previousMonth
    );

    let totalIncome = 0;
    let totalExpense = 0;
    let prevExpense = 0;

    currentMonthData.forEach((item) => {
      if (item.typeid === 1) totalIncome += item.amount;
      else if (item.typeid === 2) totalExpense += item.amount;
    });

    prevMonthData.forEach((item) => {
      if (item.typeid === 2) prevExpense += item.amount;
    });

    income.value = totalIncome;
    expense.value = totalExpense;
    balance.value = totalIncome - totalExpense;
    previousExpense.value = prevExpense;
    savingsRate.value =
      totalIncome > 0 ? ((balance.value / totalIncome) * 100).toFixed(1) : 0;
  } catch (err) {
    console.error('데이터 불러오기 실패:', err);
  }
};

onMounted(fetchMonthlyData);
</script>

<template>
  <div class="monthly-analysis-container">
    <!-- 수입, 지출, 잔액, 저축률  -->
    <div class="summary-cards">
      <div class="summary-card">
        <h3>이번 달 수입</h3>
        <p class="income">{{ income.toLocaleString() }}원</p>
      </div>
      <div class="summary-card">
        <h3>이번 달 지출</h3>
        <p class="expense">{{ expense.toLocaleString() }}원</p>
      </div>
      <div class="summary-card">
        <h3>이번 달 잔액</h3>
        <p class="balance">{{ balance.toLocaleString() }}원</p>
      </div>

      <!-- 저축률  -->
      <div class="summary-card savings-card" @click="toggleSavingsModal">
        <h3>저축률</h3>
        <div class="savings-content">
          <div class="savings-section">
            <p class="savings-rate">{{ savingsRate }}%</p>
            <p class="savings-label">현재 저축률</p>
          </div>
          <div class="divider"></div>
          <div class="savings-section">
            <p class="goal-rate">{{ goalRate }}%</p>
            <p class="goal-label">목표 저축률</p>
          </div>
        </div>
      </div>

      <!-- 저축률 설정 모달  -->
      <SavingsModal
        v-if="savingsModalVisible"
        :show="savingsModalVisible"
        @close="toggleSavingsModal"
        @update="updateSavingsSettings"
      />
    </div>

    <div class="month-header">
      <h2>{{ month }}월 {{ year }}년</h2>
    </div>

    <div class="middle-section">
      <!-- 이번달 총 지출 -->
      <div class="part-card total-expense-card">
        <div class="expense-header">
          <i class="fa-solid fa-magnifying-glass"></i>
          <h3>이번달 총 지출</h3>
        </div>
        <p class="total-expense">{{ expense.toLocaleString() }}원</p>
        <p class="comparison">
          지난 달보다
          <span class="comparison-money">
            {{ (expense - previousExpense).toLocaleString() }}원
          </span>
        </p>
      </div>

      <!-- 월별 비교 -->
      <div class="part-card">
        <h2>월별 비교</h2>
        <ChartCard
          chartType="bar"
          :chartData="{
            labels: ['지난 달', '이번 달'],
            datasets: [
              {
                label: '지출',
                data: [previousExpense, expense],
                backgroundColor: '#ffc7ef',
              },
              {
                label: '수입',
                data: [1000000, income],
                backgroundColor: '#ffe8fc',
              },
            ],
          }"
          :options="{
            plugins: {
              legend: { display: true },
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }"
        />
      </div>

      <!-- 예산 대비 -->
      <div class="part-card">
        <h2>예산 대비</h2>
        <ChartCard
          chartType="doughnut"
          :chartData="{
            labels: ['예산', '실제 지출'],
            datasets: [
              {
                label: '비율',
                data: [budget - expense, expense],
                backgroundColor: ['#ffe8fc', '#ffc7ef'],
              },
            ],
          }"
        />
      </div>
    </div>

    <!-- 주간별 분석 -->
    <!-- <div class="part-card weekly-chart">
      <h2>주간별 분석</h2>
      <ChartCard
        chartType="line"
        :chartData="{
          labels: ['1주', '2주', '3주', '4주'],
          datasets: [
            {
              label: '지출 변화',
              data: weeklyExpenses,
              fill: false,
              borderColor: '#ffc7ef',
              tension: 0.4,
            },
          ],
        }"
      />
      <p class="weekly-average">
        주간 평균: {{ weeklyAverage.toLocaleString() }}원
      </p>
    </div> -->
  </div>
</template>

<style scoped>
.monthly-analysis-container {
  max-width: 1200px;
  background-color: var(--background-color);
  margin: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.summary-cards {
  display: flex;
  gap: 10px;
  justify-content: space-around;
  margin-bottom: 10px;
  /* flex-wrap: wrap; */
}

.summary-card {
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 12px;
  text-align: center;
  font: var(--ng-reg-20);
  color: var(--text-color);
  min-width: 250px;
  flex: 1;
  margin: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.income {
  font: var(--ng-bold-28);
  color: var(--text-income);
}

.expense {
  font: var(--ng-bold-28);
  color: var(--text-expense);
}

.balance {
  font: var(--ng-bold-28);
  color: var(--text-balance);
}

.savings {
  font: var(--ng-bold-28);
  color: var(--hot-pink);
}

.savings-card {
  padding: 15px;
  background-color: var(--background-color);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.savings-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 5px;
}
.savings-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.savings-rate {
  font: var(--ng-bold-28);
  color: var(--hot-pink);
  margin: 0;
}

.goal-rate {
  font: var(--ng-bold-28);
  color: var(--text-color);
  margin: 0;
}

.savings-label,
.goal-label {
  font: var(--ng-reg-18);
  color: var(--text-secondary);
}

.divider {
  width: 0.1px;
  height: 75px;
  background-color: var(--text-secondary);
}

.month-header {
  text-align: left;
  margin: 10px 10px;
  font: var(--ng-bold-26);
}

.middle-section {
  display: flex;
  gap: 20px;
  justify-content: space-around;
  flex-wrap: wrap;
}

.part-card {
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 12px;
  text-align: center;
  flex: 1;
  min-width: 250px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.total-expense-card {
  text-align: left;
  padding: 20px;
  /* background-color: var(--b-color); */
  border-radius: 12px;
}

.expense-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font: var(--ng-reg-24);
  color: var(--text-color);
}

.expense-header i {
  font-size: 24px;
}

.total-expense {
  font: var(--ng-bold-28);
  color: var(--text-color);
}

.comparison {
  margin-top: 5px;
  font: var(--ng-reg-20);
  color: var(--text-balance);
}

.comparison-money {
  color: var(--text-balance);
  font: var(--ng-bold-24);
}
.chart-container {
  height: 250px;
  width: 100%;
}
</style>
