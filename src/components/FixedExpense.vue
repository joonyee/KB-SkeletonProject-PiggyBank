<template>
  <h3>고정 지출</h3>
  <div class="fixed-expenses">
    <!-- 테이블 헤더 -->
    <div class="expense-header">
      <span>일자</span>
      <span>항목</span>
      <span>금액</span>
    </div>

    <!-- 고정 지출 항목 -->
    <div v-for="expense in expenses" :key="expense.id" class="expense-item">
      <span>{{ expense.day }}일</span>
      <span>{{ expense.description }}</span>
      <span>{{ expense.amount.toLocaleString() }}원</span>
    </div>

    <!-- 총합 -->
    <div class="total-expenses">총 {{ totalAmount.toLocaleString() }}원</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 고정 지출 데이터
const expenses = ref([]);

// 총합 계산
const totalAmount = ref(0);

// 데이터 가져오기
const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/fixedExpenses');
    expenses.value = res.data;

    // 총합 계산
    totalAmount.value = expenses.value.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.fixed-expenses {
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9fafb;
}

.expense-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2563eb;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.total-expenses {
  text-align: right;
  font-weight: bold;
  color: #111827;
  margin-top: 1rem;
}
</style>
