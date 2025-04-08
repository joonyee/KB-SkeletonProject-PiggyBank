<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SummaryCard from '../components/SummaryCard.vue';
import TransactionTable from '../components/TransactionTable.vue';

const balance = ref('');
const income = ref('');
const expense = ref('');
const transactions = ref([]);

// DB에서 데이터 가져오기
const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions');
    transactions.value = response.data;
    calculateSummary();
    console.log('데이터 불러오기 성공');
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
};

// 잔액, 수입, 지출 계산
const calculateSummary = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.value.forEach((item) => {
    if (item.type === 'income') {
      totalIncome += item.amount;
    } else if (item.type === 'expense') {
      totalExpense += item.amount;
    }
  });

  income.value = `${totalIncome.toLocaleString()}원`;
  expense.value = `${totalExpense.toLocaleString()}원`;
  balance.value = `${(totalIncome - totalExpense).toLocaleString()}원`;
};

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="expense-main-container">
    <div class="expense-list">
      <h2 class="title">은지미님의 가계부</h2>
      <div class="summary">
        <SummaryCard title="잔액" :amount="balance" />
        <SummaryCard title="이번달 수입" :amount="income" type="income" />
        <SummaryCard title="이번달 지출" :amount="expense" type="expense" />
      </div>
      <TransactionTable :transactions="transactions" />
    </div>
  </div>
</template>

<style scoped>
.expense-main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
}

.expense-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background-color: var(--background-color);
  border-radius: 15px;
  max-width: 1300px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font: var(--ng-bold-24);
  margin-bottom: 20px;
  text-align: center;
}

.summary {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}
</style>
