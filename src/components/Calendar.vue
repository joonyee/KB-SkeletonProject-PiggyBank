<template>
  <div class="calendar-wrapper">
    <header class="calendar-header">
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
      <div class="right-section">
        <button class="arrow-button" @click="prevMonth">←</button>
        <button class="arrow-button" @click="nextMonth">→</button>
      </div>
    </header>

    <div class="daynames">
      <div class="dayname" v-for="(dn, i) in dayNames" :key="i">
        {{ dn }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in calendarData"
        :key="index"
        class="calendar-cell"
        :class="{ 'non-current': !day.isCurrentMonth }"
      >
        <span class="cell-date">{{ day.date.getDate() }}</span>
        <div class="cell-details">
          <!-- 수입/지출 표시 -->
          <p v-if="day.income" class="income">
            +{{ formatNumber(day.income) }}
          </p>
          <p v-if="day.expense" class="expense">
            -{{ formatNumber(day.expense) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

// 달력(6주, 최대 42칸) 생성
function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const days = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      income: null,
      expense: null,
    });
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// 달력 상태
const currentYear = ref(2025);
const currentMonth = ref(3); // 예: 3이면 4월
const calendarData = ref([]);

// transactions: db.json에서 받아올 전체 거래 내역
const transactions = ref([]);

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 데이터 업데이트
function updateCalendarData() {
  const days = getCalendarDays(currentYear.value, currentMonth.value);
  days.forEach((day) => {
    const formatted = day.date.toISOString().split('T')[0];
    // 해당 날짜의 거래 필터링
    const dayTx = transactions.value.filter((tx) => tx.date === formatted);

    let incomeSum = 0;
    let expenseSum = 0;
    dayTx.forEach((tx) => {
      if (tx.amount > 0) {
        incomeSum += tx.amount;
      } else {
        expenseSum += Math.abs(tx.amount);
      }
    });

    day.income = incomeSum || null;
    day.expense = expenseSum || null;
  });
  calendarData.value = days;
}

// db.json에서 /transactions 데이터 로드
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/transactions');
    // res.data가 [{...}, {...}] 형식이라고 가정
    transactions.value = res.data;
    updateCalendarData();
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
});

// currentYear, currentMonth가 바뀌면 달력 갱신
watch([currentYear, currentMonth], updateCalendarData);

// 이전 달
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

// 다음 달
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

// 숫자 천단위 콤마
function formatNumber(num) {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.calendar-wrapper {
  max-width: 1000px;
  margin: 1rem auto;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.right-section {
  display: flex;
  gap: 0.5rem;
}

.arrow-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.daynames {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #64748b;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.calendar-cell {
  position: relative;
  height: 70px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px;
}

.cell-date {
  position: absolute;
  top: 4px;
  left: 4px;
  font-weight: 500;
}

.cell-details {
  margin-top: 16px;
  text-align: center;
}

.income {
  color: #16a34a;
}

.expense {
  color: #ef4444;
}

.non-current {
  opacity: 0.5;
}
</style>
