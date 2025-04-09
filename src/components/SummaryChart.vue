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
        <div class="label">{{ catName }}</div>
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

// 상위 컴포넌트에서 연도(year)와 월(month)을 props로 전달받음.
// month는 1부터 12까지의 값
const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
});

const transactions = ref([]);

// 전달받은 연도와 월에 해당하는 거래 내역 필터링
const monthlyTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    const [txYear, txMonth] = tx.date.split('-');
    return Number(txYear) === props.year && Number(txMonth) === props.month;
  });
});

// 총 수입: amount > 0
const totalIncome = computed(() =>
  monthlyTransactions.value
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 총 지출: amount < 0
const totalExpense = computed(() =>
  monthlyTransactions.value
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 잔액: 수입 + 지출 (지출은 음수)
const balance = computed(() => totalIncome.value + totalExpense.value);

// 카테고리별 지출 합산 (음수 데이터만, 최종 표시 시 절대값으로 표시)
const negativeCategorySums = computed(() => {
  const result = {};
  monthlyTransactions.value.forEach((tx) => {
    if (tx.amount < 0) {
      if (!result[tx.category]) result[tx.category] = 0;
      result[tx.category] += tx.amount;
    }
  });
  return result;
});

// 가장 큰 지출 금액(절댓값) 기준을 잡아 진행 바의 길이 비율 결정
const maxAbsExpense = computed(() => {
  const sums = Object.values(negativeCategorySums.value);
  return sums.length === 0 ? 1 : Math.max(...sums.map((val) => Math.abs(val)));
});

// 각 카테고리 막대 너비 계산 함수
const getBarWidth = (amount) => {
  const ratio = Math.abs(amount) / maxAbsExpense.value;
  return Math.round(ratio * 100);
};

// 모든 금액은 절대값으로, 천단위 콤마 적용
const formatMoney = (num) => {
  if (!num) return '0';
  return Math.abs(num).toLocaleString('ko-KR');
};

// 거래 데이터 로드
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/transactions');
    transactions.value = res.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
});
</script>

<style scoped>
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
