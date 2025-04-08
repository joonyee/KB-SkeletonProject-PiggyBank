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
          <p v-if="day.income" class="income">{{ formatNumber(day.income) }}</p>
          <p v-if="day.expense" class="expense">
            {{ formatNumber(day.expense) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

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

const props = defineProps({
  year: Number,
  month: Number,
});
const emit = defineEmits(['update:year', 'update:month']);

const currentYear = ref(props.year);
const currentMonth = ref(props.month);
const calendarData = ref([]);
const transactions = ref([]);
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

function updateCalendarData() {
  const days = getCalendarDays(currentYear.value, currentMonth.value);
  days.forEach((day) => {
    const formatted = day.date.toISOString().split('T')[0];
    const dayTx = transactions.value.filter((tx) => tx.date === formatted);
    let incomeSum = 0,
      expenseSum = 0;
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

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/transactions');
    transactions.value = res.data;
    updateCalendarData();
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
});

watch([currentYear, currentMonth], updateCalendarData);
watch([currentYear, currentMonth], ([newYear, newMonth]) => {
  emit('update:year', newYear);
  emit('update:month', newMonth);
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function formatNumber(num) {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
</script>

<style scoped>
.calendar-wrapper {
  max-width: 1200px;
  margin: 1rem auto;
  background: #fff;
  padding: 1.5rem;
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
  height: 100px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
}

.cell-date {
  position: absolute;
  top: 8px;
  left: 8px;
  font-weight: 500;
}

.cell-details {
  margin-top: 30px;
  text-align: left;
  font-size: 0.8rem;
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
