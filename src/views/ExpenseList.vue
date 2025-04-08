<script setup>
import SummaryCard from '../components/SummaryCard.vue';
import TransactionTable from '../components/TransactionTable.vue';

const balance = '800,000원';
const income = '1,800,000원';
const expense = '1,000,000원';

const transactions = [
  {
    date: '2024-01-25',
    type: 'income',
    category: '급여',
    description: '1월 급여',
    amount: 1500000,
  },
  {
    date: '2024-01-20',
    type: 'income',
    category: '부수입',
    description: '프리랜서 수입',
    amount: 300000,
  },
  {
    date: '2024-01-15',
    type: 'expense',
    category: '주거비',
    description: '월세',
    amount: 800000,
  },
  {
    date: '2024-01-22',
    type: 'expense',
    category: '식비',
    description: '식료품',
    amount: 200000,
  },
];
</script>

<template>
  <div class="expense-main-container">
    <div class="expense-list">
      <h2 class="title">사용자님의 가계부</h2>
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
/* 메인 컨테이너 스타일 */
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
  /* min-height: 100vh; */
  padding: 30px;
  background-color: var(--background-color);
  border-radius: 15px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  max-width: 1200px;
  width: 100%;
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
