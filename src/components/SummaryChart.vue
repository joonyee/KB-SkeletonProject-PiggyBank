<template>
  <div class="month-summary-container">
    <!-- 상단 요약 영역 -->
    <div class="summary-header">
      <div class="summary-box income">
        총 수입<br />{{ formatMoney(totalIncome) }}
      </div>
      <div class="summary-box expense">
        총 지출<br />{{ formatMoney(totalExpense) }}
      </div>
      <div class="summary-box balance">
        잔액<br />{{ formatMoney(balance) }}
      </div>
    </div>

    <!-- 카테고리별 지출 진행 바 -->
    <div class="category-bars">
      <h3>카테고리별 지출 현황</h3>
      <div
        v-for="(catSum, catName) in negativeCategorySums"
        :key="catName"
        class="category-bar"
      >
        <div class="label">{{ getCategoryName(catName) }}</div>
        <div class="bar-container">
          <div class="bar" :style="{ width: getBarWidth(catSum) + '%' }"></div>
        </div>
        <div class="amount">{{ formatMoney(catSum) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
});

const transactions = ref([]);
const categoryData = ref([]);
const fixedExpenses = ref([]);
// 전달받은 연도와 월에 해당하는 거래 내역 필터링
const monthlyTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    const [txYear, txMonth] = tx.date.split('-');
    return Number(txYear) === props.year && Number(txMonth) === props.month;
  });
});

const getCategoryName = (catId) => {
  const cat = categoryData.value.find((c) => c.id === Number(catId));
  return cat ? cat.name : '기타';
};

// 총 수입: typeid === 1
const totalIncome = computed(() =>
  monthlyTransactions.value
    .filter((tx) => tx.typeid === 1) // 수입만 필터링
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 총 지출: typeid === 2
const totalExpense = computed(() => {
  const transactionExpenses = monthlyTransactions.value
    .filter((tx) => tx.typeid === 2) // 지출만 필터링
    .reduce((sum, tx) => sum + tx.amount, 0);

  const fixedExpensesTotal = fixedExpenses.value.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return transactionExpenses + fixedExpensesTotal;
});

// 잔액: 수입 - 지출
const balance = computed(() => totalIncome.value - totalExpense.value);

// 카테고리별 지출 합산 (typeid === 2만 포함)
const negativeCategorySums = computed(() => {
  const result = {};
  monthlyTransactions.value.forEach((tx) => {
    if (tx.typeid === 2) {
      // 지출만 처리
      if (!result[tx.categoryid]) result[tx.categoryid] = 0;
      result[tx.categoryid] += tx.amount;
    }
  });
  return result;
});

// 가장 큰 지출 금액 기준으로 진행 바의 길이 비율 결정
const maxAbsExpense = computed(() => {
  const sums = Object.values(negativeCategorySums.value);
  return sums.length === 0 ? 1 : Math.max(...sums);
});

// 각 카테고리 막대 너비 계산 함수
const getBarWidth = (amount) => {
  const ratio = amount / maxAbsExpense.value;
  return Math.round(ratio * 100);
};

// 금액을 천 단위 콤마로 포맷
const formatMoney = (num) => {
  if (!num) return '0';
  return num.toLocaleString('ko-KR');
};

// 거래 데이터 로드
onMounted(async () => {
  try {
    const [moneyRes, categoryRes, expenseRes] = await Promise.all([
      axios.get('http://localhost:3000/money'),
      axios.get('http://localhost:3000/category'),
      axios.get('http://localhost:3000/fixedExpenses'),
    ]);

    transactions.value = moneyRes.data;
    categoryData.value = categoryRes.data;
    fixedExpenses.value = expenseRes.data;
  } catch (error) {
    console.error('Failed to fetch transactions or categories:', error);
  }
});
</script>

<style scoped>
.dark .month-summary-container,
.dark .summary-header {
  background-color: #374151; /* dark:bg-gray-800 */
  color: #f9fafb; /* dark:text-gray-200 */
}
.month-summary-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

/* 상단 요약 영역 */
.summary-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  text-align: center;
}

.summary-box {
  flex: 1;
  margin: 0 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* 예시 색상 (녹색 / 빨간색 / 파랑) */
.summary-box.income {
  color: #10b981; /* 녹색 */
}
.summary-box.expense {
  color: #ef4444; /* 빨간색 */
}
.summary-box.balance {
  color: #3b82f6; /* 파랑 */
}

/* 카테고리 바 리스트 */
.category-bars {
  margin-top: 2rem;
}
.category-bars h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #374151;
}

.category-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

/* 카테고리 이름 */
.category-bar .label {
  width: 80px;
  font-size: 0.875rem;
  color: #374151;
}

/* 가로 막대 컨테이너 */
.bar-container {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  margin: 0 1rem;
  position: relative;
}

/* 실제 막대 */
.bar-container .bar {
  height: 100%;
  background: #3b82f6; /* 파랑 막대 */
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 금액 표시 */
.category-bar .amount {
  width: 80px;
  text-align: right;
  font-size: 0.875rem;
  color: #374151;
}
</style>
