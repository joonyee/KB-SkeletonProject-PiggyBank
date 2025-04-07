<script setup>
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
  height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
}
.card {
  background-color: var(--background-color);
  padding: 30px;
  border-radius: 15px;
  width: 1200px;
  height: 600px;
  margin: auto; /* 수평 중앙 정렬  */
  border: 2px solid var(--primary-color);
}
.title {
  font: var(--ng-bold-28);
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 10px;
}
</style>
